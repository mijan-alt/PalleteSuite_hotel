export interface BookingMetrics {
  newBookings: number
  newBookingsChange: number
  checkIns: number
  checkInsChange: number
  checkOuts: number
  checkOutsChange: number
  totalRevenue: number
  totalRevenueChange: number
}

export interface RoomAvailability {
  summary: {
    total: number
    occupied: number
    reserved: number
    available: number
    cleaning: number
  }
  byRoomType: Array<{
    roomName: string
    roomType: string
    totalUnits: number
    occupied: number
    reserved: number
    available: number
  }>
  sampleBookings: {
    occupied: Array<{
      roomNumber: string
      guestName: string
      roomName: string
      checkOut: string
    }>
    reserved: Array<{
      roomNumber: string
      guestName: string
      roomName: string
      checkIn: string
    }>
  }
}

export interface Activity {
  id: string
  time: string
  description: string
  detail: string
  iconType: 'check-out' | 'check-in' | 'new-booking' | 'inquiry'
}