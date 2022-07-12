import Link from 'next/link'

import site from 'site.config'

export default function Header() {
  const navLinks = [
    { href: '/search', label: 'Search' },
    { href: '/categories', label: site.categories.name },
    { href: '/tags', label: site.tags.name },
    { href: '/authors', label: site.authors.name },
  ]

  return (
    <header role="banner" className="site-header">
      <Link href="/">
        <a className="home-link">{site.name}</a>
      </Link>
      <nav role="navigation" aria-label="main navigation">
        {navLinks.map((link, i) => (
          <Link key={i} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
