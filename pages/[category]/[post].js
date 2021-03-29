import Link from 'next/link'
import { getPosts, getPostBySlug } from 'pages/api/posts'
import { getCategoryBySlug } from 'pages/api/categories'
import { getAuthorBySlug } from 'pages/api/authors'
import { getTagsBySlugs } from 'pages/api/tags'
import MetaHead from 'components/MetaHead'
const blog = require('nmbs.config.json')

export default function Post({ post, category, author, tags }) {
  return (
    <>
      <MetaHead title={`${post.title}`} />
      <h1>{post.title}</h1>
      <p>
        <span>by: </span>
        <Link href={`/authors/${author.slug}`}>{author.title}</Link>
      </p>
      <p>
        <span>{blog.categories.name_singular}: </span>
        <Link href={`/${category.slug}`}>{category.title}</Link>
      </p>
      <p>
        <span>
          {tags.length > 1 ? blog.tags.name : blog.tags.name_singular}:
        </span>
        {tags.map(tag => (
          <Link href={`/tags/${tag.slug}`} key={tag.slug}>{tag.title}</Link>
        ))}
      </p>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
    </>

  )
}

export async function getStaticPaths() {
  const posts = getPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          post: post.slug,
          category: post.category,
        },
      }
    }),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const category = getCategoryBySlug(params.category)
  const post = getPostBySlug(params.post)
  const author = getAuthorBySlug(post.author)
  const tags = getTagsBySlugs(post.tags)

  return {
    props: {
      post: {
        ...post,
      },
      category: {
        ...category,
      },
      author: {
        ...author
      },
      tags: tags,
    },
  }
}
