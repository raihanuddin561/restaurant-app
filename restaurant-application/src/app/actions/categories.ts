'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const isActive = formData.get('isActive') === 'on'

    if (!name) {
      throw new Error('Category name is required')
    }

    // Check if category already exists (case-insensitive check)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingCategory && existingCategory.name.toLowerCase() === name.trim().toLowerCase()) {
      throw new Error('A category with this name already exists')
    }

    // Create the category
    await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: isActive
      }
    })

    // Revalidate the pages that show categories
    revalidatePath('/inventory/categories')
    revalidatePath('/inventory/add')
    revalidatePath('/inventory')

    return { success: true, message: 'Category created successfully!' }
  } catch (error) {
    console.error('Create category error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create category' 
    }
  }
}

export async function updateCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const isActive = formData.get('isActive') === 'on'

    if (!id || !name) {
      throw new Error('Category ID and name are required')
    }

    // Check if another category has the same name (case-insensitive check)
    const allCategories = await prisma.category.findMany({
      where: {
        NOT: {
          id: id
        }
      },
      select: {
        name: true
      }
    })

    const existingCategory = allCategories.find(cat => 
      cat.name.toLowerCase() === name.trim().toLowerCase()
    )

    if (existingCategory) {
      throw new Error('A category with this name already exists')
    }

    // Update the category
    await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: isActive
      }
    })

    // Revalidate the pages that show categories
    revalidatePath('/inventory/categories')
    revalidatePath('/inventory/add')
    revalidatePath('/inventory')

    return { success: true, message: 'Category updated successfully!' }
  } catch (error) {
    console.error('Update category error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update category' 
    }
  }
}

export async function toggleCategoryStatus(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const currentStatus = formData.get('currentStatus') === 'true'

    if (!id) {
      throw new Error('Category ID is required')
    }

    // Toggle the category status
    await prisma.category.update({
      where: { id },
      data: {
        isActive: !currentStatus
      }
    })

    // Revalidate the pages that show categories
    revalidatePath('/inventory/categories')
    revalidatePath('/inventory/add')
    revalidatePath('/inventory')

    return { 
      success: true, 
      message: `Category ${!currentStatus ? 'activated' : 'deactivated'} successfully!` 
    }
  } catch (error) {
    console.error('Toggle category status error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to update category status' 
    }
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const id = formData.get('id') as string

    if (!id) {
      throw new Error('Category ID is required')
    }

    // Check if category has items
    const itemCount = await prisma.item.count({
      where: { categoryId: id }
    })

    if (itemCount > 0) {
      throw new Error('Cannot delete category that contains items. Please move or delete the items first.')
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    })

    // Revalidate the pages that show categories
    revalidatePath('/inventory/categories')
    revalidatePath('/inventory/add')
    revalidatePath('/inventory')

    return { success: true, message: 'Category deleted successfully!' }
  } catch (error) {
    console.error('Delete category error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete category' 
    }
  }
}
