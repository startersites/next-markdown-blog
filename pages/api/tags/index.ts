import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

import type { NextApiRequest, NextApiResponse } from 'next'

const md = require('markdown-it')()

export const tagsDirectory = join(process.cwd(), '_content/tags')

export function getTagsBySlugs(slugs: string[], fields: string[] | undefined = undefined) {
  const tags: MarkdownFileObject[] = []

  if (slugs !== undefined && slugs.length) {
    slugs.forEach((slug) => {
      const tag = getTagBySlug(slug, fields)
      tags.push(tag)
    })
  }

  return tags
}

export function getTagBySlug(slug: string, fields: string[] | undefined = undefined) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(tagsDirectory, `${realSlug}.md`)

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

export function getTags(fields: string[] | undefined = undefined) {
  if (!fs.existsSync(tagsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(tagsDirectory)

  const content = slugs
    .map((slug) => getTagBySlug(slug, fields))
  // sort content by date in descending order
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

  const content = getTags(fields)
  res.status(200).json(content)
}
