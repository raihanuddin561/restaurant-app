const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Check if we have users
    const users = await prisma.user.findMany()
    console.log('👥 Users found:', users.length)
    
    if (users.length === 0) {
      console.log('❌ No users found - running seed...')
      // Import and run the seed
      const { execSync } = require('child_process')
      execSync('node -r tsx/cjs prisma/seed.ts', { stdio: 'inherit' })
    } else {
      console.log('✅ Users exist in database')
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`)
      })
    }
    
    // Check categories
    const categories = await prisma.category.findMany()
    console.log('📁 Categories found:', categories.length)
    
    if (categories.length === 0) {
      console.log('❌ No categories found - running seed...')
      const { execSync } = require('child_process')
      execSync('node -r tsx/cjs prisma/seed.ts', { stdio: 'inherit' })
    } else {
      console.log('✅ Categories exist in database')
      categories.forEach(cat => {
        console.log(`   - ${cat.name}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Database test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
