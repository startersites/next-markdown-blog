import Link from 'next/link'
import { getAuthors } from 'pages/api/authors'

export default function Authors({ authors }) {
  return (
    <>
      <h1>Authors</h1>
      <ul>
        {authors.map(author => (
          <li>
            <Link href={`/authors/${author.slug}`}>{author.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticProps() {
	const authors = getAuthors();

	return {
		props: { authors },
	};
}
