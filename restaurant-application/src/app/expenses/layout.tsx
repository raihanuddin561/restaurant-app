import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expense Management | Royal Food',
  description: 'Comprehensive expense tracking and management system',
}

export default function ExpenseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
