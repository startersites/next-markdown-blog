import Link from 'next/link'
const blog = require('nmbs.config.json')

export default function Footer() {
  return (
    <footer role="contentinfo" className="font-sans px-wrap">
      <p className="text-xs text-center py-2">Copyright &copy; {new Date().getFullYear()} <Link href="/">{blog.legal_name || blog.name}</Link>. All rights reserved.</p>
    </footer>
  )
}
