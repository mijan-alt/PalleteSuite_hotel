import { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'servicesBlock',
  labels: {
    singular: 'Services Block',
    plural: 'Services Blocks',
  },
  imageURL: 'http://localhost:3000/admin/block-previews/service-block-preview.png',
  imageAltText: 'Services Block with three cards showing icons, titles, descriptions and links',
  fields: [
    {
      name: 'blockPreview',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '/components/BlockPreviewImage',
            exportName: 'ServicesBlockPreview',
          },
        },
        position: 'sidebar',
      },
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Badge Text',
      admin: {
        description: 'Optional badge text displayed above the heading (e.g., "New Release")',
      },
      defaultValue: 'At a Glance',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        description: 'Main heading for the section',
      },
      defaultValue: 'Our Core Strengths',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description text below the heading',
      },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 1,
      maxRows: 6,
      labels: {
        singular: 'Service',
        plural: 'Services',
      },
      defaultValue: [
        {
          title: 'Robust and sustainable E&P Assets',
          description:
            'High-quality exploration and production assets built for long-term reliability and environmental responsibility.',
          link: {
            type: 'reference',
            label: 'Learn More',
          },
        },
        {
          title: 'Balanced portfolio positioned for the future',
          description:
            'A diversified mix of upstream, midstream, and downstream assets optimized for market resilience and growth.',
          link: {
            type: 'reference',
            label: 'Learn More',
          },
        },
        {
          title: 'Strategically driven for returns',
          description:
            'Disciplined capital allocation and operational excellence focused on maximizing shareholder value.',
          link: {
            type: 'reference',
            label: 'Learn More',
          },
        },
        {
          title: 'Skilled & professional workforce',
          description:
            'Experienced engineers, geoscientists, and field operators committed to safety and technical excellence.',
          link: {
            type: 'reference',
            label: 'Learn More',
          },
        },
        {
          title: 'Prudent & lean organisation',
          description:
            'Efficient cost structure and agile decision-making enabling competitive performance in any market cycle.',
          link: {
            type: 'reference',
            label: 'Learn More',
          },
        },
        {
          title: 'Collaboration with credible and ethical partners',
          description:
            'Strong relationships with industry-leading joint-venture partners, service providers, and local stakeholders.',
          link: {
            type: 'reference',
            label: 'Learn More',
          },
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Upload an icon/image for this service (SVG recommended)',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Service Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Service Description',
          required: true,
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          fields: [
            {
              name: 'type',
              type: 'radio',
              label: 'Link Type',
              options: [
                {
                  label: 'Internal Page',
                  value: 'reference',
                },
                {
                  label: 'Custom URL',
                  value: 'custom',
                },
              ],
              defaultValue: 'reference',
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              label: 'Internal Page',
              relationTo: ['pages'],
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Custom URL',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Link Label',
              defaultValue: 'See more',
            },
          ],
        },
      ],
    },
  ],
}
