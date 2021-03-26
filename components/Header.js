import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  const home = router.pathname === '/' ? true : false

  return (
    <header role="banner">
      <HomeLinkWrapper home={home} wrapper={children => <h1>{children}</h1>}>
        <Link href="/">
          Next Markdown Blog Starter
        </Link>
      </HomeLinkWrapper>
      <nav role="navigation" aria-label="main navigation">
        <ul>
          <NavLink href="/categories" title="Categories" />
          <NavLink href="/tags" title="Tags" />
          <NavLink href="/authors" title="Authors" />
        </ul>
      </nav>
    </header>
  )
}

function NavLink({ href, title }) {
  return (
    <li>
      <Link href={href}>{title}</Link>
    </li>
  )
}

function HomeLinkWrapper ({home, wrapper, children}) {
  return home ? wrapper(children) : children
}
