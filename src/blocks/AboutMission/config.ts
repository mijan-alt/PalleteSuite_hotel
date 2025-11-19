import { Block } from 'payload'

export const AboutMissionBlock: Block = {
  slug: 'aboutMission',
  interfaceName: 'AboutMissionProps',
  labels: {
    singular: 'About/Mission Block',
    plural: 'About/Mission Blocks',
  },
  imageURL: '/admin/block-previews/aboutmission.png',
  imageAltText: 'About and mission block with hero, mission card, values grid, and CTA section',
  fields: [
    // Preview in Sidebar
    {
      name: 'blockPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/BlockPreviewImage#AboutMissionBlockPreview',
        },
        position: 'sidebar',
      },
    },
    
    // Hero Section
    {
      name: 'heroSection',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          required: true,
          defaultValue: 'Powering Nigeria\'s Energy Future Through Excellence and Innovation',
          admin: {
            description: 'Large heading at the top of the page',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          defaultValue: 'For over 25 years, Sunlink Energies has been at the forefront of Nigeria\'s oil and gas sector, delivering reliable energy solutions while championing sustainable practices and community development across the Niger Delta.',
          admin: {
            description: 'Introductory paragraph below the heading',
          },
        },
      ],
    },

    // Mission Section
    {
      name: 'missionSection',
      type: 'group',
      label: 'Mission Section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Mission Image',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Image for the mission section (recommended: 800×600px)',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          defaultValue: 'OUR MISSION',
          admin: {
            description: 'Small label text (e.g., "OUR MISSION")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mission Statement',
          required: true,
          defaultValue: 'We believe in creating lasting value through responsible energy production. Our mission is to deliver world-class oil and gas solutions that power Nigeria\'s economic growth, while maintaining the highest standards of safety, environmental stewardship, and community partnership across every operation.',
          admin: {
            description: 'Your company mission statement',
          },
        },
      ],
    },

    // Values Section
    {
      name: 'valuesSection',
      type: 'group',
      label: 'Values Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Section Heading',
          required: true,
          defaultValue: 'Our Core Values Drive Everything We Do',
          admin: {
            description: 'Heading for the values section',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Section Description',
          required: true,
          defaultValue: 'Built on a foundation of integrity, excellence, and innovation, these principles guide our operations and relationships with stakeholders across Nigeria\'s energy sector.',
          admin: {
            description: 'Brief description for the values section',
          },
        },
        {
          name: 'values',
          type: 'array',
          label: 'Values',
          minRows: 3,
          maxRows: 6,
          labels: {
            singular: 'Value',
            plural: 'Values',
          },
          admin: {
            description: 'Add 3-6 company values or principles',
          },
          defaultValue: [
            {
              icon: 'shield',
              title: 'Safety & Environmental Excellence',
              description: 'Zero-compromise approach to health, safety, and environmental protection. We maintain industry-leading HSE standards across all operations, ensuring the wellbeing of our people, communities, and the Niger Delta ecosystem.',
            },
            {
              icon: 'target',
              title: 'Operational Excellence',
              description: 'Leveraging cutting-edge technology and proven expertise to maximize production efficiency. Our 60% working interest in OML 144 demonstrates our commitment to strategic asset development and optimal resource management.',
            },
            {
              icon: 'users',
              title: 'Community Partnership',
              description: 'Enriching lives through sustainable community investment. We support education, healthcare, infrastructure, and local employment initiatives that create lasting positive impact across the regions where we operate.',
            },
          ],
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              required: true,
              defaultValue: 'shield',
              options: [
                { label: 'Files', value: 'files' },
                { label: 'Circle Arrow Right', value: 'circle-arrow-right' },
                { label: 'Settings', value: 'settings' },
                { label: 'Target', value: 'target' },
                { label: 'Users', value: 'users' },
                { label: 'Shield', value: 'shield' },
              ],
              admin: {
                description: 'Select an icon for this value',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Value Title',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Value Description',
              required: true,
            },
          ],
        },
      ],
    },

    // CTA Section
    {
      name: 'ctaSection',
      type: 'group',
      label: 'CTA Section',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          defaultValue: 'JOIN OUR TEAM',
          admin: {
            description: 'Small label text (e.g., "JOIN OUR TEAM")',
          },
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          required: true,
          defaultValue: 'Building Nigeria\'s Energy Future Together',
          admin: {
            description: 'Call to action heading',
          },
        },
        {
          name: 'image',
          type: 'upload',
          label: 'CTA Image',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Image for the CTA section (recommended: 800×300px)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          defaultValue: 'We\'re looking for passionate professionals who share our commitment to excellence, innovation, and sustainable development. If you\'re ready to make a meaningful impact in Nigeria\'s energy sector, explore career opportunities with Sunlink Energies and Resources Limited.',
          admin: {
            description: 'Supporting text for the call to action',
          },
        },
      ],
    },
  ],
}