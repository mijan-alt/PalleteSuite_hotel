import Link from 'next/link'

type Crumb = {
  label?: string | null
  id?: string | null
}

export const Breadcrumbs: React.FC<{
  breadcrumbs?: Crumb[] | null
  currentPage?: string | null // New prop for top-level page label
}> = ({ breadcrumbs, currentPage }) => {
  // If no breadcrumbs and no currentPage, return null
  if (!breadcrumbs?.length && !currentPage) return null

  // Initialize crumbs with Home
  let crumbs: Crumb[] = [{ label: 'Home', id: 'home' }]

  // If breadcrumbs are provided (nested pages), append them
  if (breadcrumbs?.length) {
    crumbs = [...crumbs, ...breadcrumbs]
  } else if (currentPage) {
    // For top-level pages, append the current page as a crumb
    crumbs = [...crumbs, { label: currentPage, id: currentPage.toLowerCase() }]
  }

  let path = ''

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-center">
      <ul className="flex flex-wrap items-center justify-center">
        {crumbs.map((crumb, i) => {
          if (!crumb.label) return null

          // Build path progressively (Home is just "/")
          if (i === 0) {
            path = ''
          } else {
            path += `/${crumb.label.toLowerCase().replace(/\s+/g, '-')}`
          }

          const isLast = i === crumbs.length - 1

          return (
            <li key={crumb.id ?? i} className="flex items-center text-lg">
              {isLast ? (
                <span>{crumb.label}</span>
              ) : (
                <Link href={i === 0 ? '/' : path} className="hover:underline text-lg">
                  {crumb.label}
                </Link>
              )}
              {i < crumbs.length - 1 && <span className="mx-1">/</span>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
