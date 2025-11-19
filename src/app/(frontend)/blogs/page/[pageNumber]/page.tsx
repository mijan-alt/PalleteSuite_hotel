import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { BlogArchive } from '@/components/BlogsArchive'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const blogs = await payload.find({
    collection: 'blogs',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <>
      <section className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            alt="donation"
            width={500}
            height={500}
            src="/assets/donate.png"
            className="object-cover object-center"
          />
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 z-10 bg-black/50" />

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4">
          {/* Title from RichText */}

          <div className="text-4xl md:text-5xl font-bold mb-4">
            <p className="[&>h1]:text-4xl [&>h1]:md:text-5xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-0 [&>p]:text-4xl [&>p]:md:text-5xl [&>p]:font-bold [&>p]:text-white [&>p]:mb-0" />
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center text-sm space-x-2">
            <HomeIcon size={16} />
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <span>blogs</span>
          </div>
        </div>
      </section>
      <div className="pt-24 pb-24 px-16">
        <PageClient />

        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>Blogs</h1>
          </div>
        </div>

        <div className="container mb-8">
          <PageRange
            collection="blogs"
            currentPage={blogs.page}
            limit={12}
            totalDocs={blogs.totalDocs}
          />
        </div>
        <div className=" mx-auto max-w-7xl bg-red-500">
          <BlogArchive posts={blogs.docs} />
        </div>

        <div className="container">
          {blogs?.page && blogs?.totalPages > 1 && (
            <Pagination page={blogs.page} totalPages={blogs.totalPages} />
          )}
        </div>
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Webdesign grid ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'blogs',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
