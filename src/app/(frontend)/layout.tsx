import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'

import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Raleway } from 'next/font/google'
import { Footer } from '@/Footer/Component'
import { Outfit } from 'next/font/google'
import { Montserrat } from 'next/font/google'
import { EB_Garamond } from 'next/font/google'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import localFont from 'next/font/local'
import { Toaster } from "@/components/ui/sonner"

const sans = localFont({
  src: [
    {
      path: '../../fonts/DMSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/DMSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(sans.className)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
         <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
