import { GetStaticProps } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getTags } from 'pages/api/tags'

const blog = require('site.config.json')

export default function Tags({ tags }: { tags: ObjectWithPosts[] }) {
  return (
    <PageLayout title={blog.tags.name}>
      <section className="feed-wrapper">
        {tags.map(
          (tag) =>
            tag?.posts?.length > 0 && (
              <FeedItem
                key={tag.slug}
                title={`${tag.title}`}
                link={`/tags/${tag.slug}`}
              />
            )
        )}
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
