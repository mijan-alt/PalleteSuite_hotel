import { Block } from 'payload'

export const PolicyBlock: Block = {
  slug: 'policy',
  interfaceName: 'PolicyProps',
  labels: {
    singular: 'Policy Features',
    plural: 'Policy Features',
  },
  imageURL: '/admin/block-previews/policy.png',
  imageAltText: 'Feature grid with icons, titles, and descriptions',
  fields: [
    // Preview in Sidebar
    {
      name: 'blockPreview',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/BlockPreviewImage#PolicyBlockPreview',
        },
        position: 'sidebar',
      },
    },

    // Header Section
    {
      name: 'header',
      type: 'group',
      label: 'Header Section',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge Text (Optional)',
          defaultValue: 'Policies',
          admin: {
            description: 'Optional badge text above the heading',
          },
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          required: true,
          defaultValue: 'Our Commitment to Excellence and Integrity',
          admin: {
            description: 'Main heading for the policy section',
          },
        },
      ],
    },

    // Features Array
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 2,
      maxRows: 12,
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      admin: {
        description: 'Add 2-12 features (displays in 2-column grid)',
      },
      defaultValue: [
        {
          icon: 'shield-check',
          title: 'HSSE Policy',
          description: 'Sunlink maintains high standards of health, safety, security and environmental ("HSSE") protocols for all stakeholders including people, partners, host communities, contractors and service providers. Our HSSE policy ensures all relevant operations and activities are conducted in line with best practices in a safe, secure and environmental friendly manner.',
        },
        {
          icon: 'heartbeat',
          title: 'COVID-19 Policy',
          description: 'This policy applies to all employees, contractors, consultants, interns and, others regarding policies related to expected behaviours within the office premises, all visitors. Strict adherence to this policy must be maintained at all times.',
        },
        {
          icon: 'megaphone',
          title: 'Whistleblowing Policy',
          description: 'We uphold our commitment to professionalism and accountability, we have dedicated channels for confidential and anonymous reporting of unethical, illegal or inappropriate events within the Company.',
        },
        {
          icon: 'scale',
          title: 'Anti-corruption Policy',
          description: 'The purpose of this policy is to reinforce the Company\'s business principle of zero tolerance to bribery and corruption by providing a framework to guard and promote the Company\'s reputation for integrity and responsibility.',
        },
        {
          icon: 'handshake',
          title: 'Shell General Business Principles',
          description: 'With Shell as our partner in the development of OML 144, we adhere to the Shell General Business Principles and share the set of core values, honesty, integrity and respect for people and are committed to sustainable development.',
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          defaultValue: 'shield-check',
          options: [
            { label: 'Shield Check', value: 'shield-check' },
            { label: 'Heartbeat', value: 'heartbeat' },
            { label: 'Megaphone', value: 'megaphone' },
            { label: 'Scale', value: 'scale' },
            { label: 'Handshake', value: 'handshake' },
            { label: 'File Text', value: 'file-text' },
          ],
          admin: {
            description: 'Icon representing this feature',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Feature Title',
          required: true,
          admin: {
            description: 'Title for this feature',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Feature Description',
          required: true,
          admin: {
            description: 'Detailed description of this feature',
          },
        },
      ],
    },

    // CTA Section
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action (Optional)',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'More Features',
          admin: {
            description: 'Text for the CTA button',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
          defaultValue: '#',
          admin: {
            description: 'URL the button links to',
          },
        },
      ],
    },
  ],
}