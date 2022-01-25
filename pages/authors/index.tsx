import Link from 'next/link'
import { getAuthors } from 'pages/api/authors'
import MetaHead from 'components/MetaHead'

import { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Authors({
  authors
}: {
  authors: MarkdownFileObject[]
}) {
  return (
    <>
      <MetaHead title={`${blog.authors.name}`} />
      <h1>{blog.authors.name}</h1>
      <ul>
        {authors.map(author => (
          <li key={author.slug}>
            <Link href={`/authors/${author.slug}`}>{author.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const authors = getAuthors()

  return {
    props: { authors },
  }
}
