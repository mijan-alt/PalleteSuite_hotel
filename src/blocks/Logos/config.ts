import { Block } from 'payload'

export const LogoShowcaseBlock: Block = {
  slug: 'logoShowcase',
  interfaceName: 'LogoShowcaseProps',
  labels: {
    singular: 'Logo Showcase',
    plural: 'Logo Showcases',
  },
  imageURL: '/admin/block-previews/logo-showcase.png',
  imageAltText: 'Horizontal scrolling carousel of partner or client logos',
  fields: [
    // Preview in Sidebar
    {
      name: 'blockPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/BlockPreviewImage#LogoShowcaseBlockPreview',
        },
        position: 'sidebar',
      },
    },

    // Heading Section
    {
      name: 'heading',
      type: 'group',
      label: 'Heading',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Main Text',
          required: true,
          defaultValue: 'Discover how our tools have unlocked new',
          admin: {
            description: 'First part of the heading',
          },
        },
        {
          name: 'highlightedText',
          type: 'text',
          label: 'Highlighted Text (Optional)',
          defaultValue: 'levels of creativity',
          admin: {
            description: 'Text that will be displayed in muted color',
          },
        },
        {
          name: 'remainingText',
          type: 'text',
          label: 'Remaining Text (Optional)',
          defaultValue: 'and efficiency',
          admin: {
            description: 'Final part of the heading',
          },
        },
      ],
    },

    // Badge Section
    {
      name: 'badge',
      type: 'group',
      label: 'Badge (Optional)',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Badge Text',
          defaultValue: 'Checkout Our Users',
          admin: {
            description: 'Text for the animated badge',
          },
        },
      ],
    },

    // Logos Array
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 4,
      maxRows: 20,
      labels: {
        singular: 'Logo',
        plural: 'Logos',
      },
      admin: {
        description: 'Add 4-20 partner or client logos (will scroll horizontally)',
      },
      defaultValue: [
        {
          alt: 'Partner Logo 1',
        },
        {
          alt: 'Partner Logo 2',
        },
        {
          alt: 'Partner Logo 3',
        },
        {
          alt: 'Partner Logo 4',
        },
        {
          alt: 'Partner Logo 5',
        },
        {
          alt: 'Partner Logo 6',
        },
      ],
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Logo Image',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Logo image (SVG or PNG recommended, will auto-invert in dark mode)',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
          admin: {
            description: 'Descriptive text for the logo (for accessibility)',
          },
        },
      ],
    },
  ],
}