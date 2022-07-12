import { GetStaticProps, GetStaticPaths } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getTags, getTagBySlug } from 'pages/api/tags'
import site from 'site.config'

export default function Tag({ tag }: { tag: ObjectWithCategory }) {
  return (
    <PageLayout
      title={`${site.tags.name_singular}: ${tag.title}`}
      metaTitle={`${tag.title}${site.seo.sep}${site.tags.name}`}
    >
      <section>
        {tag.posts.map((post) => (
          <FeedItem
            key={post.slug}
            title={`${post.title}`}
            link={`/${post.category.slug}/${post.slug}`}
            image={post.thumbnail}
            type={post.category.title}
            excerpt={post.excerpt}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const tags = getTags()

  return {
    paths: tags.map((tag) => {
      return {
        params: {
          tag: tag.slug as string,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params
  const tagSlug = params?.tag?.toString()

  let tag: MarkdownFileObject

  if (tagSlug) {
    tag = getTagBySlug(tagSlug, [], true)
  } else {
    tag = {}
  }

  return {
    props: { tag },
  }
}
