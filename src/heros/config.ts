import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'breadcrumbText',
      type: 'text',
      label: 'Breadcrumb Text',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
        description:
          'Text displayed in the breadcrumb navigation (e.g., "About", "Contact", "Membership")',
      },
    },

     {
      name: 'heading',
      type: 'text',
      label: 'Headline',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description:
          'Short Headline in bold ',
      },
      defaultValue:'Powering Progress Through Innovative Energy Solutions',
      required:true
    },

      {
      name: 'badge',
      type: 'text',
      label: 'Badge',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description:
          'Hero badge '
      },
      defaultValue:'Leading Energy Solutions Since 1998'
    },

     {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
        description:
          'Short description of the website on the hero ',
      },
       defaultValue:'From exploration to distribution, Sunlink Energies delivers comprehensive oil and gas solutions across the Niger Delta. With 60% working interest in OML 144 and 25+ years of operational excellence, we\'re committed to responsible energy production that enriches lives and empowers communities'
    },



    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },

    {
      name: 'media1',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
      relationTo: 'media',
      required: false,
    },

    {
      name: 'media2',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
      relationTo: 'media',
      required: false,
    },

    {
      name: 'media3',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
      relationTo: 'media',
      required: false,
    },

      {
      name: 'headingLineBreak',
      type: 'checkbox',
      label: 'Add line break in heading (after "in")',
      defaultValue: true,
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
    },
  ],
  label: false,
}
