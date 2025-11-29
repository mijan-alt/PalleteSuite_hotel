
import { Block } from 'payload'

const FaqAccordion: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FaAccordionProp',
  labels: {
    singular: 'FAQ Accordion with Image',
    plural: 'FAQ Accordions with Image',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Image (shown on the right)',
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQ Items',
      minRows: 3,
      maxRows: 12,
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: 'Answer',
        },
      ],
    },
  ],
}

export default FaqAccordion
