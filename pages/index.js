import Link from 'next/link'
import { getPosts } from 'pages/api/posts'
import MetaHead from 'components/MetaHead'
const blog = require('nmbs.config.json')

export default function Home({ posts }) {
  return (
    <>
      <MetaHead />
      <h2>{blog.posts.name}</h2>
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
  }
}
