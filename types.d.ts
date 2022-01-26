type MarkdownFileObject = {
  title?: string
  slug?: string
  content?: string
  [x: string]: any
}

type MarkdownFileBase = {
  title: string
  slug: string
  content: string
}

interface PostObjectBase extends MarkdownFileBase {
  author: string
  published_at: string
  excerpt: string
}

interface PostObject extends PostObjectBase {
  category: string
  tags: string[]
}

interface NestedPostObject extends PostObjectBase {
  author: MarkdownFileBase
  category: MarkdownFileBase
  tags: MarkdownFileBase[]
}

interface ObjectWithPosts extends MarkdownFileBase {
  posts: PostObject[]
}

interface ObjectWithCategory extends MarkdownFileBase {
  posts: NestedPostObject[]
}

interface SearchResult extends NestedPostObject {
  type: 'author' | 'category' | 'post' | 'tag'
}
