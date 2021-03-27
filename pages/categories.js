import Link from 'next/link'
import { getCategories } from 'pages/api/categories'
import MetaHead from 'components/MetaHead'
const blog = require('nmbs.config.json')

export default function Categories({ categories }) {
  return (
    <>
      <MetaHead title={`${blog.categories.name}`} />
      <h1>{blog.categories.name}</h1>
      <ul>
        {categories.map(category => (
          <li key={category.slug}>
            <Link href={`/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
  const categories = getCategories()

  return {
    props: { categories },
  }
}
