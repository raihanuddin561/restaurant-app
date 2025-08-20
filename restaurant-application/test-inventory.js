const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.item.count()
    console.log(`Total items in database: ${count}`)
    
    if (count === 0) {
      console.log('No items found. Need to add inventory items.')
      // Check if categories exist
      const categoryCount = await prisma.category.count()
      console.log(`Categories: ${categoryCount}`)
      
      if (categoryCount === 0) {
        console.log('Creating categories first...')
        await prisma.category.createMany({
          data: [
            { name: 'Ingredients' },
            { name: 'Beverages' },
            { name: 'Spices' }
          ]
        })
      }
      
      const category = await prisma.category.findFirst()
      console.log('Adding sample items...')
      
      await prisma.item.createMany({
        data: [
          { name: 'Rice', categoryId: category.id, unit: 'kg', costPrice: 100, sellingPrice: 120, currentStock: 50, minStock: 10 },
          { name: 'Chicken', categoryId: category.id, unit: 'kg', costPrice: 200, sellingPrice: 250, currentStock: 20, minStock: 5 },
          { name: 'Onions', categoryId: category.id, unit: 'kg', costPrice: 50, sellingPrice: 70, currentStock: 30, minStock: 5 }
        ]
      })
      console.log('Sample items added!')
    }
    
    const items = await prisma.item.findMany({
      take: 5,
      select: {
        name: true,
        currentStock: true,
        unit: true,
        costPrice: true
      }
    })
    console.log('First 5 items:')
    items.forEach(item => console.log(`- ${item.name}: ${item.currentStock} ${item.unit} @ $${item.costPrice}`))
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
