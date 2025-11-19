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
import { Room } from '@/payload-types'

export function RoomClientPage({ room }: { room: Room }) {
  // Booking state
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(2)

  // Dialogs
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derived values
  const hasValidDates = checkIn && checkOut && checkOut > checkIn
  const totalNights = hasValidDates ? differenceInDays(checkOut!, checkIn!) : 0
  const totalPrice = hasValidDates ? totalNights * room.pricePerNight : 0

  const images = room.gallery || []
  const hasMultipleImages = images.length > 1

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
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Booking confirmed!', {
          description: 'We’ve sent you a confirmation email.',
        })
        setShowBookingForm(false)
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
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 lg:pt-8">
          {images.length === 1 ? (
            <div className="relative aspect-video lg:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              {typeof images[0].image === 'object' && (
                <Media resource={images[0].image} fill imgClassName="object-cover" priority />
              )}
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${hasMultipleImages ? 'lg:grid-cols-2' : ''} gap-4`}>
              <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {typeof images[0].image === 'object' && (
                  <Media resource={images[0].image} fill imgClassName="object-cover" priority />
                )}
              </div>
              {hasMultipleImages && (
                <div className="grid grid-cols-2 gap-4">
                  {images.slice(1, 5).map((item, i) =>
                    typeof item.image === 'object' ? (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden shadow-lg"
                      >
                        <Media resource={item.image} fill imgClassName="object-cover" />
                        {i === 3 && images.length > 5 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <p className="text-white text-2xl font-bold">+{images.length - 5}</p>
                          </div>
                        )}
                      </div>
                    ) : null,
                  )}
                </div>
              )}
            </div>
          )}
        </div>

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
                  {room.features?.guests || 2} guests
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

              <section>
                <h2 className="text-2xl font-semibold mb-8">Check Availability</h2>
                <div className="flex">
                  <Calendar
                    mode="range"
                    selected={{ from: checkIn, to: checkOut }}
                    onSelect={(range: any) => {
                      setCheckIn(range?.from)
                      setCheckOut(range?.to)
                      // if (range?.from && range?.to) {
                      //   setShowDatePicker(false)
                      //   toast.success('Dates selected!')
                      // }
                    }}
                    disabled={(date) => date < new Date()}
                    numberOfMonths={2} // or 2 if you want side-by-side
                    className="rounded-2xl "
                    classNames={{
                      // Big, clean, luxury feel
                      caption_label: 'text-2xl font-bold text-gray-900',
                      nav_button: 'h-10 w-10 bg-gray-100 hover:bg-red-100 rounded-xl',
                      day: 'h-12 w-12 text-lg font-medium rounded-xl hover:bg-red-50 hover:text-red-700 transition-all',
                      day_selected: 'bg-red-700 text-white font-bold text-xl hover:bg-red-800',
                      day_today: 'bg-gray-100 font-bold',
                      day_range_start: 'bg-red-700 text-white rounded-l-xl',
                      day_range_end: 'bg-red-700 text-white rounded-r-xl',
                      day_range_middle: 'bg-red-100 text-red-900',
                      months: 'flex flex-row gap-8',
                    }}
                  />
                </div>
              </section>
            </div>

            {/* Desktop Sticky Booking Card */}
            <div className="hidden lg:block">
              <Card className="sticky top-24 shadow-2xl rounded-3xl overflow-hidden border">
                <div className="p-8 space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-4xl font-bold">${room.pricePerNight}</span>
                      <span className="text-muted-foreground ml-2">/ night</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">4.95</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center -mt-4">
                    Select dates and number of guests to see the total price per night
                  </p>

                  {/* Date & Guest Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-14 justify-start text-left font-normal border-2"
                      onClick={() => setShowDatePicker(true)}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-red-700" />
                      {hasValidDates ? (
                        <span>
                          {format(checkIn!, 'MMM d')} – {format(checkOut!, 'MMM d')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Select Dates</span>
                      )}
                    </Button>

                    <Button variant="outline" className="h-14 border-2">
                      <Users className="mr-3 h-5 w-5 text-red-700" />
                      <span>{guests}</span>
                    </Button>
                  </div>

                  {!hasValidDates && (
                    <p className="text-sm text-primary text-center font-medium">
                      Select dates to continue
                    </p>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowBookingForm(true)}
                      disabled={!hasValidDates}
                      size="lg"
                      className="w-full bg-primary hover:bg-secondary text-white h-14 text-lg font-medium"
                    >
                      Book now
                    </Button>

                    <Button
                      onClick={() => setShowInquiryDialog(true)}
                      variant="outline"
                      size="lg"
                      className="w-full h-14 text-lg"
                    >
                      Send Inquiry
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl lg:hidden z-50">
          <div className="p-4 space-y-3">
            <p className="text-xs text-center text-muted-foreground">
              Select dates and number of guests to see the total price per night
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 border-2"
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-red-700" />
                {hasValidDates ? 'Dates selected' : 'Select Dates'}
              </Button>

              <Button variant="outline" className="h-12 border-2">
                <Users className="mr-2 h-5 w-5 text-red-700" />
                {guests}
              </Button>
            </div>

            {!hasValidDates && (
              <p className="text-xs text-primary text-center">Select dates to continue</p>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowBookingForm(true)}
                disabled={!hasValidDates}
                className="flex-1 bg-primary hover:bg-secondary h-12"
              >
                Book now
              </Button>
              <Button
                onClick={() => setShowInquiryDialog(true)}
                variant="outline"
                className="flex-1 h-12"
              >
                Send Inquiry
              </Button>
            </div>
          </div>
        </div>

        {/* Date Picker Dialog */}
        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <DialogContent
            className="max-w-2xl w-full p-0 bg-transparent border-0 shadow-none"
            onOpenAutoFocus={(e) => e.preventDefault()} // stops scroll jump
          >
            {/* Remove header completely */}
            <div className="flex justify-center items-center min-h-screen p-4">
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8 max-w-fit">
                <Calendar
                  mode="range"
                  selected={{ from: checkIn, to: checkOut }}
                  onSelect={(range: any) => {
                    setCheckIn(range?.from)
                    setCheckOut(range?.to)
                    // if (range?.from && range?.to) {
                    //   setShowDatePicker(false)
                    //   toast.success('Dates selected!')
                    // }
                  }}
                  disabled={(date) => date < new Date()}
                  numberOfMonths={1} // or 2 if you want side-by-side
                  className="rounded-2xl"
                  classNames={{
                    // Big, clean, luxury feel
                    caption_label: 'text-2xl font-bold text-gray-900',
                    nav_button: 'h-10 w-10 bg-gray-100 hover:bg-red-100 rounded-xl',
                    day: 'h-12 w-12 text-lg font-medium rounded-xl hover:bg-red-50 hover:text-red-700 transition-all',
                    day_selected: 'bg-red-700 text-white font-bold text-xl hover:bg-red-800',
                    day_today: 'bg-gray-100 font-bold',
                    day_range_start: 'bg-red-700 text-white rounded-l-xl',
                    day_range_end: 'bg-red-700 text-white rounded-r-xl',
                    day_range_middle: 'bg-red-100 text-red-900',
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                <Select defaultValue={guests.toString()} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} Guest{n > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
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
