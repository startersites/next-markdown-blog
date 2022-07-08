import type { GetStaticProps } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getPosts } from 'pages/api/posts'

const blog = require('site.config.json')

export default function Home({ posts }: { posts: NestedPostObject[] }) {
  return (
    <PageLayout title={blog.posts.name}>
      <section className="feed-wrapper">
        {posts.map((post, i) => (
          <FeedItem
            key={post.slug}
            title={`${post.title}`}
            link={`/${post.category.slug}/${post.slug}`}
            image={post.thumbnail}
            type={post.category.title}
            excerpt={post.excerpt}
            feature={i === 0 ? true : false}
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
