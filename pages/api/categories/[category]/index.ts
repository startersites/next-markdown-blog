import type { NextApiRequest, NextApiResponse } from 'next'

import { getCategoryBySlug } from '../.'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query?.category?.toString() as string
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getCategoryBySlug(slug, fields, true)
  res.status(200).json(content)
}
