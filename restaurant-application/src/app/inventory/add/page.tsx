import { Package, ArrowLeft, Plus, Save, AlertTriangle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { InventoryForm } from './components/InventoryForm'

// Get data for adding new items
async function getFormData() {
  try {
    const [categories, suppliers] = await Promise.all([
      prisma.category.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          name: 'asc'
        }
      }),
      
      prisma.supplier.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    ])

    return { categories, suppliers }
  } catch (error) {
    console.error('Form data fetch error:', error)
    return { categories: [], suppliers: [] }
  }
}

export default async function AddInventoryItemPage() {
  const { categories, suppliers } = await getFormData()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/inventory"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Inventory Item</h1>
          <p className="mt-2 text-gray-600">Create a new inventory item with complete cost and stock tracking</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Item Details</h2>
            </div>
          </div>
          
          <div className="p-6">
            <InventoryForm categories={categories} suppliers={suppliers} />
          </div>
        </div>

        {/* Quick Add Multiple Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Plus className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Add Multiple Items</h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Add Row
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">Add multiple items at once using the table below</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Initial Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reorder Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        placeholder="Item name..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                        <option value="">Category...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white">
                        <option value="">Unit...</option>
                        <option value="kg">kg</option>
                        <option value="L">L</option>
                        <option value="pcs">pcs</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                Clear All
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create All Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
