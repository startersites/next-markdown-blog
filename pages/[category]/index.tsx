import { GetStaticProps, GetStaticPaths } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getCategories, getCategoryBySlug } from 'pages/api/categories'
import site from 'site.config'

export default function Category({ category }: { category: ObjectWithPosts }) {
  return (
    <PageLayout
      title={`${site.categories.name_singular}: ${category.title}`}
      metaTitle={`${category.title}${site.seo.sep}${site.categories.name}`}
    >
      <section>
        {category?.posts.map((post) => (
          <FeedItem
            key={post.slug}
            title={`${post.title}`}
            link={`/${category.slug}/${post.slug}`}
            image={post.thumbnail}
            excerpt={post.excerpt}
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
          category: category.slug as string,
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
