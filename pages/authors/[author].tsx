import Link from 'next/link'
import { getPostsByAuthor } from 'pages/api/authors/[author]/posts'
import { getAuthors, getAuthorBySlug } from 'pages/api/authors'
import MetaHead from 'components/MetaHead'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Author({
  author,
  posts,
}: {
  author: MarkdownFileObject,
  posts: MarkdownFileObject[],
}) {
  return (
    <>
      <MetaHead title={`${author.title}${blog.seo.sep}${blog.authors.name}`} />
      <h1>{author.title}</h1>
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
  const authors = getAuthors()

  return {
    paths: authors.map((author) => {
      return {
        params: {
          author: author.slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params

  let author: MarkdownFileObject
  const posts: MarkdownFileObject[] = []

  if (params?.author) {
    author = getAuthorBySlug(params.author.toString())
    posts.push(...getPostsByAuthor(params.author.toString()))
  } else {
    author = {}
  }

  return {
    props: { author, posts },
  }
}
