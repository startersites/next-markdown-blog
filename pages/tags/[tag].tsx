import Link from 'next/link'
import { getPostsByTag } from 'pages/api/tags/[tag]/posts'
import { getTags, getTagBySlug } from 'pages/api/tags'
import MetaHead from 'components/MetaHead'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Tag({
  tag,
  posts,
}: {
  tag: MarkdownFileObject,
  posts: MarkdownFileObject[]
}) {
  return (
    <>
      <MetaHead title={`${tag.title}${blog.seo.sep}${blog.tags.name}`} />
      <h1>{tag.title}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/${post.category}/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const tags = getTags()

  return {
    paths: tags.map((tag) => {
      return {
        params: {
          tag: tag.slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params

  let tag: MarkdownFileObject
  const posts: MarkdownFileObject[] = []

  if (params?.tag) {
    tag = getTagBySlug(params.tag.toString())
    posts.push(...getPostsByTag(params.tag.toString()))
  } else {
    tag = {}
  }

  return {
    props: { tag, posts },
  }
}
