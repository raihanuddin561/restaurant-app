const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing Prisma connection and Item structure...')
    
    // Test items with full structure
    const items = await prisma.item.findMany({
      take: 1,
      include: {
        category: {
          select: {
            name: true
          }
        },
        supplier: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })
    
    console.log('Items found:', items.length)
    if (items.length > 0) {
      console.log('First item structure:', JSON.stringify(items[0], null, 2))
      console.log('Has unit field?', 'unit' in items[0])
    }
    
    console.log('✅ Prisma connection successful!')
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
