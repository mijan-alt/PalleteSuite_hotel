'use client'
import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { BusinessLocation } from '@/payload-types'

interface MapProps {
  businessLocation: BusinessLocation
  height?: string
  className?: string
}

export const LocationMap: React.FC<MapProps> = ({
  businessLocation,
  height = '500px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [zoom, setZoom] = useState(businessLocation.defaultZoom || 14)
  const [lng, setLng] = useState(businessLocation.longitude)
  const [lat, setLat] = useState(businessLocation.latitude)
  const [showInfo, setShowInfo] = useState(businessLocation.showBusinessInfo ?? true)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = businessLocation.mapboxAccessToken

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    })

    mapRef.current = map

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    map.on('load', function () {
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.backgroundImage =
        'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)'
      el.style.width = '50px'
      el.style.height = '50px'
      el.style.backgroundSize = '100%'
      el.style.cursor = 'pointer'

      // Create popup for business info
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div style="padding: 12px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${businessLocation.businessName}</h3>
            <p style="margin: 4px 0; font-size: 13px; color: #555;">
              <strong>📍</strong> ${businessLocation.address}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #555;">
              <strong>📞</strong> <a href="tel:${businessLocation.phone}" style="color: #2563eb;">${businessLocation.phone}</a>
            </p>
            ${
              businessLocation.email
                ? `
              <p style="margin: 4px 0; font-size: 13px; color: #555;">
                <strong>✉️</strong> <a href="mailto:${businessLocation.email}" style="color: #2563eb;">${businessLocation.email}</a>
              </p>
            `
                : ''
            }
            <p style="margin: 4px 0; font-size: 13px; color: #555;">
              <strong>🕐</strong> ${businessLocation.hours}
            </p>
            ${
              businessLocation.description
                ? `
              <p style="margin: 8px 0 4px 0; font-size: 12px; color: #666;">
                ${businessLocation.description}
              </p>
            `
                : ''
            }
          </div>
        `)

      // Add marker with popup
      new mapboxgl.Marker(el)
        .setLngLat([businessLocation.longitude, businessLocation.latitude])
        .setPopup(popup)
        .addTo(map)

      // Show popup on load
      setTimeout(() => {
        popup.addTo(map)
      }, 500)

      // Add service area circle if enabled
      if (businessLocation.showServiceArea && businessLocation.serviceRadiusKm) {
        map.addSource('service-area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [businessLocation.longitude, businessLocation.latitude],
            },
            properties: {},
          },
        })

        map.addLayer({
          id: 'service-area-circle',
          type: 'circle',
          source: 'service-area',
          paint: {
            'circle-radius': {
              stops: [
                [0, 0],
                [20, businessLocation.serviceRadiusKm * 10000],
              ],
              base: 2,
            },
            'circle-color': '#3b82f6',
            'circle-opacity': 0.1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#3b82f6',
            'circle-stroke-opacity': 0.3,
          },
        })
      }
    })

    // Update coordinates on move
    map.on('move', () => {
      setLng(Number(map.getCenter().lng.toFixed(4)))
      setLat(Number(map.getCenter().lat.toFixed(4)))
      setZoom(Number(map.getZoom().toFixed(2)))
    })

    return () => map.remove()
  }, [businessLocation])

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${businessLocation.latitude},${businessLocation.longitude}`
    window.open(url, '_blank')
  }

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [businessLocation.longitude, businessLocation.latitude],
        zoom: businessLocation.defaultZoom || 14,
        duration: 1500,
      })
    }
  }

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLng = position.coords.longitude
          const userLat = position.coords.latitude

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [userLng, userLat],
              zoom: 12,
              duration: 1500,
            })

            // Add user location marker
            new mapboxgl.Marker({ color: '#ef4444' })
              .setLngLat([userLng, userLat])
              .setPopup(new mapboxgl.Popup().setHTML('<p style="margin: 8px;">Your Location</p>'))
              .addTo(mapRef.current)
          }
        },
        () => {
          alert('Unable to retrieve your location')
        },
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  return (
    <div className={`relative w-full ${className}`} style={{ height }}>
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleGetDirections}
          className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Navigation size={16} />
          Get Directions
        </button>

        <button
          onClick={handleCenterMap}
          className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors border border-gray-200"
        >
          <MapPin size={16} />
          Center Map
        </button>

        <button
          onClick={handleLocateUser}
          className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors border border-gray-200"
        >
          <Navigation size={16} />
          My Location
        </button>
      </div>

      {/* Business Info Card */}
      {showInfo && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-xl p-4 max-w-sm border border-gray-200">
          <button
            onClick={() => setShowInfo(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-3 text-gray-900">{businessLocation.businessName}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{businessLocation.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary flex-shrink-0" />
              <a href={`tel:${businessLocation.phone}`} className="text-blue-600 hover:underline">
                {businessLocation.phone}
              </a>
            </div>

            {businessLocation.email && (
              <div className="flex items-center gap-2">
                <span className="text-primary flex-shrink-0">✉️</span>
                <a
                  href={`mailto:${businessLocation.email}`}
                  className="text-primary hover:underline text-xs"
                >
                  {businessLocation.email}
                </a>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{businessLocation.hours}</span>
            </div>
          </div>

          {businessLocation.description && (
            <p className="mt-3 text-xs text-gray-600 border-t pt-3">
              {businessLocation.description}
            </p>
          )}

          <div className="mt-3 pt-3 border-t">
            <span
              className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                businessLocation.isOpen ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  businessLocation.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              {businessLocation.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      )}

      {/* Show Info Button (when card is hidden) */}
      {!showInfo && (
        <button
          onClick={() => setShowInfo(true)}
          className="absolute bottom-4 left-4 z-10 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors border border-gray-200"
        >
          Show Business Info
        </button>
      )}

      {/* Coordinates Display */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-90 text-white px-3 py-2 rounded text-xs font-mono z-10">
        {lng}, {lat} | Zoom: {zoom}
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
}
