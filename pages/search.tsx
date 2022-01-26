import { useEffect, useRef, useState } from 'react'
import { getSearch } from 'pages/api/search'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import type { GetStaticProps } from 'next'

export default function Search({
  search,
}: {
  search: SearchResult[]
}) {
  const [searchValue, setSearchValue] = useState('')
  const [searchItems, setSearchItems] = useState(search)

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const value = searchValue.toLocaleLowerCase()

    const filteredItems = search.filter((item) => {
      if (item.title && item.title.toLocaleLowerCase().includes(value)) return true
      if (item.excerpt && item.excerpt.toLocaleLowerCase().includes(value)) return true
    })

    setSearchItems(filteredItems)
  }, [searchValue])

  return (
    <PageLayout title="Search">
      <input
        id="search"
        className="border border-gray-400 w-full max-w-md text-xl px-3 py-2 rounded-md font-sans"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        ref={inputRef}
        autoComplete="off"
      />
      <section className="feed-wrapper mt-8">
        {searchItems.map((search, i) => (
          <FeedItem
            key={i}
            title={`${search.title}`}
            link={`/${search.type === 'category' ? search.slug : search.type === 'post' ? `${search.category.slug}/${search.slug}` :`${search.type}s/${search.slug}`}`}
            excerpt={search.excerpt}
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
