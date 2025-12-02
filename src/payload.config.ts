// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Blogs } from './collections/Blogs'
import { resendAdapter } from '@payloadcms/email-resend'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { defaultColors, TextStateFeature } from '@payloadcms/richtext-lexical'
import { ContactInfo } from './globals/ContactInfo'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import { s3Storage } from '@payloadcms/storage-s3'
import { Rooms } from './collections/Rooms'
import { Faqs } from './collections/Faq'
import { Bookings } from './collections/Bookings'
import { Inquiries } from './collections/Inquiries'
import { HotelAmenities } from './globals/HotelAmenities'
import { BusinessLocation } from './globals/BusinessLocation'
import { Notifications } from './collections/Notifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
console.log('dirname payload.config.ts', dirname)
console.log('main directory', path.resolve(dirname, 'components/admin/CustomDashboard'))

export default buildConfig({
  admin: {
    components: {
      beforeDashboard: ['./components/admin/Hello'],
      graphics:{
        Logo: './components/admin/CustomLogo',
      },
      views: {
        dashboard: {
          Component: './components/admin/CustomDashboard',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  collections: [Pages, Media, Categories, Users, Blogs, Rooms, Faqs, Bookings, Inquiries, Notifications],

  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, ContactInfo, HotelAmenities, BusinessLocation],
  plugins: [
    ...plugins,
    s3Storage({
      collections: {
        media: {
          //  disableLocalStorage: true,// Recommended for production
          prefix: 'media',
          generateFileURL: ({ filename, prefix }) =>
            // Use the public URL directly and append the prefix/filename
            `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`,
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: process.env.S3_API || '',
        forcePathStyle: true,
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },

  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER!,
    defaultFromName: 'Hezbet Energy',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
