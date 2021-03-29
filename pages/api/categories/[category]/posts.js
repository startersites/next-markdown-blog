import fs from 'fs'
import { postsDirectory, getPostBySlug } from 'pages/api/posts'

export function getPostsByCategory(category, fields = []) {
  const slugs = fs.readdirSync(postsDirectory)

  const content = slugs
    .map((slug) => getPostBySlug(slug, fields))
  // sort content by date in descending order
    .sort((content1, content2) => (
      content1.publish_date > content2.publish_date ? '-1' : '1'
    ))


  content.forEach((post, i) => {
    if (post.category !== category) {
      content.splice(i, 1)
    }
  })

  return content
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query.category
  const queryFields = req.query.fields

  let fields
  if (queryFields) {
    fields = queryFields.split(',')
  } else {
    fields = []
  }

  const content = getPostsByCategory(slug, fields)
  res.status(200).json(content)
}
