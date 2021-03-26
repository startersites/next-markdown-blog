import Link from 'next/link'
import { getPosts, getPostBySlug } from 'pages/api/posts'
import { getCategoryBySlug } from 'pages/api/categories'
import { getAuthorBySlug } from 'pages/api/authors'
import { getTagsBySlugs } from 'pages/api/tags'

export default function Post({ post, category, author, tags }) {
  return (
    <>
      <h1>{post.title}</h1>
      <p>by {author.title}</p>
      <p>
        <span>Category: </span>
        <Link href={`/${category.slug}`}>{category.title}</Link>
      </p>
      <p>
        <span>Tags: </span>
        {tags.map(tag => (
          <Link href={`/tags/${tag.slug}`} key={tag.slug}>{tag.title}</Link>
        ))}
      </p>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
    </>

  )
}

export async function getStaticPaths() {
	const posts = getPosts();

	return {
		paths: posts.map((post) => {
			return {
				params: {
					post: post.slug,
					category: post.category,
				},
			};
		}),
		fallback: false,
	};
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
	};
}
