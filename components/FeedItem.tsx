import Link from 'next/link'

interface FeedItemProps {
  title: string
  link: string
  image?: string
  excerpt?: string
  type?: string
  feature?: boolean
}

export default function FeedItem({
  title,
  link,
  image,
  excerpt,
  type,
  feature,
}: FeedItemProps) {
  return (
    <article className={`${!feature ? 'md:flex ' : ''}items-center`}>
      {image && (
        <Link href={link}>
          <a>
            <img src={image} alt={title} className={`${!feature ? 'mb-4 md:mb-0 md:max-w-xs md:mr-6' : 'mb-4'} aspect-video object-cover`} />
          </a>
        </Link>
      )}
      <div>
        <header>
          <p className="text-xs uppercase font-sans font-bold">{type}</p>
          <h2 className="text-3xl">
            <Link href={link}>
              {title}
            </Link>
          </h2>
        </header>
        {excerpt && (
          <p className="mt-1">{excerpt}</p>
        )}
      </div>
    </article>
  )
}
