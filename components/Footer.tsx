import Link from 'next/link'
const blog = require('nmbs.config.json')

export default function Footer() {
  return (
    <footer role="contentinfo" className="font-sans">
      <p>Copyright &copy; {new Date().getFullYear()} <Link href="/">{blog.name}</Link>. All rights reserved.</p>
    </footer>
  )
}
