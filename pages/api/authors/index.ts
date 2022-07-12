import matter from 'gray-matter'
import md from 'markdown-it'
import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs'
import { join } from 'path'

import { getPostsByAuthor } from './[author]/posts'

const authorsDirectory = join(process.cwd(), '_content/authors')

export function getAuthorBySlug(
  slug: string,
  fields: string[] | undefined = undefined,
  nested = false
) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(authorsDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const posts =
    nested && (!fields || fields.length === 0 || fields.includes('posts'))
      ? getPostsByAuthor(
          realSlug,
          ['title', 'category', 'excerpt', 'thumbnail'],
          true
        )
      : undefined

  const theData: { [x: string]: unknown } = {
    ...data,
    slug: realSlug,
    posts,
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

export function getAuthors(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(authorsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(authorsDirectory)

  const content = slugs
    .map((slug) => getAuthorBySlug(slug, fields, true))
    .sort((a, b) => {
      if (
        a.title &&
        b.title &&
        typeof a.title === 'string' &&
        typeof b.title === 'string'
      ) {
        return a?.title > b?.title ? -1 : 1
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

  const content = getAuthors(fields)
  res.status(200).json(content)
}
