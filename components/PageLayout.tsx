import PageHeader from 'components/PageHeader'

interface PageLayoutProps {
  title: string
  metaTitle?: string
  children?: React.ReactNode
}

export default function PageLayout({
  title,
  metaTitle,
  children,
}: PageLayoutProps) {
  return (
    <article>
      <PageHeader title={title} metaTitle={metaTitle} />
      {children}
    </article>
  )
}

