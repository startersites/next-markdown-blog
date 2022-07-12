import Footer from './Footer'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="startersites-app">
      <Header />
      <main>
        <div className="inner">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
