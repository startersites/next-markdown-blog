import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { getPostsByCategory } from './[category]/posts'

import type { NextApiRequest, NextApiResponse } from 'next'

// const md = require('markdown-it')()

const categoriesDirectory = join(process.cwd(), '_content/categories')

export function getCategoryBySlug(slug: string, fields: string[] | undefined = undefined, nested = false) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(categoriesDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  const posts = nested && (!fields || fields.length === 0 || fields.includes('posts')) ? getPostsByCategory(realSlug, ['title', 'category', 'excerpt']) : undefined

  const theData: { [x: string]: any } = {
    ...data,
    posts,
    slug: realSlug,
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

export function getCategories(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(categoriesDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(categoriesDirectory)

  const content = slugs
    .map((slug) => getCategoryBySlug(slug, fields, true))
    .sort((a, b) => {
      if (a.title && b.title) {
        return a.title > b.title ? -1 : 1
      }

      return 0
    })

  return content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getCategories(fields)
  res.status(200).json(content)
}
