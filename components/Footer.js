import Link from 'next/link'

export default function Footer() {
  return (
    <footer role="contentinfo" className="font-sans">
      <p>Copyright &copy; {new Date().getFullYear()} <Link href="/">Next Markdown Blog Starter</Link>. All rights reserved.</p>
    </footer>
  )
}
