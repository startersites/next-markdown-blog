import Link from 'next/link'
const blog = require('nmbs.config.json')

export default function Header() {
  return (
    <header role="banner" className="flex flex-col px-wrap py-2 font-sans items-center justify-between md:flex-row">
      <Link href="/">
        <a className="font-bold text-xl">{blog.name}</a>
      </Link>
      <nav role="navigation" aria-label="main navigation" className="mt-2 md:ml-4 md:mt-0">
        <ul className="flex items-center font-medium">
          <NavLink href="/search" title="Search" />
          <NavLink href="/categories" title={blog.categories.name} />
          <NavLink href="/tags" title={blog.tags.name} />
          <NavLink href="/authors" title={blog.authors.name} />
        </ul>
      </nav>
    </header>
  )
}

interface NavLinkProps {
  href: string
  title: string
}

function NavLink({ href, title }: NavLinkProps) {
  return (
    <li className="mx-2 md:ml-4 md:mx-0">
      <Link href={href}>{title}</Link>
    </li>
  )
}
