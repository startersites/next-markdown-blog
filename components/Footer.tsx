import Link from 'next/link'

import site from 'site.config'

export default function Footer() {
  return (
    <footer role="contentinfo" className="site-footer">
      <p className="copyright">
        Copyright &copy; {new Date().getFullYear()}{' '}
        <Link href="/">{site.legal_name || site.name}</Link>. All rights
        reserved.
      </p>
    </footer>
  )
}
