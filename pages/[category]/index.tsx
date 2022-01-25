import Link from 'next/link'
import { getPostsByCategory } from 'pages/api/categories/[category]/posts'
import { getCategories, getCategoryBySlug } from 'pages/api/categories'
import MetaHead from 'components/MetaHead'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Category({
  category,
  posts,
}: {
  category: RequiredMarkdownObject
  posts: RequiredMarkdownObject[]
}) {
  return (
    <>
      <MetaHead
        title={`${category.title}${blog.seo.sep}${blog.categories.name}`}
      />
      <h1>{category.title}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/${category.slug}/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const categories = getCategories()

  return {
    paths: categories.map((category) => {
      return {
        params: {
          category: category.slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params

  let category: MarkdownFileObject
  const posts: MarkdownFileObject[] = []

  if (params?.category) {
    category = getCategoryBySlug(params.category.toString())
    posts.push(...getPostsByCategory(params.category.toString()))
  } else {
    category = {}
  }

  return {
    props: { category, posts },
  }
}
