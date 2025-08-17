'use client'

import { Edit, Trash2 } from 'lucide-react'
import { toggleCategoryStatus, deleteCategory } from '@/app/actions/categories'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

interface Category {
  id: string
  name: string
  description: string | null
  isActive: boolean
  _count: {
    items: number
  }
}

interface CategoryActionsProps {
  category: Category
}

function StatusToggleButton({ category }: { category: Category }) {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center px-3 py-1 border text-sm font-medium rounded-lg transition-colors duration-200 ${
        category.isActive
          ? 'border-red-300 text-red-700 bg-white hover:bg-red-50 disabled:bg-red-100'
          : 'border-green-300 text-green-700 bg-white hover:bg-green-50 disabled:bg-green-100'
      }`}
    >
      {pending ? 'Updating...' : (category.isActive ? 'Deactivate' : 'Activate')}
    </button>
  )
}

function DeleteButton({ category }: { category: Category }) {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending || category._count.items > 0}
      className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors duration-200"
      title={category._count.items > 0 ? 'Cannot delete category with items' : 'Delete category'}
    >
      <Trash2 className="w-3 h-3 mr-1" />
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleToggleStatus(formData: FormData) {
    const result = await toggleCategoryStatus(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }

  async function handleDelete(formData: FormData) {
    if (!confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      return
    }

    const result = await deleteCategory(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div>
      {message && (
        <div className={`mb-2 p-2 rounded text-xs ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </button>
        
        {category._count.items === 0 && (
          <form action={handleDelete}>
            <input type="hidden" name="id" value={category.id} />
            <DeleteButton category={category} />
          </form>
        )}
        
        <form action={handleToggleStatus}>
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="currentStatus" value={category.isActive.toString()} />
          <StatusToggleButton category={category} />
        </form>
      </div>
    </div>
  )
}
