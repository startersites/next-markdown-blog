import matter from 'gray-matter'
import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'
import { join } from 'path'

import { getPostsByTag } from './[tag]/posts'

// const md = require('markdown-it')()

export const tagsDirectory = join(process.cwd(), '_content/tags')

export function getTagsBySlugs(
  slugs: string[],
  fields: string[] | undefined = undefined
) {
  const tags: MarkdownFileObject[] = []

  if (slugs !== undefined && slugs.length) {
    slugs.forEach((slug) => {
      const tag = getTagBySlug(slug, fields)
      tags.push(tag)
    })
  }

  return tags
}

export function getTagBySlug(
  slug: string,
  fields: string[] | undefined = undefined,
  nested = false
) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(tagsDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  const posts =
    nested && (!fields || fields.length === 0 || fields.includes('posts'))
      ? getPostsByTag(realSlug, ['title', 'category', 'excerpt', 'thumbnail'])
      : undefined

  const theData: { [x: string]: unknown } = {
    ...data,
    posts,
    slug: realSlug,
  }

  if (fields !== undefined && fields.length) {
    const filteredData: { [x: string]: unknown } = { slug: realSlug }

    fields.forEach((field) => {
      if (field !== slug && theData[field]) {
        filteredData[field] = theData[field]
      }
    })

    return filteredData
  }

  return theData
}

export function getTags(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(tagsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(tagsDirectory)

  const content = slugs
    .map((slug) => getTagBySlug(slug, fields, true))
    .sort((a, b) => {
      if (
        a.title &&
        b.title &&
        typeof a.title === 'string' &&
        typeof b.title === 'string'
      ) {
        return a.title > b.title ? -1 : 1
      }

      return 0
    })

  return content
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getTags(fields)
  res.status(200).json(content)
}
