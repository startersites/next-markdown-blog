import Head from "next/head"
import { useRouter } from "next/router"
const blog = require('nmbs.config.json')

export default function MetaHead(props) {
  const router = useRouter()

  const metaTitle = props.title !== undefined
                  ? `${props.title}${blog.seo.sep}${blog.name}`
                  : `${blog.name}${blog.seo.sep}${blog.tagline}`

  const description = props.description !== undefined ? props.description : blog.tagline

  const type = props.type !== undefined ? props.type : 'website'

  const hostname = !process.env.URL ? 'http://localhost:3000' : process.env.URL
  const pathname = router.asPath

  const url = hostname + pathname

  const image = props.image ? props.image : hostname + '/images/social-card.png'

  const authorTwitter = props.authorTwitter !== undefined ? props.authorTwitter : blog.twitter

  return (
    <Head>
			<title>{metaTitle}</title>
			<meta name="title" content={metaTitle} />
			<meta property="og:title" content={metaTitle} />
			<meta name="twitter:title" content={metaTitle} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />

      <meta property="og:url" content={url} />
			<meta name="twitter:url" content={url} />

      <meta property='og:type' content={type} />

      <meta property='og:image' content={ image } />
      <meta property='og:image:secure_url' 	content={image} />
      <meta name='twitter:image' content={image} />

      <meta property="og:locale" content="en_US" />
			<meta property="og:image:type" content="image/png" />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaTitle} />
			<meta name="twitter:image:alt" content={metaTitle} />

      <meta name="twitter:creator" content={`@` + authorTwitter} />
			<meta name="twitter:site" content={blog.twitter} />
			<meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
