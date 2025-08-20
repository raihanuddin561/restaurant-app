const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testExpenseSystem() {
  console.log('🧪 Testing expense system functionality...\n')

  try {
    // 1. Check if expense categories exist
    console.log('1. Checking expense categories...')
    const categories = await prisma.expenseCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { expenses: true }
        }
      }
    })

    if (categories.length === 0) {
      console.log('   ❌ No expense categories found! Creating default categories...')
      
      const defaultCategories = [
        { name: 'Employee Salaries', description: 'Monthly employee salary payments', type: 'PAYROLL' },
        { name: 'Inventory Purchases', description: 'Cost of goods sold and inventory purchases', type: 'STOCK' },
        { name: 'Utilities', description: 'Electricity, water, gas, and internet bills', type: 'UTILITIES' },
        { name: 'Property Rent', description: 'Monthly restaurant rent payments', type: 'RENT' },
        { name: 'Equipment Maintenance', description: 'Kitchen equipment repairs and maintenance', type: 'MAINTENANCE' },
        { name: 'Marketing & Advertising', description: 'Promotional activities and advertising costs', type: 'MARKETING' },
        { name: 'Business Insurance', description: 'Insurance premiums and coverage costs', type: 'INSURANCE' },
        { name: 'Government Taxes', description: 'Business taxes and government fees', type: 'TAXES' },
        { name: 'Office Supplies', description: 'Stationery, cleaning supplies, and office materials', type: 'OPERATIONAL' },
        { name: 'Transportation', description: 'Delivery costs and transportation expenses', type: 'OPERATIONAL' }
      ]

      for (const category of defaultCategories) {
        await prisma.expenseCategory.create({
          data: category
        })
      }
      console.log('   ✅ Created 10 default expense categories')
    } else {
      console.log(`   ✅ Found ${categories.length} expense categories`)
      categories.forEach(cat => {
        console.log(`      - ${cat.name} (${cat.type}) - ${cat._count.expenses} expenses`)
      })
    }

    // 2. Test expense creation
    console.log('\n2. Testing expense creation...')
    const testCategory = categories[0] || await prisma.expenseCategory.findFirst()
    
    if (testCategory) {
      const testExpense = await prisma.expense.create({
        data: {
          expenseCategoryId: testCategory.id,
          description: 'Test expense for system validation',
          amount: 100.50,
          expenseDate: new Date(),
          status: 'APPROVED',
          notes: 'Automated test expense'
        },
        include: {
          expenseCategory: true
        }
      })
      
      console.log(`   ✅ Created test expense: ${testExpense.description} - ৳${testExpense.amount}`)
    } else {
      console.log('   ❌ No categories available for testing')
    }

    // 3. Test expense analytics
    console.log('\n3. Testing expense analytics...')
    const expenseAnalytics = await prisma.expense.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: {
        status: 'APPROVED',
        expenseDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    console.log(`   ✅ Total expenses this month: ৳${expenseAnalytics._sum.amount || 0}`)
    console.log(`   ✅ Total expense count: ${expenseAnalytics._count.id}`)

    // 4. Test expenses by type
    console.log('\n4. Testing expense breakdown by type...')
    const expensesByType = await prisma.$queryRaw`
      SELECT 
        ec.type,
        COUNT(e.id)::INT as expense_count,
        SUM(e.amount)::FLOAT as total_amount
      FROM expenses e
      JOIN expense_categories ec ON e."expenseCategoryId" = ec.id
      WHERE e.status = 'APPROVED'
      GROUP BY ec.type
      ORDER BY total_amount DESC
    `

    if (Array.isArray(expensesByType) && expensesByType.length > 0) {
      expensesByType.forEach(type => {
        console.log(`   ✅ ${type.type}: ৳${type.total_amount} (${type.expense_count} expenses)`)
      })
    } else {
      console.log('   ℹ️  No expenses by type found yet')
    }

    console.log('\n🎉 Expense system test completed successfully!')

  } catch (error) {
    console.error('❌ Error testing expense system:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testExpenseSystem()
