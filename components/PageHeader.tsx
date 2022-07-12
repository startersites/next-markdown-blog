import MetaHead from 'components/MetaHead'

interface PageHeaderProps {
  title: string
  metaTitle?: string
}

export default function PageHeader({ title, metaTitle }: PageHeaderProps) {
  return (
    <header className="page-header">
      <MetaHead title={metaTitle || title} />
      <h1>{title}</h1>
    </header>
  )
}
