import Head from 'next/head'

import Footer from './Footer'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="startersites-app">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Header />
      <main>
        <div className="inner">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
