import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function seedProduction() {
  const payload = await getPayload({ config: configPromise })

  console.log('🌱 Seeding production database...')

  try {
    // Check if contact info exists
    const existing = await payload.findGlobal({
      slug: 'contact-info',
    })

    if (!existing) {
      // Create default contact info
      await payload.updateGlobal({
        slug: 'contact-info',
        data: {
          email: 'contact@sunlinkenergy.com',
          phone: '+234 708 264 2998',
          whatsapp: '+234 708 264 2998',
          address: {
            city: 'Port Harcourt',
            state: 'Rivers',
            country: 'Nigeria',
            displayText: 'GRA, Port Harcourt',
          },
          hours: [
            { days: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
            { days: 'Saturday', time: '10:00 AM - 4:00 PM' },
            { days: 'Sunday', time: 'Closed' },
          ],
          emailResponseTime: 'Get a response within 24 hours',
          phoneAvailability: 'Mon-Fri, 9AM-6PM',
          officeVisitMessage: 'Schedule an in-person meeting',
        },
      })

      console.log('✅ Contact info created')
    } else {
      console.log('ℹ️  Contact info already exists')
    }
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seedProduction()