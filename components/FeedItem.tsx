import Link from 'next/link'

interface FeedItemProps {
  title: string
  link: string
  children?: React.ReactNode
}

export default function FeedItem({
  title,
  link,
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
      {children}
    </article>
  )
}
