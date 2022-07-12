import type { NextApiRequest, NextApiResponse } from 'next'

import { getAuthors } from './authors'
import { getCategories } from './categories'
import { getPosts } from './posts'
import { getTags } from './tags'

export function getSearch(fields: string[] | undefined = undefined) {
  const content: SearchResult[] = []

  function processData(
    func: (fields: string[] | undefined) => { [x: string]: unknown }[],
    type: 'author' | 'category' | 'post' | 'tag'
  ) {
    const getData = func(['title', 'category', 'excerpt'])

    for (let i = 0; i < getData.length; i++) {
      const element = getData[i]

      element['type'] = type

      content.push(element)
    }
  }

  if (!fields || fields.length === 0) {
    processData(getPosts, 'post')
    processData(getCategories, 'category')
    processData(getTags, 'tag')
    processData(getAuthors, 'author')
  } else {
    if (fields.includes('post')) processData(getPosts, 'post')
    if (fields.includes('category')) processData(getCategories, 'category')
    if (fields.includes('tag')) processData(getTags, 'tag')
    if (fields.includes('author')) processData(getAuthors, 'author')
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

  const queryFields = req.query?.fields?.toString().split(',')

  const content = getSearch(queryFields)

  res.status(200).json(content)
}
