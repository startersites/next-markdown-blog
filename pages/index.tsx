import { getPosts } from 'pages/api/posts'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import type { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Home({
  posts,
}: {
  posts: NestedPostObject[]
}) {
  return (
    <PageLayout title={blog.posts.name}>
      <section>
        {posts.map(post => (
          <FeedItem
            key={post.slug}
            title={`${post.title}`}
            link={`/${post.category.slug}/${post.slug}`}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPosts()

  return {
    props: { posts },
  }
}
