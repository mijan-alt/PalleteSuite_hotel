
import type { Page } from '@/payload-types'

export type HeroProps = Page['hero'] & {
  breadcrumbs?: Page['breadcrumbs']
  currentPage?: Page['title']
}
