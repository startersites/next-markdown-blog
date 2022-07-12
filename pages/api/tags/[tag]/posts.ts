import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'

import { postsDirectory, getPostBySlug } from '../../posts'

export function getPostsByTag(
  tag: string,
  fields: string[] | undefined = undefined
) {
  const slugs = fs.readdirSync(postsDirectory)

  const updatedFields = fields && fields.length > 0 ? [...fields, 'tags'] : []

  const content = slugs
    .map((slug) => getPostBySlug(slug, updatedFields, true))
    .sort((a, b) => {
      if (
        a.publish_date &&
        b.publish_date &&
        typeof a.publish_date === 'string' &&
        typeof b.publish_date === 'string'
      ) {
        return a.publish_date > b.publish_date ? -1 : 1
      }

      return 0
    })

  for (let i = content.length - 1; i >= 0; i--) {
    const post = content[i]

    if (!post.tags) continue

    if (typeof (post.tags as string[])[0] === 'string') {
      if (!(post.tags as string[]).includes(tag)) {
        content.splice(i, 1)
      } else {
        // delete post.tags
      }
    } else {
      let hasTag = false

      for (let i = 0; i < post.tags.length; i++) {
        const element = post.tags[i]

        if (element.slug === tag) {
          hasTag = true
          break
        }
      }

      if (!hasTag) {
        content.splice(i, 1)
      } else {
        // delete post.tags
      }
    }
  }

  return content
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query?.tag?.toString() as string
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPostsByTag(slug, fields)
  res.status(200).json(content)
}
