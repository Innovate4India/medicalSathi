import { notFound } from 'next/navigation'
import { DashboardPreview } from '@/components/dashboard-preview'

const roles = ['patient', 'doctor', 'hospital', 'donor', 'admin'] as const

type Role = (typeof roles)[number]

export function generateStaticParams() {
  return roles.map((role) => ({ role }))
}

export default async function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  if (!roles.includes(role as Role)) notFound()
  return <DashboardPreview role={role as Role} />
}
