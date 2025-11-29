// components/Room/LocationSection.tsx
import { ArrowRight } from 'lucide-react'

export function LocationSection() {
  const lat = 4.85
  const lng = 7.0167
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <section className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Minimal, elegant heading */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-widest uppercase text-red-800 font-medium">Location</p>
          <h2 className="text-5xl md:text-6xl font-light tracking-tight mt-4">
            Elelenwo • Port Harcourt
          </h2>
        </div>

        {/* Full-bleed cinematic map */}
        <div className="relative -mx-6 md:mx-0 md:rounded-3xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNTEnMDAuMCJOIDfCsDAxJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1732900000000`}
            width="100%"
            height="560"
            className="border-0  transition-all duration-1000"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Dark gradient + centered title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white">
            <p className="text-5xl md:text-6xl font-light tracking-widest">Palette Suite</p>
            <p className="text-xl md:text-2xl opacity-90 mt-3 tracking-wider">
              Elelenwo, Rivers State
            </p>
          </div>
        </div>

        {/* One single, elegant info pill */}
        <div className="flex justify-center mt-14">
          <div className="bg-white/95 backdrop-blur-sm px-10 py-5 rounded-full shadow-2xl">
            <p className="text-xs uppercase tracking-widest text-gray-600">GPS</p>
            <p className="font-mono text-lg mt-1">
              {lat}° N, {lng}° E
            </p>
          </div>
        </div>

        {/* Floating, luxurious CTA */}
        <div className="text-center mt-16">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center bg-black text-white px-14 py-6 rounded-full text-lg font-medium hover:bg-gray-900 transition-all duration-300 shadow-2xl"
          >
            Get Directions
            <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
}
