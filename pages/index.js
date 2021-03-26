import Link from 'next/link'
import { getPosts } from 'pages/api/posts'

export default function Home({ posts }) {
  return (
    <>
      <h2>Posts</h2>
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

export async function getStaticProps() {
	const posts = getPosts()

	return {
		props: { posts },
	};
}
