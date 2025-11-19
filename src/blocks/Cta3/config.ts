import { Block } from 'payload'

export const Cta3Block: Block = {
  slug: 'cta3',
  labels: {
    singular: 'CTA 3 (Image + Text)',
    plural: 'CTA 3 Blocks',
  },
  imageURL: '/admin/block-previews/cta3.png',
  imageAltText: 'Call to action block with image on left and text content on right',
  fields: [
    // Preview in Sidebar
    {
      name: 'blockPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/BlockPreviewImage#Cta2BlockPreview',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'imagePosition',
      type: 'radio',
      label: 'Image Position',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      defaultValue: 'left',
      admin: {
        layout: 'horizontal',
        description: 'Choose whether the image appears on the left or right side',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Featured image for the CTA section (recommended: 1200×800px)',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        description: 'Main heading for the call to action',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description text (2-3 sentences recommended)',
      },
    },
    {
      name: 'button',
      type: 'group',
      label: 'Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Get Started',
          required: true,
        },
        {
          name: 'link',
          type: 'group',
          label: 'Button Link',
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
                placeholder: 'https://example.com',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in New Tab',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}