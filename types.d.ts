interface MarkdownFileObject {
  title?: string
  slug?: string
  content?: string
  [x: string]: any
}

interface PostFileObject extends MarkdownFileObject {
  tags?: string[]
  publish_date?: string
}
