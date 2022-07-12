import matter from 'gray-matter'
import md from 'markdown-it'
import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'
import { join } from 'path'

import { getAuthorBySlug } from '../authors'
import { getCategoryBySlug } from '../categories'
import { getTagBySlug } from '../tags'

export const postsDirectory = join(process.cwd(), '_content/posts')

export function getPostBySlug(
  slug: string,
  fields: string[] | undefined = undefined,
  nested = false
) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(postsDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const category =
    nested &&
    data?.category &&
    (!fields || fields.length === 0 || fields.includes('category'))
      ? getCategoryBySlug(data.category, ['title'])
      : data.category

  const author =
    nested &&
    data?.author &&
    (!fields || fields.length === 0 || fields.includes('author'))
      ? getAuthorBySlug(data.author, [
          'title',
          'twitter',
          'short_bio',
          'image',
          'content',
        ])
      : data.author

  const tags: MarkdownFileObject[] = []

  if (nested && data.tags && data.tags.length > 0) {
    data.tags.forEach((tag: string) => tags.push(getTagBySlug(tag, ['title'])))
  } else if (data?.tags) {
    tags.push(...data.tags)
  }

  const theData: { [x: string]: unknown } = {
    ...data,
    slug: realSlug,
    author,
    category,
    tags,
    content: md().render(content),
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

export function getPosts(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(postsDirectory)

  const content = slugs
    .map((slug) => getPostBySlug(slug, fields, true))
    .sort((a, b) => {
      if (
        a.published_at &&
        b.published_at &&
        typeof a.published_at === 'string' &&
        typeof b.published_at === 'string'
      ) {
        return a.published_at > b.published_at ? -1 : 1
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

  const fields = []
  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPosts(fields)
  res.status(200).json(content)
}
