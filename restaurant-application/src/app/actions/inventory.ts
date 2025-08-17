'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createInventoryItem(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const sku = formData.get('sku') as string
    const categoryId = formData.get('categoryId') as string
    const supplierId = formData.get('supplierId') as string || null
    const unit = formData.get('unit') as string
    const costPrice = parseFloat(formData.get('costPrice') as string)
    const initialStock = parseFloat(formData.get('initialStock') as string)
    const reorderLevel = parseFloat(formData.get('reorderLevel') as string)
    const description = formData.get('description') as string || null
    const brand = formData.get('brand') as string || null
    const grade = formData.get('grade') as string || null
    const specification = formData.get('specification') as string || null
    const packSize = formData.get('packSize') as string || null

    // Validation
    if (!name || !categoryId || !unit || isNaN(costPrice) || isNaN(initialStock) || isNaN(reorderLevel)) {
      throw new Error('Required fields are missing or invalid')
    }

    if (costPrice <= 0) {
      throw new Error('Cost price must be greater than 0')
    }

    if (initialStock < 0 || reorderLevel < 0) {
      throw new Error('Stock quantities cannot be negative')
    }

    // Check if item with same name already exists
    const existingItem = await prisma.item.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingItem && existingItem.name.toLowerCase() === name.trim().toLowerCase()) {
      throw new Error('An item with this name already exists')
    }

    // Verify unit exists
    const validUnits = ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'box', 'bag', 'bottle', 'can']
    if (!validUnits.includes(unit)) {
      throw new Error('Invalid unit selected')
    }

    // Generate SKU if not provided
    let finalSku = sku?.trim()
    if (!finalSku) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true }
      })
      
      if (category) {
        const categoryPrefix = category.name.substring(0, 3).toUpperCase()
        const itemCount = await prisma.item.count({
          where: { categoryId }
        })
        finalSku = `${categoryPrefix}-${String(itemCount + 1).padStart(3, '0')}`
      } else {
        finalSku = `ITM-${String(Date.now()).slice(-6)}`
      }
    } else {
      // Check if SKU already exists
      const existingSku = await prisma.item.findFirst({
        where: { sku: finalSku }
      })
      
      if (existingSku) {
        throw new Error('An item with this SKU already exists')
      }
    }

    // Create the item
    const newItem = await prisma.item.create({
      data: {
        name: name.trim(),
        sku: finalSku,
        categoryId,
        supplierId,
        unit,
        costPrice,
        sellingPrice: costPrice * 1.3, // Default 30% markup
        currentStock: initialStock,
        reorderLevel,
        description,
        brand,
        grade,
        specification,
        packSize,
        isActive: true
      }
    })

    // Create initial inventory log for the stock
    if (initialStock > 0) {
      // Get the first admin user for the inventory log
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      })
      
      if (!adminUser) {
        throw new Error('No admin user found. Please run database seeding first.')
      }

      await prisma.inventoryLog.create({
        data: {
          itemId: newItem.id,
          userId: adminUser.id,
          type: 'STOCK_IN',
          quantity: initialStock,
          previousStock: 0,
          newStock: initialStock,
          reason: 'Initial stock entry',
          reference: `Initial-${newItem.sku}`
        }
      })
    }

    // Revalidate the pages that show items
    revalidatePath('/inventory')
    revalidatePath('/inventory/add')

    return { 
      success: true, 
      message: `Item "${name}" created successfully with SKU: ${finalSku}`,
      itemId: newItem.id,
      sku: finalSku
    }
  } catch (error) {
    console.error('Create inventory item error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create inventory item' 
    }
  }
}

export async function createBulkInventoryItems(formData: FormData) {
  try {
    const items = []
    const formEntries = Array.from(formData.entries())
    
    // Group form entries by item index
    const itemsData: Record<string, Record<string, string>> = {}
    
    formEntries.forEach(([key, value]) => {
      const match = key.match(/^item_(\d+)_(.+)$/)
      if (match) {
        const [, index, field] = match
        if (!itemsData[index]) itemsData[index] = {}
        itemsData[index][field] = value as string
      }
    })

    // Process each item
    for (const [index, itemData] of Object.entries(itemsData)) {
      if (!itemData.name || !itemData.categoryId || !itemData.unit || !itemData.costPrice || !itemData.initialStock || !itemData.reorderLevel) {
        continue // Skip incomplete items
      }

      const costPrice = parseFloat(itemData.costPrice)
      const initialStock = parseFloat(itemData.initialStock)
      const reorderLevel = parseFloat(itemData.reorderLevel)

      if (isNaN(costPrice) || isNaN(initialStock) || isNaN(reorderLevel)) {
        continue // Skip invalid items
      }

      // Generate SKU
      const category = await prisma.category.findUnique({
        where: { id: itemData.categoryId },
        select: { name: true }
      })
      
      let sku = ''
      if (category) {
        const categoryPrefix = category.name.substring(0, 3).toUpperCase()
        const itemCount = await prisma.item.count({
          where: { categoryId: itemData.categoryId }
        })
        sku = `${categoryPrefix}-${String(itemCount + items.length + 1).padStart(3, '0')}`
      }

      items.push({
        name: itemData.name.trim(),
        sku,
        categoryId: itemData.categoryId,
        unit: itemData.unit,
        costPrice,
        sellingPrice: costPrice * 1.3,
        currentStock: initialStock,
        reorderLevel,
        isActive: true
      })
    }

    if (items.length === 0) {
      throw new Error('No valid items to create')
    }

    // Create all items
    const createdItems = await prisma.item.createMany({
      data: items
    })

    // Get the created items to create inventory logs
    const newItems = await prisma.item.findMany({
      where: {
        sku: {
          in: items.map(item => item.sku)
        }
      }
    })

    // Get the first admin user for inventory logs
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      throw new Error('No admin user found. Please run database seeding first.')
    }

    // Create inventory logs for items with initial stock
    const inventoryLogs = newItems
      .filter(item => item.currentStock > 0)
      .map(item => ({
        itemId: item.id,
        userId: adminUser.id,
        type: 'STOCK_IN' as const,
        quantity: item.currentStock,
        previousStock: 0,
        newStock: item.currentStock,
        reason: 'Initial stock entry',
        reference: `Initial-${item.sku}`
      }))

    if (inventoryLogs.length > 0) {
      await prisma.inventoryLog.createMany({
        data: inventoryLogs
      })
    }

    // Revalidate pages
    revalidatePath('/inventory')
    revalidatePath('/inventory/add')

    return { 
      success: true, 
      message: `Successfully created ${createdItems.count} items`,
      count: createdItems.count
    }
  } catch (error) {
    console.error('Create bulk inventory items error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to create inventory items' 
    }
  }
}
