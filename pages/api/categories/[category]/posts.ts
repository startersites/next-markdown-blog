import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'

import { postsDirectory, getPostBySlug } from '../../posts'

export function getPostsByCategory(
  category: string,
  fields: string[] | undefined = undefined
) {
  const slugs = fs.readdirSync(postsDirectory)

  const updatedFields =
    fields && fields.length > 0 ? [...fields, 'category'] : []

  const content = slugs
    .map((slug) => getPostBySlug(slug, updatedFields))
    .sort((a, b) => (a.publish_date > b.publish_date ? -1 : 1))

  for (let i = content.length - 1; i >= 0; i--) {
    const post = content[i]

    if (post.category !== category && post.category.slug !== category) {
      content.splice(i, 1)
    } else {
      delete post.category
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

  const slug = req.query?.category?.toString() as string
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPostsByCategory(slug, fields)
  res.status(200).json(content)
}
