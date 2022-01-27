import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { getCategoryBySlug } from '../categories'
import { getTagBySlug } from '../tags'
import { getAuthorBySlug } from '../authors'

import type { NextApiRequest, NextApiResponse } from 'next'

const md = require('markdown-it')()

export const postsDirectory = join(process.cwd(), '_content/posts')

export function getPostBySlug(slug: string, fields: string[] | undefined = undefined, nested = false) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(postsDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const category = nested && data?.category && (!fields || fields.length === 0 || fields.includes('category')) ? getCategoryBySlug(data.category, ['title']) : data.category

  const author = nested && data?.author && (!fields || fields.length === 0 || fields.includes('author')) ? getAuthorBySlug(data.author, ['title', 'twitter', 'short_bio', 'image', 'content']) : data.author

  const tags: MarkdownFileObject[] = []

  if (nested && data.tags && data.tags.length > 0) {
    data.tags.forEach((tag: string) => tags.push(getTagBySlug(tag, ['title'])))
  } else if (data?.tags) {
    tags.push(...data.tags)
  }

  const theData: { [x: string]: any } = {
    ...data,
    slug: realSlug,
    author,
    category,
    tags,
    content: md.render(content),
  }

  if (fields !== undefined && fields.length) {
    const filteredData: { [x: string]: any } = { slug: realSlug }

    fields.forEach(field => {
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
    .sort((a, b) => (
      a.published_at > b.published_at ? -1 : 1
    ))

  return content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
