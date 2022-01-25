import Link from 'next/link'
import { getPosts } from 'pages/api/posts'
import MetaHead from 'components/MetaHead'
import { GetStaticProps } from 'next'
const blog = require('nmbs.config.json')

export default function Home({
  posts,
}: {
  posts: MarkdownFileObject[]
}) {
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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPosts()

  return {
    props: { posts },
  }
}
