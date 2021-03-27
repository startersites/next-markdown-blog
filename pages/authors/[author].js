import Link from 'next/link'
import { getPostsByAuthor } from 'pages/api/authors/[author]/posts'
import { getAuthors, getAuthorBySlug } from 'pages/api/authors'
import MetaHead from 'components/MetaHead'
const blog = require('nmbs.config.json')

export default function Author({ author, posts }) {
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

export async function getStaticPaths() {
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

export async function getStaticProps({ params }) {
  const author = getAuthorBySlug(params.author)
  const posts = getPostsByAuthor(params.author)

  return {
    props: { author, posts },
  }
}
