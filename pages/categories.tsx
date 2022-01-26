import { getCategories } from 'pages/api/categories'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import type { GetStaticProps } from 'next'

const blog = require('nmbs.config.json')

export default function Categories({
  categories,
}: {
  categories: MarkdownFileBase[]
}) {
  return (
    <PageLayout title={blog.categories.name}>
      <section>
        {categories.map(category => (
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
