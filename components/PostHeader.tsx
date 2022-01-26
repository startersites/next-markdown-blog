import Link from 'next/link'
import MetaHead from 'components/MetaHead'

const blog = require('nmbs.config.json')

interface PostHeaderProps {
  title: string
  metaTitle?: string
  category?: MarkdownFileObject,
  author?: MarkdownFileObject,
  tags?: MarkdownFileObject[],
}

export default function PostHeader({
  title,
  metaTitle,
  category,
  author,
  tags,
}: PostHeaderProps) {
  return (
    <header className="mb-8 font-sans">
      <MetaHead title={metaTitle || title} />
      <h1>{title}</h1>
      <div className="text-base mt-2">
        {author && (
          <p>
            <span>Author: </span>
            <Link href={`/authors/${author.slug}`}>{author.title}</Link>
          </p>
        )}
        {category && (
          <p>
            <span>{blog.categories.name_singular}: </span>
            <Link href={`/${category.slug}`}>{category.title}</Link>
          </p>
        )}
        {tags && tags.length > 0 &&(
          <p>
            <span>
              {tags.length > 1 ? blog.tags.name : blog.tags.name_singular}:{' '}
            </span>
            {tags.map(tag => (
              <Link href={`/tags/${tag.slug}`} key={tag.slug}>{tag.title}</Link>
            ))}
          </p>
        )}
      </div>
    </header>
  )
}
