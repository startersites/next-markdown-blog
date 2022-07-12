import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'

import MetaHead from 'components/MetaHead'
import { getPostsByCategory } from 'pages/api/categories/[category]/posts'
import { getPosts, getPostBySlug } from 'pages/api/posts'
import site from 'site.config'

export default function Post({
  post,
  categoryPosts,
}: {
  post: NestedPostObject
  categoryPosts: NestedPostObject[]
}) {
  const {
    title,
    slug,
    published_at,
    thumbnail,
    excerpt,
    author,
    category,
    tags,
  } = post

  const relatedPosts = categoryPosts.filter((post) => post.slug !== slug)

  return (
    <article className="post">
      <header>
        <MetaHead
          title={title}
          description={excerpt}
          type="article"
          image={thumbnail}
          authorTwitter={author.twitter}
        />
        <h1>{title}</h1>
        {published_at && (
          <time dateTime={published_at} title={published_at}>
            {published_at}
          </time>
        )}
        {thumbnail && <img src={thumbnail} alt={title} />}
        <div className="meta">
          {author && (
            <p>
              <span>Author: </span>
              <Link href={`/authors/${author.slug}`}>{author.title}</Link>
            </p>
          )}
          {category && (
            <p>
              <span>{site.categories.name_singular}: </span>
              <Link href={`/${category.slug}`}>{category.title}</Link>
            </p>
          )}
        </div>
      </header>

      {post.content && (
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <footer>
        {tags && tags.length > 0 && (
          <p className="post-tags">
            <span>
              {tags.length > 1 ? site.tags.name : site.tags.name_singular}:{' '}
            </span>
            {tags.map((tag) => (
              <Link href={`/tags/${tag.slug}`} key={tag.slug}>
                {tag.title}
              </Link>
            ))}
          </p>
        )}
        <section className="author-info">
          <h2 className="h4">About the Author</h2>
          <div>
            {author.image && (
              <Link href={`/authors/${author.slug}`}>
                <a>
                  <img src={author.image} alt={author.title} />
                </a>
              </Link>
            )}
            <div>
              <h3 className="h5">
                <Link href={`/authors/${author.slug}`}>{author.title}</Link>
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: author.short_bio }}
                className="bio"
              />
            </div>
          </div>
        </section>
      </footer>

      {relatedPosts && relatedPosts.length > 0 && (
        <aside>
          <h2 className="h4">Related Posts</h2>

          <section>
            {relatedPosts.slice(0, 2).map((post) => (
              <article key={post.slug}>
                <header>
                  <Link href={`/${category.slug}/${post.slug}`}>
                    <a>
                      {post.thumbnail && (
                        <img src={post.thumbnail} alt={post.title} />
                      )}
                      <h3 className="h5">{post.title}</h3>
                    </a>
                  </Link>
                </header>
                {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
              </article>
            ))}
          </section>
        </aside>
      )}
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          post: post.slug as string,
          category: (post.category as { [x: string]: unknown }).slug as string,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params

  let post: MarkdownFileObject
  const categoryPosts = []

  if (params?.post) {
    post = getPostBySlug(params.post.toString(), [], true)
  } else {
    post = {}
  }

  if (post?.category?.slug) {
    categoryPosts.push(...getPostsByCategory(post.category.slug, []))
  }

  return {
    props: {
      post,
      categoryPosts,
    },
  }
}
