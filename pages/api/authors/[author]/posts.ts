import fs from 'fs'
import { postsDirectory, getPostBySlug } from '../../posts'

import type { NextApiRequest, NextApiResponse } from 'next'

export function getPostsByAuthor(author: string, fields: string[] | undefined = undefined, nested = false) {
  const slugs = fs.readdirSync(postsDirectory)

  const spreadFields = fields && fields.length > 0 ? [...fields, 'title', 'category', 'author', 'excerpt', 'thumbnail'] : []

  const content = slugs
    .map((slug) => getPostBySlug(slug, spreadFields, nested))
    .sort((a, b) => (
      a.publish_date > b.publish_date ? -1 : 1
    ))

  content.forEach((post, i) => {
    if (post.author !== author && post.author.slug !== author) {
      content.splice(i, 1)
    } else {
      delete post.author
    }
  })

  return content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query?.author?.toString()
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPostsByAuthor(slug, fields)
  res.status(200).json(content)
}
