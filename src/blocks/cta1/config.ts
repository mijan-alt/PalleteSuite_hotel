import { Block } from 'payload';

export const Cta1Block: Block = {
  slug: 'cta1',
  interfaceName:'cta1',
  labels: {
    singular: 'CTA Section type1',
    plural: 'CTA Sections type1',
  },

  imageURL: '/admin/block-previews/cta1.png',
  imageAltText: 'Visual about section with images, breakout card, partners, and achievements',

  fields: [

    {
      name: 'blockPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/BlockPreviewImage#Cta1BlockPreview',
        },
        position: 'sidebar',
      },
    },
    
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Explore Our Platform',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
     defaultValue: 'Let\’s discuss how Hezbet can reduce downtime, increase efficiency, and drive sustainable growth for your business.', 
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Primary Button',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          required: true,
          defaultValue: 'Contact us',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link',
          required: true,
          defaultValue: '/contact',
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Secondary Button',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          required: true,
          defaultValue: 'Watch Video',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link',
          required: true,
          defaultValue: '#',
        },
      ],
    },
  ],
  
};