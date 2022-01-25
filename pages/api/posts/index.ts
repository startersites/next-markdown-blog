import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

import type { NextApiRequest, NextApiResponse } from 'next'

const md = require('markdown-it')()

export const postsDirectory = join(process.cwd(), '_content/posts')

export function getPostBySlug(slug: string, fields: string[] | undefined = undefined) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(postsDirectory, `${realSlug}.md`)

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

export function getPosts(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(postsDirectory)

  const content = slugs
    .map((slug) => getPostBySlug(slug, fields))
  // sort content by date in descending order
    .sort((a, b) => (
      a.published_at > b.published_at ? -1 : 1
    ))

  return content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const queryFields = req.query.fields.toString()

  const fields = []
  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPosts(fields)
  res.status(200).json(content)
}
