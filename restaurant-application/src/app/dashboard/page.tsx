import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react'

// Mock data - will be replaced with real database queries
const stats = [
  {
    name: 'Total Revenue Today',
    value: '$2,350',
    change: '+12.5%',
    changeType: 'increase' as const,
    icon: DollarSign,
  },
  {
    name: 'Orders Today',
    value: '47',
    change: '+8.2%',
    changeType: 'increase' as const,
    icon: ShoppingCart,
  },
  {
    name: 'Low Stock Items',
    value: '12',
    change: '+3',
    changeType: 'decrease' as const,
    icon: Package,
  },
  {
    name: 'Active Employees',
    value: '8',
    change: '0%',
    changeType: 'neutral' as const,
    icon: Users,
  },
]

const recentOrders = [
  { id: '#1234', customer: 'John Doe', amount: '$23.50', status: 'Completed', time: '2 min ago' },
  { id: '#1235', customer: 'Jane Smith', amount: '$45.75', status: 'Preparing', time: '5 min ago' },
  { id: '#1236', customer: 'Walk-in', amount: '$12.25', status: 'Ready', time: '8 min ago' },
  { id: '#1237', customer: 'Mike Johnson', amount: '$67.80', status: 'Confirmed', time: '12 min ago' },
]

const lowStockItems = [
  { name: 'Chicken Breast', current: 2.5, reorder: 5, unit: 'kg' },
  { name: 'Tomatoes', current: 1.2, reorder: 3, unit: 'kg' },
  { name: 'Rice', current: 8, reorder: 10, unit: 'kg' },
  { name: 'Cooking Oil', current: 0.5, reorder: 2, unit: 'L' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your restaurant operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div
                className={`flex items-center text-sm ${
                  stat.changeType === 'increase'
                    ? 'text-green-600'
                    : stat.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : stat.changeType === 'decrease' ? (
                  <TrendingDown className="mr-1 h-4 w-4" />
                ) : null}
                <span>{stat.change}</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">from yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Preparing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Ready'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">Low Stock Alert</h3>
            </div>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Reorder level: {item.reorder} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {item.current} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Summary */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Partnership Summary (This Month)</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$8,230</p>
              <p className="text-sm text-gray-500">Total Expenses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$4,220</p>
              <p className="text-sm text-gray-500">Net Profit</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">Partner 1 (60%)</p>
              <p className="text-lg font-bold text-blue-900">$2,532</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900">Partner 2 (40%)</p>
              <p className="text-lg font-bold text-green-900">$1,688</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
