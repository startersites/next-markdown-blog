import { getCategories, getCategoryBySlug } from 'pages/api/categories'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Category({
  category,
}: {
  category: ObjectWithPosts
}) {
  return (
    <PageLayout title={`${category.title}`} metaTitle={`${category.title}${blog.seo.sep}${blog.categories.name}`}>
      <section>
        {category?.posts.map(post => (
          <FeedItem
            key={post.slug}
            title={`${post.title}`}
            link={`/${category.slug}/${post.slug}`}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const categories = getCategories()

  return {
    paths: categories.map((category) => {
      return {
        params: {
          category: category.slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params
  const categorySlug = params?.category?.toString()

  let category: MarkdownFileObject

  if (categorySlug) {
    category = getCategoryBySlug(categorySlug, [], true)
  } else {
    category = {}
  }

  return {
    props: { category },
  }
}
