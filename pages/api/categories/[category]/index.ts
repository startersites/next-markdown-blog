import { getCategoryBySlug } from '../.'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query.category.toString()
  const queryFields = req.query.fields.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getCategoryBySlug(slug, fields)
  res.status(200).json(content)
}
