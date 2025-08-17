const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing Prisma connection...')
    
    // Test simple query
    const users = await prisma.user.findMany()
    console.log('Users found:', users.length)
    
    const items = await prisma.item.findMany()
    console.log('Items found:', items.length)
    
    console.log('✅ Prisma connection successful!')
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
