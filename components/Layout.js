import Header from 'components/Header'
import Footer from 'components/Footer'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}
