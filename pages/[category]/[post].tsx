import Link from 'next/link'
import { getPosts, getPostBySlug } from 'pages/api/posts'
import { getCategoryBySlug } from 'pages/api/categories'
import { getAuthorBySlug } from 'pages/api/authors'
import { getTagsBySlugs } from 'pages/api/tags'
import MetaHead from 'components/MetaHead'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Post({
  post,
  category,
  author,
  tags,
}: {
  post: MarkdownFileObject,
  category: MarkdownFileObject,
  author: MarkdownFileObject,
  tags: MarkdownFileObject[],
}) {
  return (
    <>
      <MetaHead title={`${post.title}`} />
      <h1>{post.title}</h1>
      <p>
        <span>by: </span>
        <Link href={`/authors/${author.slug}`}>{author.title}</Link>
      </p>
      <p>
        <span>{blog.categories.name_singular}: </span>
        <Link href={`/${category.slug}`}>{category.title}</Link>
      </p>
      <p>
        <span>
          {tags.length > 1 ? blog.tags.name : blog.tags.name_singular}:
        </span>
        {tags.map(tag => (
          <Link href={`/tags/${tag.slug}`} key={tag.slug}>{tag.title}</Link>
        ))}
      </p>
      <div dangerouslySetInnerHTML={post?.content ? { __html: post.content } : undefined } />
    </>

  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          post: post.slug,
          category: post.category,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params

  let category: MarkdownFileObject,
      post: MarkdownFileObject,
      author: MarkdownFileObject

  const tags: MarkdownFileObject[] = []

  if (params?.category) {
    category = getCategoryBySlug(params.category.toString())
  } else {
    category = {}
  }

  if (params?.post) {
    post = getPostBySlug(params.post.toString())
  } else {
    post = {}
  }

  if (post?.author) {
    author = getAuthorBySlug(post.author.toString())
  } else {
    author = {}
  }

  if (post && post.tags && Object.keys(post).length) {
    tags.push(...getTagsBySlugs(post.tags))
  }

  return {
    props: {
      post,
      category,
      author,
      tags,
    },
  }
}
