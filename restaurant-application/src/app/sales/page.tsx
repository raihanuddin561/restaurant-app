'use client'

import { useState } from 'react'
import { Plus, DollarSign, TrendingUp, Calendar, Search, Filter, Eye, Download } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

// Mock sales data
const mockSales = [
  {
    id: '1',
    saleNumber: 'SAL001',
    date: new Date('2024-01-15T12:30:00'),
    customerName: 'John Doe',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 250 },
      { name: 'Soft Drink', quantity: 2, price: 25 }
    ],
    subtotal: 550,
    tax: 55,
    discount: 0,
    total: 605,
    paymentMethod: 'Cash',
    status: 'Completed',
    orderType: 'Dine In'
  },
  {
    id: '2',
    saleNumber: 'SAL002',
    date: new Date('2024-01-15T14:15:00'),
    customerName: 'Walk-in Customer',
    items: [
      { name: 'Beef Curry', quantity: 1, price: 180 },
      { name: 'Rice', quantity: 1, price: 40 },
      { name: 'Dal', quantity: 1, price: 60 }
    ],
    subtotal: 280,
    tax: 28,
    discount: 20,
    total: 288,
    paymentMethod: 'Card',
    status: 'Completed',
    orderType: 'Takeaway'
  },
  {
    id: '3',
    saleNumber: 'SAL003',
    date: new Date('2024-01-15T18:45:00'),
    customerName: 'Sarah Ahmed',
    items: [
      { name: 'Fish Curry', quantity: 1, price: 200 },
      { name: 'Rice', quantity: 1, price: 40 }
    ],
    subtotal: 240,
    tax: 24,
    discount: 0,
    total: 264,
    paymentMethod: 'Digital Wallet',
    status: 'Completed',
    orderType: 'Delivery'
  }
]

const dailyStats = {
  totalSales: 1157,
  totalOrders: 3,
  averageOrder: 386,
  cashSales: 605,
  cardSales: 288,
  digitalWalletSales: 264
}

export default function SalesPage() {
  const [sales, setSales] = useState(mockSales)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('Today')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const periods = ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom']
  const paymentMethods = ['All', 'Cash', 'Card', 'Digital Wallet']
  
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPayment = selectedPaymentMethod === 'All' || sale.paymentMethod === selectedPaymentMethod
    return matchesSearch && matchesPayment
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sales Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track daily sales and revenue performance
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Sale
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Total Sales Today</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(dailyStats.totalSales)}
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+12.5% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Orders Today</dt>
                <dd className="text-lg font-medium text-gray-900">{dailyStats.totalOrders}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Average Order</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(dailyStats.averageOrder)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Cash vs Digital</dt>
                <dd className="text-sm font-medium text-gray-900">
                  Cash: {formatCurrency(dailyStats.cashSales)}
                </dd>
                <dd className="text-xs text-gray-500">
                  Digital: {formatCurrency(dailyStats.cardSales + dailyStats.digitalWalletSales)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Cash</span>
                  <span className="text-sm text-gray-500">{formatCurrency(dailyStats.cashSales)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(dailyStats.cashSales / dailyStats.totalSales) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Card</span>
                  <span className="text-sm text-gray-500">{formatCurrency(dailyStats.cardSales)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(dailyStats.cardSales / dailyStats.totalSales) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Digital Wallet</span>
                  <span className="text-sm text-gray-500">{formatCurrency(dailyStats.digitalWalletSales)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(dailyStats.digitalWalletSales / dailyStats.totalSales) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Sales</h3>
              
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sales Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Sale Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{sale.saleNumber}</div>
                          <div className="text-sm text-gray-500">
                            {formatDateTime(sale.date)} • {sale.orderType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.customerName}</div>
                          <div className="text-sm text-gray-500">
                            {sale.items.length} item(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(sale.total)}
                          </div>
                          {sale.discount > 0 && (
                            <div className="text-sm text-red-600">
                              -{formatCurrency(sale.discount)} discount
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            sale.paymentMethod === 'Cash' 
                              ? 'bg-green-100 text-green-800'
                              : sale.paymentMethod === 'Card'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {sale.paymentMethod}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{sale.status}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
