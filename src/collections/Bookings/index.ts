// collections/Bookings.ts
import type { CollectionConfig } from 'payload'
import type { Field } from 'payload'

const assignedRoomNumberField: Field = {
  name: 'assignedRoomNumber',
  label: 'Assigned Room Number',
  type: 'text',
  admin: {
    description: 'Select specific room number for this booking',
    position: 'sidebar',
    condition: (data) => !!data.room && data.status !== 'checked-out',
    components: {
      Field: {
        path: '@/components/RoomNumberSelect#RoomNumberSelect',
        clientProps: {},
      },
    },
  },
}

export const Bookings: CollectionConfig<'bookings'> = {
  slug: 'bookings',
  indexes: [
    // Single-field indexes (for sorting, filtering, etc.)
    { fields: ['firstName'] },
    { fields: ['lastName'] },
    { fields: ['assignedRoomNumber'] },
    { fields: ['bookingId'] },
    { fields: ['status'] },
    { fields: ['checkIn'] },
  ],
  admin: {
    useAsTitle: 'bookingId',
    defaultColumns: [
      'bookingId',
      'assignedRoomNumber',
      'room',
      'checkIn',
      'checkOut',
      'totalPrice',
      'status',
      'firstName',
    ],
    group: 'Core Operations',
    description: 'Manage all guest reservations - both online and walk-in bookings',
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      return !!req.user
    },
  },

  fields: [
    {
      name: 'bookingId',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: () => {
        return `PAL-TEMP-${Date.now()}`
      },
    },

    {
      name: 'bookingSource',
      label: 'Booking Source',
      type: 'select',
      options: [
        { label: '🌐 Online Booking', value: 'online' },
        { label: '🏨 Walk-in (Front Desk)', value: 'walkin' },
        { label: '📞 Phone Reservation', value: 'phone' },
      ],
      defaultValue: 'online',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'How was this booking made?',
      },
    },

    {
      type: 'collapsible',
      label: 'Guest Information',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'phone',
              type: 'text',
              admin: {
                width: '50%',
                placeholder: '+234 XXX XXX XXXX',
              },
            },
          ],
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Room & Stay Details',
      admin: {
        initCollapsed: false,
      },
      fields: [
        // Hidden field to trigger calculations
        {
          name: '_calculationTrigger',
          type: 'ui',
          admin: {
            components: {
              Field: '@/components/DateRangeCalculator#DateRangeCalculator',
            },
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'room',
              label: 'Room Type',
              type: 'relationship',
              relationTo: 'rooms',
              required: true,
              maxDepth: 1,
              admin: {
                description: 'Select the room category - price will auto-populate',
                width: '60%',
                components: {
                  afterInput: [
                    {
                      path: '@/components/RoomSelector#RoomSelector',
                      clientProps: { path: 'room' },
                    },
                  ],
                },
              },
            },

            {
              name: '_priceLoader',
              type: 'ui',
              admin: {
                components: {
                  Field: {
                    path: '@/components/AutoPriceField#AutoPriceField',
                    clientProps: {
                      roomFieldPath: 'room',
                      priceFieldPath: 'pricePerNight',
                    },
                  },
                },
              },
            },

            {
              name: 'guests',
              type: 'number',
              required: true,
              defaultValue: 1,
              min: 1,
              max: 10,
              admin: {
                description: 'Number of guests',
                width: '40%',
              },
            },
          ],
        },
        assignedRoomNumberField as Field,
        {
          type: 'row',
          fields: [
            {
              name: 'checkIn',
              type: 'date',
              required: true,
              admin: {
                description: 'Check-in date',
                width: '50%',
                date: {
                  displayFormat: 'dd MMM yyyy',
                },
              },
            },
            {
              name: 'checkOut',
              type: 'date',
              required: true,
              admin: {
                description: 'Check-out date',
                width: '50%',
                date: {
                  displayFormat: 'dd MMM yyyy',
                },
              },
            },
          ],
        },
        {
          name: 'totalNights',
          type: 'number',
          required: true,
          admin: {
            description: '✨ Calculated automatically from dates',
            readOnly: true,
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Pricing Details',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pricePerNight',
              label: 'Price per Night (₦)',
              type: 'number',

              admin: {
                description: '✨ Auto-filled from room type (editable)',
                width: '50%',
              },
            },
            {
              name: 'totalPrice',
              label: 'Total Price (₦)',
              type: 'number',

              admin: {
                description: '✨ Calculated: (Price × Nights) - Discount',
                width: '50%',
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'discount',
          label: 'Discount Amount (₦)',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Optional discount - total price updates automatically',
            components: {
              afterInput: [
                {
                  path: '@/components/PriceCalculator#PriceCalculator',
                },
              ],
            },
          },
        },
        {
          name: 'paymentStatus',
          label: 'Payment Status',
          type: 'select',
          options: [
            { label: '💰 Paid in Full', value: 'paid' },
            { label: '⏳ Deposit Paid', value: 'deposit' },
            { label: '❌ Not Paid', value: 'unpaid' },
          ],
          defaultValue: 'unpaid',
          admin: {
            description: 'Track payment for walk-ins',
          },
        },
        {
          name: 'paymentMethod',
          label: 'Payment Method',
          type: 'select',
          options: [
            { label: 'Cash', value: 'cash' },
            { label: 'Card (POS)', value: 'card' },
            { label: 'Bank Transfer', value: 'transfer' },
            { label: 'Online Payment', value: 'online' },
          ],
          admin: {
            condition: (data) => data.paymentStatus !== 'unpaid',
          },
        },
      ],
    },

    {
      name: 'completedRoomNumber',
      label: 'Room Number (Historical)',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.status === 'checked-out' && !!data.assignedRoomNumber,
        description: 'The room number for this completed booking',
        components: {
          Field: {
            path: '@/components/ReadOnlyRoomDisplay#ReadOnlyRoomDisplay',
          },
        },
      },
    },

    {
      name: 'status',
      type: 'select',
      options: [
        { label: '⏳ Pending', value: 'pending' },
        { label: '✅ Confirmed', value: 'confirmed' },
        { label: '🔑 Checked In', value: 'checked-in' },
        { label: '✔️ Checked Out', value: 'checked-out' },
        { label: '❌ Cancelled', value: 'cancelled' },
        { label: '🚫 No Show', value: 'no-show' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Current booking status',
      },
    },

    {
      name: 'actualCheckInTime',
      label: 'Actual Check-in Time',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.status === 'checked-in' || data.status === 'checked-out',
        date: {
          displayFormat: 'dd MMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'actualCheckOutTime',
      label: 'Actual Check-out Time',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.status === 'checked-out',
        date: {
          displayFormat: 'dd MMM yyyy HH:mm',
        },
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        console.log('beforeChange hook triggered for bookings collection')
        // Generate booking ID on create
        if (operation === 'create') {
          const year = new Date().getFullYear()
          const existingCount = await req.payload.count({
            collection: 'bookings',
          })
          const sequence = String(existingCount.totalDocs + 1).padStart(6, '0')
          data.bookingId = `PAL-${year}-${sequence}`
        }

        // Backup: Auto-populate pricePerNight if not already set
        if (data.room && !data.pricePerNight) {
          try {
            const room = await req.payload.findByID({
              collection: 'rooms',
              id: typeof data.room === 'string' ? data.room : data.room.id,
            })

            if (room && typeof room === 'object' && 'pricePerNight' in room) {
              data.pricePerNight = room.pricePerNight as number
            }
          } catch (error) {
            req.payload.logger.error('Error fetching room for price:', error)
          }
        }

        if (data.checkIn && data.checkOut && !data.totalNights) {
          const checkIn = new Date(data.checkIn)
          const checkOut = new Date(data.checkOut)
          const timeDiff = checkOut.getTime() - checkIn.getTime()
          const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
          data.totalNights = nights > 0 ? nights : 1
        }

        // Backup: Calculate total price if not already set
        if (data.pricePerNight && data.totalNights && !data.totalPrice) {
          data.totalPrice = data.pricePerNight * data.totalNights
          if (data.discount && data.discount > 0) {
            data.totalPrice -= data.discount
          }
        }

        // Auto-populate actual check-in time
        if (data.status === 'checked-in' && originalDoc?.status !== 'checked-in') {
          data.actualCheckInTime = new Date().toISOString()
          if (!data.assignedRoomNumber) {
            throw new Error('Please assign a room number before checking in the guest.')
          }
          if (data.bookingSource === 'walkin' && data.paymentStatus === 'unpaid') {
            req.payload.logger.warn('Walk-in guest checked in without payment recorded')
          }
        }

        // Auto-populate actual check-out time
        if (data.status === 'checked-out' && originalDoc?.status !== 'checked-out') {
          data.actualCheckOutTime = new Date().toISOString()
        }

        return data
      },
    ],

    // afterChange: [
    //   async ({ doc, req, operation }) => {
    //     if (operation === 'create' && doc.bookingSource === 'walkin') {
    //       req.payload.logger.info(`Walk-in booking created: ${doc.bookingId}`)
    //     }
    //   },
    // ],
  },
}
