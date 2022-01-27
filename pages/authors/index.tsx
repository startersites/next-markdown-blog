import { getAuthors } from 'pages/api/authors'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Authors({
  authors
}: {
  authors: ObjectWithPosts[]  
}) {
  return (
    <PageLayout title={`${blog.authors.name}`}>
      <section className="feed-wrapper">
        {authors.map(author => author?.posts?.length > 0 && (
          <FeedItem
            key={author.slug}
            title={`${author.title}`}
            link={`/authors/${author.slug}`}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const authors = getAuthors()

  return {
    props: { authors },
  }
}
