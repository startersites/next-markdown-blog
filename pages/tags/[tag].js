import Link from 'next/link'
import { getPostsByTag } from 'pages/api/tags/[tag]/posts'
import { getTags, getTagBySlug } from 'pages/api/tags'

export default function Tag({ tag, posts }) {
  return (
    <>
      <h1>{tag.title}</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/${post.category}/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getStaticPaths() {
	const tags = getTags()

	return {
		paths: tags.map((tag) => {
			return {
				params: {
					tag: tag.slug,
				},
			};
		}),
		fallback: false,
	};
}

export async function getStaticProps({ params }) {
  const tag = getTagBySlug(params.tag)
	const posts = getPostsByTag(params.tag)

	return {
		props: { tag, posts },
	};
}
