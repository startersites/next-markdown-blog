import { GetStaticProps, GetStaticPaths } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import MetaHead from 'components/MetaHead'
import { getPostsByCategory } from 'pages/api/categories/[category]/posts'
import { getPosts, getPostBySlug } from 'pages/api/posts'

const blog = require('site.config.json')

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
    <article>
      <header className="mb-8 font-sans">
        <MetaHead
          title={title}
          description={excerpt}
          type="article"
          image={thumbnail}
          authorTwitter={author.twitter}
        />
        <h1>{title}</h1>
        {published_at && (
          <time
            className="text-sm block mt-2"
            dateTime={published_at}
            title={published_at}
          >
            {published_at}
          </time>
        )}
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={title}
            className="aspect-video object-cover mt-8"
          />
        )}
        <div className="text-base flex items-center justify-between mt-2">
          {author && (
            <p>
              <span>Author: </span>
              <Link href={`/authors/${author.slug}`}>{author.title}</Link>
            </p>
          )}
          {category && (
            <p>
              <span>{blog.categories.name_singular}: </span>
              <Link href={`/${category.slug}`}>{category.title}</Link>
            </p>
          )}
        </div>
      </header>

      {post.content && (
        <div
          id="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <footer className="mt-6">
        {tags && tags.length > 0 && (
          <p>
            <span>
              {tags.length > 1 ? blog.tags.name : blog.tags.name_singular}:{' '}
            </span>
            {tags.map((tag) => (
              <Link href={`/tags/${tag.slug}`} key={tag.slug}>
                {tag.title}
              </Link>
            ))}
          </p>
        )}
        <section className=" border-t border-gray-300 mt-6 pt-6">
          <h2 className="h4 mb-4">About the Author</h2>
          <div className="md:flex">
            <Link href={`/authors/${author.slug}`}>
              <a className="inline-block mb-4 md:mb-0 md:mr-4">
                <Image
                  src={author.image}
                  alt={author.title}
                  className="aspect-square rounded-full object-cover w-32"
                />
              </a>
            </Link>
            <div>
              <h3 className="h5">
                <Link href={`/authors/${author.slug}`}>{author.title}</Link>
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: author.short_bio }}
                className="mt-4"
              />
            </div>
          </div>
        </section>
      </footer>

      {relatedPosts && relatedPosts.length > 0 && (
        <aside className=" border-t border-gray-300 mt-6 pt-6">
          <h2 className="h4 mb-4">Related Posts</h2>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {relatedPosts.slice(0, 2).map((post) => (
              <article key={post.slug}>
                <header>
                  <Link href={`/${category.slug}/${post.slug}`}>
                    <a>
                      <Image src={post.thumbnail} alt={post.title} />
                      <h3 className="h5 mt-2">{post.title}</h3>
                    </a>
                  </Link>
                </header>
                {post.excerpt && (
                  <p className="text-base mt-1">{post.excerpt}</p>
                )}
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
          post: post.slug,
          category: post.category.slug,
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
