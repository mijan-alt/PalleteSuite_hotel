import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { defaultColors, TextStateFeature } from '@payloadcms/richtext-lexical'
import {
  UnorderedListFeature,
  ChecklistFeature,
  LinkFeature,
  HorizontalRuleFeature,
  BlocksFeature,
} from '@payloadcms/richtext-lexical'
import { Cta1Block } from '../cta1/config'
import { Banner } from '../../blocks/Banner/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'

import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: 'One Third',
        value: 'oneThird',
      },
      {
        label: 'Half',
        value: 'half',
      },
      {
        label: 'Two Thirds',
        value: 'twoThirds',
      },
      {
        label: 'Full',
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures, defaultFeatures }) => {
        return [
          ...rootFeatures,
          ...defaultFeatures,
          HeadingFeature({
            enabledHeadingSizes: ['h2', 'h3', 'h4'],
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          UnorderedListFeature(),
          HorizontalRuleFeature(),
          ChecklistFeature(),
          BlocksFeature({ blocks: [Banner, MediaBlock] }),
          LinkFeature({
            // Example showing how to customize the built-in fields
            // of the Link feature
            fields: ({ defaultFields }) => [
              ...defaultFields,
              {
                name: 'rel',
                label: 'Rel Attribute',
                type: 'select',
                hasMany: true,
                options: ['noopener', 'noreferrer', 'nofollow'],
                admin: {
                  description:
                    'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                },
              },
              {
                name: 'anchor',
                label: 'Anchor/Section ID',
                type: 'text',
                admin: {
                  description: 'Link to a specific section on this page (e.g., "about-section")',
                },
              },
            ],
          }),

          TextStateFeature({
            // prettier-ignore
            state: {
             color: {
    
        red:{
          label:"Red",
          css:{color:"#EF4444"}
        }
      // fancy gradients!
 
    },
    // You can have both colored and underlined text at the same time.
    // If you don't want that, you should group them within the same key.
    // (just like I did with defaultColors and my fancy gradients)
    underline: {
      'solid': { label: 'Solid', css: { 'text-decoration': 'underline', 'text-underline-offset': '4px' } },
       // You'll probably want to use the CSS light-dark() utility.
      'yellow-dashed': { label: 'Yellow Dashed', css: { 'text-decoration': 'underline dashed', 'text-decoration-color': 'light-dark(#EAB308,yellow)', 'text-underline-offset': '4px' } },
    },
  },
          }),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
