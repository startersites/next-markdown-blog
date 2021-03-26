import Link from 'next/link'
import { getCategories } from 'pages/api/categories'
const blog = require('nmbs.config.json')

export default function Categories({ categories }) {
  return (
    <>
      <h1>{blog.categories.name}</h1>
      <ul>
        {categories.map(category => (
          <li>
            <Link href={`/${category.slug}`}>{category.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
	const categories = getCategories();

	return {
		props: { categories },
	};
}
