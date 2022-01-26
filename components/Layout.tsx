import Header from './Header'
import Footer from './Footer'

export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <main className="flex-1 px-wrap py-12 text-lg">
        <div className="mx-auto max-w-3xl">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}