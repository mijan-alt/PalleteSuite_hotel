import { ArrowRight } from "lucide-react"
export const LocationMap = () => {
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=24.5557,55.1234" // ← your real coords
  const what3words = "///filled.count.soap" // ← your real w3w

  return (
    <section className="py-24 bg-sand-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-red-700">Location</p>
          <h2 className="text-5xl font-light mt-4">Hidden in Plain Sight</h2>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            45 minutes from the city, a lifetime away from ordinary.
          </p>
        </div>

        {/* Illustrated or satellite hero image – more luxurious than Google embed */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-12">
          <img src="/images/location-hero.jpg" alt="Palette Suite from above" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-light">Palette Suite</p>
            <p className="text-gray-600 mt-2">Al Qudra Desert<br />Dubai, United Arab Emirates</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">GPS</p>
            <p className="font-mono text-lg">24.5557° N, 55.1234° E</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">What3Words</p>
            <p className="font-mono text-lg break-all">{what3words}</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href={googleMapsUrl}
            target="_blank"
            className="inline-flex items-center bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition"
          >
            Get Directions
            <ArrowRight className="ml-3 w-5 h-5" />
          </a>
        </div>

        {/* Optional: small interactive map – only on mobile */}
        <div className="mt-16 md:hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            width="100%"
            height="400"
            className="rounded-xl border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}