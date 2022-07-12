import type { GetStaticProps } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getCategories } from 'pages/api/categories'
import site from 'site.config'

export default function Categories({
  categories,
}: {
  categories: ObjectWithPosts[]
}) {
  return (
    <PageLayout title={site.categories.name}>
      <section>
        {categories.map(
          (category) =>
            category?.posts?.length > 0 && (
              <FeedItem
                key={category.slug}
                title={`${category.title}`}
                link={`/${category.slug}`}
              />
            )
        )}
      </section>
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const categories = getCategories()

  return {
    props: { categories },
  }
}
