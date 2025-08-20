import Link from 'next/link'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  Settings,
  FileText,
  Clock,
  ChefHat,
  Calculator
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Financial Management', href: '/financial-management', icon: Calculator },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Menu', href: '/menu', icon: ChefHat },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Sales', href: '/sales', icon: DollarSign },
  { name: 'Expenses', href: '/expenses', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Partnership', href: '/partnership', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-4">
        <h1 className="text-xl font-bold text-white">Royal Food</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
