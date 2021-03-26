import Link from 'next/link'
import { useRouter } from 'next/router'
const blog = require('nmbs.config.json')

export default function Header() {
  const router = useRouter()
  const home = router.pathname === '/' ? true : false

  return (
    <header role="banner" className="flex flex-col font-sans items-center justify-between md:flex-row">
      <HomeLinkWrapper home={home} wrapper={children => <h1 className="text-base">{children}</h1>}>
        <Link href="/">
          <a className="font-bold">{blog.name}</a>
        </Link>
      </HomeLinkWrapper>
      <nav role="navigation" aria-label="main navigation" className="mt-4 md:ml-4 md:mt-0">
        <ul className="flex items-center">
          <NavLink href="/categories" title={blog.categories.name} />
          <NavLink href="/tags" title={blog.tags.name} />
          <NavLink href="/authors" title={blog.authors.name} />
        </ul>
      </nav>
    </header>
  )
}

function NavLink({ href, title }) {
  return (
    <li className="mx-2 md:ml-4 md:mx-0">
      <Link href={href}>{title}</Link>
    </li>
  )
}

function HomeLinkWrapper ({home, wrapper, children}) {
  return home ? wrapper(children) : children
}
