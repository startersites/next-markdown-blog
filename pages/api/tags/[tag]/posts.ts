import fs from 'fs'
import { postsDirectory, getPostBySlug } from '../../posts'

import type { NextApiRequest, NextApiResponse } from 'next'

export function getPostsByTag(tag: string, fields: string[] | undefined = undefined, nested = false) {
  const slugs = fs.readdirSync(postsDirectory)

  const content = slugs
    .map((slug) => getPostBySlug(slug, fields, true))
    .sort((a, b) => {
      if (a.publish_date && b.publish_date) {
        return a.publish_date > b.publish_date ? -1 : 1
      }

      return 0
    })

  content.forEach((post, i) => {
    if (post.tags?.includes(tag)) {
      content.splice(i, 1)
    }
  })

  return content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query?.tag?.toString()
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPostsByTag(slug, fields)
  res.status(200).json(content)
}
