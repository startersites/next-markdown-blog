import Link from 'next/link'
import { getPostsByCategory } from 'pages/api/categories/[category]/posts'
import { getCategories, getCategoryBySlug } from 'pages/api/categories'
import MetaHead from 'components/MetaHead'
const blog = require('nmbs.config.json')

export default function Category({ category, posts }) {
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

export async function getStaticPaths() {
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

export async function getStaticProps({ params }) {
  const category = getCategoryBySlug(params.category)
  const posts = getPostsByCategory(params.category)

  return {
    props: { category, posts },
  }
}
