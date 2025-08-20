const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true
      }
    })
    
    console.log('Users in database:', JSON.stringify(users, null, 2))
    
    const adminUsers = users.filter(user => user.role === 'ADMIN')
    console.log(`Found ${adminUsers.length} admin user(s)`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
