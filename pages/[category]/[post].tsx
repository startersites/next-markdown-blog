import { getPosts, getPostBySlug } from 'pages/api/posts'
import PostHeader from 'components/PostHeader'

import { GetStaticProps, GetStaticPaths } from 'next'

export default function Post({
  post,
}: {
  post: NestedPostObject,
}) {
  return (
    <article>
      <PostHeader title={`${post.title}`} category={post.category} author={post.author} tags={post.tags} />
      <div dangerouslySetInnerHTML={post?.content ? { __html: post.content } : undefined } />
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

  if (params?.post) {
    post = getPostBySlug(params.post.toString(), [], true)
  } else {
    post = {}
  }

  return {
    props: {
      post,
    },
  }
}
