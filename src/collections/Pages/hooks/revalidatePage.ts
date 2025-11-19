import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Page } from '../../../payload-types'

/**
 * Revalidates ONLY the specific page that changed
 * Does NOT revalidate all pages unnecessarily
 */
export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  // Helper function to get full path from breadcrumbs
  const getFullPath = (page: Page): string => {
    if (page.slug === 'home') {
      return '/'
    }

    // Use breadcrumbs to construct full path for nested pages
    if (page.breadcrumbs && Array.isArray(page.breadcrumbs) && page.breadcrumbs.length > 0) {
      const lastBreadcrumb = page.breadcrumbs[page.breadcrumbs.length - 1]
      return lastBreadcrumb?.url || `/${page.slug}`
    }

    // Fallback to slug
    return `/${page.slug}`
  }

  // Revalidate current published page
  if (doc._status === 'published') {
    const path = getFullPath(doc)
    
    payload.logger.info(`🔄 Revalidating page: ${path}`)
    
    // Revalidate ONLY this specific path
    revalidatePath(path)
    
    // Revalidate ONLY this specific page's cache tag
    revalidateTag(`page-${doc.slug}`)
    
    payload.logger.info(`✅ Revalidated: ${path}`)
  }

  // Revalidate old path if page was unpublished or slug changed
  if (previousDoc?._status === 'published') {
    const oldPath = getFullPath(previousDoc)
    const newPath = getFullPath(doc)
    
    // If unpublished or slug changed, revalidate old path
    if (doc._status !== 'published' || oldPath !== newPath) {
      payload.logger.info(`🔄 Revalidating old page: ${oldPath}`)
      
      revalidatePath(oldPath)
      revalidateTag(`page-${previousDoc.slug}`)
      
      payload.logger.info(`✅ Revalidated old path: ${oldPath}`)
    }
  }

  return doc
}

/**
 * Revalidates ONLY the deleted page
 */
export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ 
  doc, 
  req: { payload, context } 
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
  
  payload.logger.info(`🗑️  Revalidating deleted page: ${path}`)
  
  // Revalidate ONLY this specific path
  revalidatePath(path)
  revalidateTag(`page-${doc?.slug}`)
  
  payload.logger.info(`✅ Revalidated after deletion: ${path}`)

  return doc
}