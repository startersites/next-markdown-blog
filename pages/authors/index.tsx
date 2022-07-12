import { GetStaticProps } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getAuthors } from 'pages/api/authors'
import site from 'site.config'

export default function Authors({ authors }: { authors: ObjectWithPosts[] }) {
  return (
    <PageLayout title={`${site.authors.name}`}>
      <section>
        {authors.map(
          (author) =>
            author?.posts?.length > 0 && (
              <FeedItem
                key={author.slug}
                title={`${author.title}`}
                link={`/authors/${author.slug}`}
              />
            )
        )}
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
