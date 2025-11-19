import { Block } from 'payload'

export const Hero5: Block = {
  slug: 'hero5',
  interfaceName: 'Hero5Props',
  labels: {
    singular: 'Hero Section 5',
    plural: 'Hero Sections 5',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Find Your Perfect Home in Your City',
    },
    {
      name: 'headingLineBreak',
      type: 'checkbox',
      label: 'Add line break in heading (after "in")',
      defaultValue: true,
    },
    {
      name: 'mainImage',
      type: 'upload',
      label: 'Main Hero Image',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mainImageAlt',
      type: 'text',
      label: 'Main Image Alt Text',
      defaultValue: 'Portrait of Joanna Doe in urban setting',
    },
    {
      name: 'thumbnailImage1',
      type: 'upload',
      label: 'Thumbnail Image 1',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'thumbnailImage1Alt',
      type: 'text',
      label: 'Thumbnail Image 1 Alt Text',
      defaultValue: 'Portrait of Sarah Chen in studio setting',
    },
    {
      name: 'thumbnailImage2',
      type: 'upload',
      label: 'Thumbnail Image 2',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'thumbnailImage2Alt',
      type: 'text',
      label: 'Thumbnail Image 2 Alt Text',
      defaultValue: 'Portrait of Joanna Doe in urban setting',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Call to Action Text',
      required: true,
      defaultValue: 'Contact Us',
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
};