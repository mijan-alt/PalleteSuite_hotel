import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  label: 'Contact Information',
  access: {
    read: () => true, // Public
  },
  admin: {
    group: 'Site Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact Details',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'Email Address',
              required: true,
              admin: {
                description: 'Main contact email',
              },
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
              required: true,
              admin: {
                description: 'Format: +234 708 264 2998',
              },
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp Number',
              admin: {
                description: 'If different from phone number',
              },
            },
            {
              name: 'address',
              type: 'group',
              label: 'Office Address',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Street Address',
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'City',
                },
                {
                  name: 'state',
                  type: 'text',
                  label: 'State',
                },
                {
                  name: 'country',
                  type: 'text',
                  label: 'Country',
                },
                {
                  name: 'displayText',
                  type: 'text',
                  label: 'Display Text',
                  admin: {
                    description: 'How to display address (e.g., "GRA, Port Harcourt")',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Office Hours',
          fields: [
            {
              name: 'hours',
              type: 'array',
              label: 'Office Hours',
              fields: [
                {
                  name: 'days',
                  type: 'text',
                  label: 'Days',
                  required: true,
                  admin: {
                    description: 'e.g., "Monday - Friday"',
                  },
                },
                {
                  name: 'time',
                  type: 'text',
                  label: 'Time',
                  required: true,
                  admin: {
                    description: 'e.g., "9:00 AM - 6:00 PM EST"',
                  },
                },
              ],
              defaultValue: [
                { days: 'Monday - Friday', time: '9:00 AM - 6:00 PM EST' },
                { days: 'Saturday', time: '10:00 AM - 4:00 PM EST' },
                { days: 'Sunday', time: 'Closed' },
              ],
            },
          ],
        },
        {
          label: 'Messages',
          fields: [
            {
              name: 'emailResponseTime',
              type: 'text',
              label: 'Email Response Time',
              defaultValue: 'Get a response within 24 hours',
            },
            {
              name: 'phoneAvailability',
              type: 'text',
              label: 'Phone Availability',
              defaultValue: 'Mon-Fri, 9AM-6PM EST',
            },
            {
              name: 'officeVisitMessage',
              type: 'text',
              label: 'Office Visit Message',
              defaultValue: 'Schedule an in-person meeting',
            },
          ],
        },
      ],
    },
  ],

  hooks: {
    afterChange: [
      async ({ req: { payload } }) => {
        payload.logger.info('🔄 Revalidating contact info cache...')

        // ✅ ONLY revalidate contact info cache
        // Pages will fetch fresh contact info on next request
        revalidateTag('contact-info')
        revalidateTag('globals')

        payload.logger.info('✅ Contact info cache revalidated')
        payload.logger.info('ℹ️  Pages will fetch fresh contact info on next visit')
      },
    ],
  },
}
