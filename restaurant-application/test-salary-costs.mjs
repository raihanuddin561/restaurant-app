import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestEmployees() {
  try {
    console.log('Adding test employees...')
    
    // Check if test users already exist
    let users = await prisma.user.findMany({
      where: {
        email: {
          in: ['john.chef@royalfood.com', 'mary.server@royalfood.com']
        }
      }
    })
    
    // Create test users only if they don't exist
    if (users.length === 0) {
      await prisma.user.createMany({
        data: [
          {
            name: 'John Chef',
            email: 'john.chef@royalfood.com',
            password: 'password123',
            role: 'EMPLOYEE'
          },
          {
            name: 'Mary Server',
            email: 'mary.server@royalfood.com',
            password: 'password123',
            role: 'EMPLOYEE'
          }
        ]
      })
      
      console.log('✅ Test users created')
      
      // Get the created users
      users = await prisma.user.findMany({
        where: {
          email: {
            in: ['john.chef@royalfood.com', 'mary.server@royalfood.com']
          }
        }
      })
    } else {
      console.log('✅ Test users already exist')
    }
    
    // Check if employees already exist
    const existingEmployees = await prisma.employee.count()
    
    if (existingEmployees === 0) {
      // Create employees
      const employees = await prisma.employee.createMany({
        data: [
          {
            userId: users[0].id,
            employeeId: 'EMP001',
            department: 'Kitchen',
            position: 'Head Chef',
            salary: 30000, // Monthly salary
            hireDate: new Date('2024-01-01'),
            isActive: true
          },
          {
            userId: users[1].id,
            employeeId: 'EMP002',
            department: 'Service',
            position: 'Server',
            salary: 20000, // Monthly salary
            hireDate: new Date('2024-01-01'),
            isActive: true
          }
        ]
      })
      
      console.log('✅ Test employees created')
    } else {
      console.log('✅ Employees already exist')
    }
    
    // Test salary expense recording
    const expensesModule = await import('./src/app/actions/expenses.ts')
    const today = new Date()
    console.log('🧪 Testing salary expense recording for today...')
    
    const result = await expensesModule.recordDailySalaryExpenses(today)
    console.log('Salary expense result:', result)
    
    // Test daily costs calculation
    const restaurantOpsModule = await import('./src/app/actions/restaurant-operations.ts')
    console.log('🧪 Testing daily costs calculation...')
    
    const costsResult = await restaurantOpsModule.getDailyCosts(today)
    console.log('Daily costs result:', costsResult)
    
    console.log('✅ Test completed!')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestEmployees()
