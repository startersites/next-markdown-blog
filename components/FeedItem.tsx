import Link from 'next/link'

interface FeedItemProps {
  title: string
  link: string
  excerpt?: string
  children?: React.ReactNode
}

export default function FeedItem({
  title,
  link,
  excerpt,
  children,
}: FeedItemProps) {
  return (
    <article>
      <header>
        <h2>
          <Link href={link}>
            {title}
          </Link>
        </h2>
      </header>
      {excerpt && (
        <p className="mt-1">{excerpt}</p>
      )}
      {children}
    </article>
  )
}
