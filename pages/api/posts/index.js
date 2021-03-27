import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
var md = require('markdown-it')()

export const postsDirectory = join(process.cwd(), '_content/posts')

export function getPostBySlug(slug, fields) {
  const realSlug = slug.replace(/\.md$/, '')

  const fullPath = join(postsDirectory, `${realSlug}.md`)

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  var theData = {}

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

export function getPosts(fields = []) {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const slugs = fs.readdirSync(postsDirectory)

  const content = slugs
    .map((slug) => getPostBySlug(slug, fields))
  // sort content by date in descending order
    .sort((content1, content2) => (
      content1.published_at > content2.published_at ? '-1' : '1'
    ))

  return content
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const queryFields = req.query.fields

  let fields
  if (queryFields) {
    fields = queryFields.split(',')
  } else {
    fields = []
  }

  const content = getPosts(fields)
  res.status(200).json(content)
}
