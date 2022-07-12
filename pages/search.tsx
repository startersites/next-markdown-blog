import type { GetStaticProps } from 'next'
import { useEffect, useRef, useState } from 'react'

import FeedItem from 'components/FeedItem'
import PageLayout from 'components/PageLayout'
import { getSearch } from 'pages/api/search'

export default function Search({ search }: { search: SearchResult[] }) {
  const [searchValue, setSearchValue] = useState('')
  const [searchItems, setSearchItems] = useState(search)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const value = searchValue.toLocaleLowerCase()

    const filteredItems = search.filter((item) => {
      if (item.title && item.title.toLocaleLowerCase().includes(value))
        return true
      if (item.excerpt && item.excerpt.toLocaleLowerCase().includes(value))
        return true
    })

    setSearchItems(filteredItems)
  }, [search, searchValue])

  return (
    <PageLayout title="Search" type="search">
      <input
        id="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        ref={inputRef}
        autoComplete="off"
      />
      <section>
        {searchItems.map((search, i) => (
          <FeedItem
            key={i}
            title={`${search.title}`}
            link={`/${
              search.type === 'category'
                ? search.slug
                : search.type === 'post'
                ? `${search.category.slug}/${search.slug}`
                : `${search.type}s/${search.slug}`
            }`}
            excerpt={search.excerpt}
            image={search.thumbnail}
            type={search.type}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const search = getSearch()

  return {
    props: { search },
  }
}
