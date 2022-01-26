import { getAuthors, getAuthorBySlug } from 'pages/api/authors'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Author({
  author,
}: {
  author: AuthorObjectWithCategory,
}) {
  return (
    <PageLayout title={`${blog.authors.name_singular}: ${author.title}`} metaTitle={`${author.title}${blog.seo.sep}${blog.authors.name}`}>
      <div className="md:flex">
        {author.image && (
          <img src={author.image} alt={author.title} className="object-fit rounded-full w-32 h-32 mb-8 md:mb-0 md:mr-8" />
        )}

        <div id="post-content" dangerouslySetInnerHTML={{__html: author.content}} />
      </div>

      <section className="mt-12 pt-12 border-t border-gray-300">
        <h2 className="mb-8 h3">{blog.posts.name} by {author.title}</h2>
        <div className="feed-wrapper">
          {author.posts.map(post => (
            <FeedItem
              key={post.slug}
              title={`${post.title}`}
              link={`/${post.category.slug}/${post.slug}`}
              image={post.thumbnail}
              type={post.category.title}
              excerpt={post.excerpt}
            />
          ))}
        </div>
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
          author: author.slug,
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
