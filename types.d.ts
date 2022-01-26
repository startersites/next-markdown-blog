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
  thumbnail: string
}

interface PostObject extends PostObjectBase {
  category: string
  tags: string[]
}

interface AuthorObjectBase extends MarkdownFileBase {
  image: string
  twitter: string
  short_bio: string
}

interface NestedPostObject extends PostObjectBase {
  author: AuthorObjectBase
  category: MarkdownFileBase
  tags: MarkdownFileBase[]
}

interface ObjectWithPosts extends MarkdownFileBase {
  posts: PostObject[]
}

interface ObjectWithCategory extends MarkdownFileBase {
  posts: NestedPostObject[]
}

interface AuthorObjectWithCategory extends AuthorObjectBase{
  posts: NestedPostObject[]
}

interface SearchResult extends NestedPostObject {
  type: 'author' | 'category' | 'post' | 'tag'
}
