import Link from 'next/link'
import { getTags } from 'pages/api/tags'
import MetaHead from 'components/MetaHead'

import { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Tags({
  tags,
}: {
  tags: MarkdownFileObject[]
}) {
  return (
    <>
      <MetaHead title={`${blog.tags.name}`} />
      <h1>{blog.tags.name}</h1>
      <ul>
        {tags.map(tag => (
          <li key={tag.slug}>
            <Link href={`/tags/${tag.slug}`}>{tag.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const tags = getTags()

  return {
    props: { tags },
  }
}
