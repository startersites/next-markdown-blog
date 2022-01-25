import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

import type { NextApiRequest, NextApiResponse } from 'next'

const md = require('markdown-it')()

const authorsDirectory = join(process.cwd(), '_content/authors')

export function getAuthorBySlug(slug: string, fields: string[] | undefined = undefined) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(authorsDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  var theData: MarkdownFileObject = {}

  if (fields !== undefined && fields.length) {
    fields.forEach((field) => {
      if (field === 'slug') {
        theData[field] = realSlug
      }
      if (field === 'content') {
        theData[field] = md.render(content)
      }
      if (data[field]) {
        theData[field] = data[field]
      }
    })
  } else {
    theData = {slug: realSlug, ...data, content: md.render(content)}
  }

  return theData
}

export function getAuthors(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(authorsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(authorsDirectory)

  const content = slugs
    .map((slug) => getAuthorBySlug(slug, fields))
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

  const queryFields = req.query.fields.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getAuthors(fields)
  res.status(200).json(content)
}
