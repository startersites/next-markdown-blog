import PageHeader from 'components/PageHeader'

interface PageLayoutProps {
  title: string
  type?: string
  metaTitle?: string
  children?: React.ReactNode
}

export default function PageLayout({
  title,
  type,
  metaTitle,
  children,
}: PageLayoutProps) {
  return (
    <article className={type ? type : undefined}>
      <PageHeader title={title} metaTitle={metaTitle} />
      {children}
    </article>
  )
}
