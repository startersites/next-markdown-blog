import { getTags } from 'pages/api/tags'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Tags({
  tags,
}: {
  tags: ObjectWithPosts[]
}) {
  return (
    <PageLayout title={blog.tags.name}>
      <section className="feed-wrapper">
        {tags.map(tag => tag?.posts?.length > 0 && (
          <FeedItem
            key={tag.slug}
            title={`${tag.title}`}
            link={`/tags/${tag.slug}`}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const tags = getTags()

  return {
    props: { tags },
  }
}
