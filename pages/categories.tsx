import { getCategories } from 'pages/api/categories'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import type { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Categories({
  categories,
}: {
  categories: ObjectWithPosts[]
}) {
  console.log(categories)
  return (
    <PageLayout title={blog.categories.name}>
      <section className="feed-wrapper">
        {categories.map(category => category?.posts?.length > 0 && (
          <FeedItem
            key={category.slug}
            title={`${category.title}`}
            link={`/${category.slug}`}
          />
        ))}
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
