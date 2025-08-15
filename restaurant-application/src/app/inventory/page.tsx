'use client'

import { useState } from 'react'
import { Plus, Package, AlertTriangle, Search, Filter, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - will be replaced with database queries
const mockInventoryItems = [
  {
    id: '1',
    name: 'Chicken Breast',
    category: 'Meat',
    sku: 'MEAT001',
    currentStock: 15.5,
    reorderLevel: 5,
    unit: 'kg',
    costPrice: 280,
    sellingPrice: 350,
    supplier: 'Fresh Meat BD',
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Basmati Rice',
    category: 'Grains',
    sku: 'GRAIN001',
    currentStock: 25,
    reorderLevel: 10,
    unit: 'kg',
    costPrice: 65,
    sellingPrice: 75,
    supplier: 'Rice Traders',
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Tomatoes',
    category: 'Vegetables',
    sku: 'VEG001',
    currentStock: 3,
    reorderLevel: 5,
    unit: 'kg',
    costPrice: 40,
    sellingPrice: 60,
    supplier: 'Local Farmers',
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Cooking Oil',
    category: 'Ingredients',
    sku: 'ING001',
    currentStock: 8,
    reorderLevel: 3,
    unit: 'L',
    costPrice: 140,
    sellingPrice: 160,
    supplier: 'Oil Distributors',
    lastUpdated: new Date()
  }
]

export default function InventoryPage() {
  const [items, setItems] = useState(mockInventoryItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = ['All', 'Meat', 'Grains', 'Vegetables', 'Ingredients']
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockItems = items.filter(item => item.currentStock <= item.reorderLevel)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track stock levels and manage inventory items
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Total Items</dt>
                <dd className="text-lg font-medium text-gray-900">{items.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Low Stock Items</dt>
                <dd className="text-lg font-medium text-red-600">{lowStockItems.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Total Value</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0))}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {lowStockItems.length} item(s) running low on stock
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc space-y-1 pl-5">
                  {lowStockItems.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      <strong>{item.name}</strong>: Only {item.currentStock} {item.unit} remaining 
                      (Reorder at {item.reorderLevel} {item.unit})
                    </li>
                  ))}
                  {lowStockItems.length > 3 && (
                    <li>and {lowStockItems.length - 3} more...</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Item Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Pricing (BDT)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Supplier
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.category} • SKU: {item.sku}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.currentStock} {item.unit}
                  </div>
                  <div className={`text-sm ${
                    item.currentStock <= item.reorderLevel ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Reorder at: {item.reorderLevel} {item.unit}
                  </div>
                  {item.currentStock <= item.reorderLevel && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Low Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Cost: {formatCurrency(item.costPrice)}</div>
                  <div className="text-sm text-gray-500">Sale: {formatCurrency(item.sellingPrice)}</div>
                  <div className="text-xs text-green-600">
                    Margin: {formatCurrency(item.sellingPrice - item.costPrice)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first inventory item.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
