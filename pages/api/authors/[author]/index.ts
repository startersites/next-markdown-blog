import type { NextApiRequest, NextApiResponse } from 'next'

import { getAuthorBySlug } from '../.'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query?.author?.toString() as string
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getAuthorBySlug(slug, fields, true)
  res.status(200).json(content)
}
