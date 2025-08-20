import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function FinancialManagementLayout({ children }: LayoutProps) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {children}
    </div>
  )
}
