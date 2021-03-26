import Link from 'next/link'
import { getTags } from 'pages/api/tags'
const blog = require('nmbs.config.json')

export default function Tags({ tags }) {
  return (
    <>
      <h1>{blog.tags.name}</h1>
      <ul>
        {tags.map(tag => (
          <li>
            <Link href={`/tags/${tag.slug}`}>{tag.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
	const tags = getTags();

	return {
		props: { tags },
	};
}
