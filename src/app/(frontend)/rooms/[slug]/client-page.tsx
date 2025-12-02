// app/rooms/[slug]/client-page.tsx
'use client'

import { useState } from 'react'
import { format, differenceInDays } from 'date-fns'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Bed, Users, Ruler, Star, CalendarIcon } from 'lucide-react'
import { GalleryHorizontalIcon } from 'lucide-react'
import { Room } from '@/payload-types'
import { X } from 'lucide-react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useEffect } from 'react'
import { RoomAmenities } from '@/components/Room/amenities'
import { Breadcrumbs } from '@/components/Room/BreadCrumbs'
import { WhatsAppInquiryButton } from '@/components/Room/WhatsappInquiryButton'
import { LocationSection } from '@/components/Room/LocationSection'
import { BusinessLocation } from '@/payload-types'
import { LocationMap } from '@/components/Map'

interface RoomClientPageProps {
  room: Room
  businessLocation: BusinessLocation
}

export function RoomClientPage({ room, businessLocation }: RoomClientPageProps) {
  // Booking state
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(1)

  // Dialogs
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Then use: numberOfMonths={windowWidth >= 640 ? 2 : 1}
  const openLightbox = (index: number) => setSelectedImageIndex(index)
  const closeLightbox = () => setSelectedImageIndex(null)

  // Derived values
  const hasValidDates = checkIn && checkOut && checkOut > checkIn
  const totalNights = hasValidDates ? differenceInDays(checkOut!, checkIn!) : 0
  const totalPrice = hasValidDates ? totalNights * room.pricePerNight : 0

  const images = room.gallery || []
  const hasMultipleImages = images.length > 1
  const hasImages = images.length > 0
  const showGalleryIcon = images.length > 1

  console.log('number of guests', room.features?.guests)

  // Handlers
  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!hasValidDates || !checkIn || !checkOut) return

    setIsSubmitting(true) // ← Activate full-screen loader

    try {
      const formData = new FormData(e.currentTarget)

      const payload = {
        room: room.id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests: Number(formData.get('guests') || guests),
        totalNights,
        pricePerNight: room.pricePerNight,
        totalPrice,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
        status: 'confirmed',
        bookingSource: 'online',
      }

      const res = await fetch('/api/frontend/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Booking confirmed!', {
          description: 'We’ve sent you a confirmation email.',
        })
        setShowBookingForm(false)
        setCheckIn(undefined)
        setCheckOut(undefined)
        setGuests(2)
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      toast.error('Booking failed', {
        description: 'Please check your details and try again.',
      })
    } finally {
      setIsSubmitting(false) // ← Always turn off loader
    }
  }

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: room.id,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
      }),
    })

    if (res.ok) {
      toast.success('Inquiry sent!', { description: "We'll get back to you soon." })
      setShowInquiryDialog(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-24 lg:pb-8">
        {/* Hero Gallery */}
        <div className="max-w-7xl mx-auto mt-8 px-4 lg:px-8 pt-4 lg:pt-8">
          <div className="py-8">
            <Breadcrumbs
              items={[
                { label: 'Rooms & Suites', href: '/rooms' },
                { label: room.name, href: `/rooms/${room.slug}` },
              ]}
            />
          </div>
          {hasImages ? (
            <div className="relative">
              {/* Desktop: 1, 2, or 3 images with smart layout */}
              <div
                className="hidden lg:grid gap-4 cursor-pointer rounded-3xl overflow-hidden"
                style={{
                  gridTemplateColumns: images.length === 3 ? '2fr 1fr' : '1fr 1fr',
                  gridTemplateRows: images.length === 3 ? '1fr 1fr' : '1fr',
                  height: images.length === 1 ? '640px' : '560px',
                }}
                onClick={() => setIsGalleryOpen(true)}
              >
                {/* First image */}
                <div
                  className={`relative overflow-hidden rounded-3xl shadow-2xl ${
                    images.length === 1
                      ? 'col-span-2 row-span-2'
                      : images.length === 3
                        ? 'row-span-2'
                        : ''
                  }`}
                >
                  {typeof images[0].image === 'object' && (
                    <Media resource={images[0].image} fill imgClassName="object-cover" priority />
                  )}
                </div>

                {/* Second image (only if 2 or 3) */}
                {images.length >= 2 && (
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    {typeof images[1].image === 'object' && (
                      <Media resource={images[1].image} fill imgClassName="object-cover" />
                    )}
                  </div>
                )}

                {/* Third image (only if 3) */}
                {images.length === 3 && (
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    {typeof images[2].image === 'object' && (
                      <Media resource={images[2].image} fill imgClassName="object-cover" />
                    )}
                  </div>
                )}
              </div>

              {/* Mobile: Only first image + gallery icon */}
              <div
                className="lg:hidden relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
              >
                {typeof images[0].image === 'object' && (
                  <Media resource={images[0].image} fill imgClassName="object-cover" priority />
                )}
              </div>

              {/* Gallery Icon + Count (bottom right) */}
              {showGalleryIcon && (
                <div
                  className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-full px-5 py-3 shadow-2xl flex items-center gap-3 cursor-pointer hover:bg-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsGalleryOpen(true)
                  }}
                >
                  <GalleryHorizontalIcon className="w-6 h-6 text-black" />
                  <span className="font-medium text-black">
                    {images.length} {images.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
              )}

              {/* "More" overlay on last visible image (if >3) */}
              {images.length > 3 && (
                <div className="hidden lg:block absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl">
                  <Badge className="text-3xl font-bold bg-white/90 text-black px-8 py-4">
                    +{images.length - 3} more
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-full h-96" />
          )}
        </div>
        {/* ==== GALLERY MODAL (white, masonry) ==== */}
        {isGalleryOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 z-[100]"
              onClick={() => setIsGalleryOpen(false)}
            />

            {/* Gallery Modal */}
            <div className="fixed inset-0 z-[101] flex flex-col bg-white">
              {/* Top Bar */}
              <div className="fixed top-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-xl border-b z-10 flex items-center justify-between px-8">
                <div>
                  <h2 className="text-4xl font-light tracking-tight">Gallery • {room.name}</h2>
                  <p className="text-muted-foreground text-lg">{images.length} photos</p>
                </div>
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="bg-white hover:bg-gray-100 rounded-full p-4 shadow-xl transition-all"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Masonry */}
              <div className="flex-1 pt-24 overflow-y-auto">
                <div className="px-6 pb-12">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{ 350: 1, 750: 2, 1024: 3, 1440: 4, 1920: 5 }}
                  >
                    <Masonry gutter="20px">
                      {images.map((item: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => openLightbox(index)}
                          className="mb-5 cursor-zoom-in overflow-hidden hover:opacity-90 transition-opacity duration-300"
                        >
                          {typeof item.image === 'object' && (
                            <Media
                              resource={item.image}
                              imgClassName="w-full h-auto object-cover block"
                              priority={index < 8}
                            />
                          )}
                        </div>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==== LIGHTBOX (black, full-screen image) – ALWAYS ON TOP ==== */}
        {selectedImageIndex !== null && (
          <>
            {/* Darker, stronger backdrop */}
            <div className="fixed inset-0 bg-black/98 z-[200]" onClick={closeLightbox} />

            {/* Lightbox Modal – higher z-index than gallery */}
            <div className="fixed inset-0 z-[200] flex flex-col bg-black">
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute top-8 right-8 z-50 bg-white/90 hover:bg-white rounded-full p-4 shadow-2xl transition-all"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Prev / Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((i) => (i! - 1 + images.length) % images.length)
                    }
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white rounded-full p-5 shadow-2xl transition-all"
                  >
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((i) => (i! + 1) % images.length)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white rounded-full p-5 shadow-2xl transition-all"
                  >
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image */}
              <div className="relative flex-1 flex items-center  px-32">
                {typeof images[selectedImageIndex]?.image === 'object' && (
                  <Media
                    resource={images[selectedImageIndex].image}
                    className="block max-w-full max-h-full object-contain shadow-2xl"
                    imgClassName="object-contain"
                  />
                )}
              </div>

              {/* Counter */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/70 text-white px-8 py-4 rounded-full text-xl font-medium">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-12">
              <header>
                <h1 className="text-4xl lg:text-5xl font-bold">{room.name}</h1>
                <div className="flex items-center gap-3 text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">4.95</span>
                    <span>(124 reviews)</span>
                  </div>
                  <span>•</span>
                  <span>Zion National Park Area</span>
                </div>
              </header>

              <div className="flex flex-wrap gap-8 text-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {room.features?.guests || 2}{' '}
                  {`${room.features?.guests === 1 ? 'guest' : 'guests'}`}
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  {room.features?.beds || 'King'} bed
                </div>
                {room.features?.squareFeet && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5" />
                    {room.features.squareFeet} sq ft
                  </div>
                )}
              </div>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">About this room</h2>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {room.description}
                </p>
              </section>

              <Separator />
              {/* amenities */}
              <section>
                <h2 className="text-2xl font-semibold mb-8">Room Amenities</h2>
                <RoomAmenities amenities={room.amenities || []} />
              </section>
              <Separator />
              {businessLocation && (
                <section className="py-16">
                  <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">How to Find Us</h2>
                    <LocationMap businessLocation={businessLocation} />
                  </div>
                </section>
              )}
            </div>

            {/* Desktop Sticky Booking Card */}
            <div className="hidden lg:block">
              <Card className="sticky top-24 shadow-2xl rounded-3xl overflow-hidden border bg-white/95 backdrop-blur-xl">
                <div className="p-7 space-y-6">
                  {/* Price + Rating */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tight">
                        ${room.pricePerNight}
                      </span>
                      <span className="text-muted-foreground text-lg">/ night</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">4.95</span>
                    </div>
                  </div>

                  {/* Date + Guests – Full-width pills */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-14 rounded-full border-2 justify-start text-left font-medium text-sm"
                      onClick={() => setShowDatePicker(true)}
                    >
                      <CalendarIcon className="w-5 h-5 mr-3 text-primary" />
                      {hasValidDates ? (
                        <span className="truncate">
                          {format(checkIn!, 'MMM d')} → {format(checkOut!, 'MMM d')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Dates</span>
                      )}
                    </Button>

                    <Button variant="outline" className="h-14 rounded-full border-2 font-medium">
                      <Users className="w-5 h-5 mr-3 text-primary" />
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </Button>
                  </div>

                  {/* Tiny hint */}
                  {!hasValidDates && (
                    <p className="text-xs text-center text-muted-foreground -mt-2">
                      Tap Dates to begin
                    </p>
                  )}

                  {/* Action Buttons – Full-width, rounded, luxurious */}
                  <div className="flex flex-col items-center space-y-3 pt-2">
                    {/* Book Now – Primary Red */}
                    <Button
                      onClick={() => setShowBookingForm(true)}
                      disabled={!hasValidDates || isAvailable === false}
                      size="lg"
                      className={`
               w-full h-14 rounded-full font-semibold text-white text-lg transition-all shadow-lg
            ${
              hasValidDates && isAvailable !== false
                ? 'bg-primary hover:bg-secondary'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
                    >
                      {hasValidDates ? 'Book Now' : 'Select Dates to Book'}
                    </Button>

                    {/* WhatsApp – Green, luxurious */}
                    <WhatsAppInquiryButton
                      room={room}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      guests={guests}
                    />
                  </div>

                  {/* Optional: Tiny availability hint */}
                  {isAvailable === false && hasValidDates && (
                    <p className="text-center text-sm text-red-700 font-medium">
                      Not available on selected dates
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl lg:hidden z-50">
          <div className="px-3 py-3 safe-area-inset-bottom">
            {/* Single row – smart responsive layout */}
            <div className="flex items-center gap-2">
              {/* 1. Dates – takes as much space as possible */}
              <Button
                variant="outline"
                className="flex-1 min-w-0 h-14 rounded-full border-2 font-medium text-sm"
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarIcon className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                <span className="truncate">
                  {hasValidDates
                    ? `${format(checkIn!, 'MMM d')} → ${format(checkOut!, 'MMM d')}`
                    : 'Dates'}
                </span>
              </Button>

              {/* 2. Guests – only shows when screen is wide enough */}
              <Button
                variant="outline"
                className="hidden xs:flex h-14 w-20 rounded-full border-2 font-medium flex-shrink-0"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="ml-1">{guests}</span>
              </Button>

              {/* 3. WhatsApp – ALWAYS visible, highest priority after Book */}
              <WhatsAppInquiryButton
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
              />

              {/* 4. Book – ALWAYS visible, most important */}
              <Button
                onClick={() => setShowBookingForm(true)}
                disabled={!hasValidDates}
                className={`
          h-14 px-6 rounded-full font-bold text-white shadow-lg flex-shrink-0 transition-all
          ${hasValidDates ? 'bg-primary hover:bg-secondary' : 'bg-gray-300'}
        `}
              >
                {hasValidDates ? 'Book' : 'Dates'}
              </Button>
            </div>

            {/* Tiny hint */}
            {!hasValidDates && (
              <p className="text-xs text-center text-muted-foreground mt-2">Tap Dates to book</p>
            )}
          </div>
        </div>

        {showDatePicker && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 z-[100]" />

            {/* Scrollable Modal Container */}
            <div className="fixed inset-0 z-[101] flex items-start justify-center overflow-y-auto py-8 px-4">
              <div className="bg-white rounded-3xl shadow-3xl border-2 border-gray-100 w-full max-w-6xl mx-auto my-8">
                {/* Header – Sticky */}
                <div className="sticky top-0 bg-white rounded-t-3xl border-b z-10 px-10 ">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-4xl lg:text-5xl font-light tracking-tight">
                        Select Your Dates
                      </h2>
                      <p className="text-lg text-muted-foreground mt-4">
                        {checkIn && checkOut && checkOut > checkIn ? (
                          <span className="font-medium">
                            {format(checkIn, 'EEEE, MMMM d')} → {format(checkOut, 'EEEE, MMMM d')}{' '}
                            <span className="text-primary">
                              ({differenceInDays(checkOut, checkIn)} night
                              {differenceInDays(checkOut, checkIn) !== 1 ? 's' : ''})
                            </span>
                          </span>
                        ) : (
                          'Choose your check-in and check-out dates'
                        )}
                      </p>
                    </div>

                    {/* Close button – only when valid */}

                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="bg-gray-100 hover:bg-gray-200 rounded-full p-4 transition-all mt-2"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="px-10 pb-12">
                  {/* Calendar – centered */}
                  <div className="flex justify-center my-12">
                    <Calendar
                      mode="range"
                      selected={{ from: checkIn, to: checkOut }}
                      onSelect={async (range: any) => {
                        const from = range?.from
                        const to = range?.to

                        setCheckIn(from)
                        setCheckOut(to)

                        if (from && to && to > from) {
                          // Automatically check availability
                          setCheckingAvailability(true)
                          setIsAvailable(null)

                          try {
                            const res = await fetch('/api/check-availability', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                roomId: room.id,
                                checkIn: from.toISOString(),
                                checkOut: to.toISOString(),
                              }),
                            })

                            const data = await res.json()
                            setIsAvailable(data.available)

                            toast[data.available ? 'success' : 'error'](
                              data.available ? 'Room is available!' : 'Room is not available',
                              {
                                description: `${format(from, 'MMM d')} → ${format(to, 'MMM d')}`,
                              },
                            )

                            setShowDatePicker(false)
                          } catch (err) {
                            toast.error('Failed to check availability')
                          } finally {
                            setCheckingAvailability(false)
                          }
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      numberOfMonths={2}
                      className="rounded-2xl"
                      classNames={{
                        caption_label: 'text-2xl font-bold text-gray-900',
                        nav_button: 'h-12 w-12 bg-gray-100 hover:bg-red-100 rounded-xl text-lg',
                        day: 'h-14 w-14 text-lg font-medium rounded-xl hover:bg-red-50 hover:text-red-700 transition-all',
                        day_selected: 'bg-red-700 text-white font-bold text-xl hover:bg-red-800',
                        day_today: 'bg-gray-100 font-bold ring-2 ring-red-700',
                        day_range_start: 'bg-red-700 text-white rounded-l-xl',
                        day_range_end: 'bg-red-700 text-white rounded-r-xl',
                        day_range_middle: 'bg-red-100 text-red-900',
                        months:
                          window.innerWidth >= 640
                            ? 'flex flex-row gap-8 sm:gap-12'
                            : 'flex flex-col',
                      }}
                    />
                  </div>

                  {/* Bottom Instruction / Confirm */}
                  {/* <div className="text-center pb-8">
                    {checkIn && checkOut && checkOut > checkIn ? (
                      <div className="space-y-8">
                        <p className="text-2xl font-medium text-green-700">Valid stay confirmed</p>
                        <Button
                          size="lg"
                          className="bg-red-700 hover:bg-red-800 text-white px-20 h-16 text-xl font-medium rounded-full shadow-2xl"
                          onClick={() => setShowDatePicker(false)}
                        >
                          Confirm & Continue
                        </Button>
                      </div>
                    ) : (
                      <div className="max-w-2xl mx-auto">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                          Please select a <span className="font-bold text-red-700">check-in</span>{' '}
                          and a <span className="font-bold text-red-700">check-out</span> date at
                          least <span className="font-bold underline">one night apart</span>
                        </p>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </>
        )}
        {/* checking availabiity of room  */}
        {checkingAvailability && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center bg-white/90 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-3xl p-12 flex flex-col items-center gap-8 border border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 border-8 border-gray-100 rounded-full" />
                <div className="absolute inset-0 w-20 h-20 border-8 border-red-700 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center space-y-3">
                <p className="text-3xl font-light tracking-tight text-gray-900">
                  Checking Availability
                </p>
                <p className="text-lg text-muted-foreground">
                  One moment while we confirm your perfect stay...
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-red-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-red-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-red-700 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        {/* Final Booking Form */}
        <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl">Complete Your Booking</DialogTitle>
            </DialogHeader>

            {/* Date Summary */}
            {hasValidDates && checkIn && checkOut ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="font-semibold text-green-800">
                  {format(checkIn, 'EEEE, MMMM d')} – {format(checkOut, 'EEEE, MMMM d')}
                </p>
                <p className="text-green-700">
                  {totalNights} night{totalNights !== 1 ? 's' : ''} • ${totalPrice} total
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-800 font-medium">Please select valid dates first.</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-5 relative">
              {/* Full-Screen Loading Overlay */}
              {isSubmitting && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">Confirming Your Stay</p>
                      <p className="text-gray-600 mt-2">
                        Please wait while we secure your reservation...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input name="firstName" required disabled={isSubmitting} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input name="lastName" required disabled={isSubmitting} />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required disabled={isSubmitting} />
              </div>

              <div>
                <Label>Phone</Label>
                <Input name="phone" disabled={isSubmitting} />
              </div>

              <div>
                <Label>Guests</Label>
                <Select
                  defaultValue={guests.toString()}
                  disabled={isSubmitting}
                  onValueChange={(value) => setGuests(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: room.features?.guests || 1 }, (_, i) => i + 1).map(
                      (n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} Guest{n > 1 ? 's' : ''}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={!hasValidDates || isSubmitting}
                className="w-full bg-primary hover:bg-secondary h-14 text-lg font-medium transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Confirming...
                  </>
                ) : (
                  <>Confirm Booking • ${totalPrice}</>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {/* Inquiry Dialog */}
        <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Inquiry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInquiry} className="space-y-4">
              <Input name="name" placeholder="Your Name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone (optional)" />
              <textarea
                name="message"
                rows={4}
                className="w-full border rounded-lg p-3"
                placeholder="Your message..."
              />
              <Button type="submit" className="w-full bg-primary hover:bg-yellow-800">
                Send Inquiry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
