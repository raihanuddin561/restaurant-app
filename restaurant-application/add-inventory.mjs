import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addInventoryItems() {
  try {
    console.log('Adding inventory items...')
    
    // Check if categories exist
    let categories = await prisma.category.findMany()
    
    if (categories.length === 0) {
      console.log('Creating categories...')
      await prisma.category.createMany({
        data: [
          { name: 'Ingredients' },
          { name: 'Vegetables' },
          { name: 'Meat & Poultry' },
          { name: 'Spices' }
        ]
      })
      categories = await prisma.category.findMany()
    }
    
    const ingredientCategory = categories[0]
    
    // Check if items exist
    const existingItems = await prisma.item.count()
    
    if (existingItems === 0) {
      console.log('Adding sample inventory items...')
      
      await prisma.item.createMany({
        data: [
          {
            name: 'Basmati Rice',
            categoryId: ingredientCategory.id,
            unit: 'kg',
            costPrice: 120,
            sellingPrice: 150,
            currentStock: 25,
            minStock: 5,
            isActive: true
          },
          {
            name: 'Chicken Breast',
            categoryId: ingredientCategory.id,
            unit: 'kg',
            costPrice: 280,
            sellingPrice: 350,
            currentStock: 15,
            minStock: 3,
            isActive: true
          },
          {
            name: 'Fresh Tomatoes',
            categoryId: ingredientCategory.id,
            unit: 'kg',
            costPrice: 60,
            sellingPrice: 80,
            currentStock: 12,
            minStock: 2,
            isActive: true
          },
          {
            name: 'Onions',
            categoryId: ingredientCategory.id,
            unit: 'kg',
            costPrice: 40,
            sellingPrice: 60,
            currentStock: 20,
            minStock: 3,
            isActive: true
          },
          {
            name: 'Cooking Oil',
            categoryId: ingredientCategory.id,
            unit: 'L',
            costPrice: 180,
            sellingPrice: 220,
            currentStock: 8,
            minStock: 2,
            isActive: true
          }
        ]
      })
      
      console.log('Sample inventory items added successfully!')
    }
    
    const items = await prisma.item.findMany({
      include: {
        category: true
      }
    })
    
    console.log(`Total items in database: ${items.length}`)
    items.forEach(item => {
      console.log(`- ${item.name}: ${item.currentStock} ${item.unit} @ $${item.costPrice} (${item.category.name})`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addInventoryItems()
