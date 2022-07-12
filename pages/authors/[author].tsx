import { GetStaticProps, GetStaticPaths } from 'next'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getAuthors, getAuthorBySlug } from 'pages/api/authors'
import site from 'site.config'

export default function Author({
  author,
}: {
  author: AuthorObjectWithCategory
}) {
  return (
    <PageLayout
      title={`${site.authors.name_singular}: ${author.title}`}
      metaTitle={`${author.title}${site.seo.sep}${site.authors.name}`}
      type="author"
    >
      <div className="content-container">
        {author.image && <img src={author.image} alt={author.title} />}

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: author.content }}
        />
      </div>

      <section className="posts">
        <h2 className="h3">
          {site.posts.name} by {author.title}
        </h2>
        {author.posts.map((post) => (
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
  const authors = getAuthors()

  return {
    paths: authors.map((author) => {
      return {
        params: {
          author: author.slug as string,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params
  const authorSlug = params?.author?.toString()

  let author: MarkdownFileObject

  if (authorSlug) {
    author = getAuthorBySlug(authorSlug, [], true)
  } else {
    author = {}
  }

  return {
    props: { author },
  }
}
