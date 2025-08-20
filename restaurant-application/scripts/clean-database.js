const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 Starting database cleanup...')
  
  try {
    // Delete in reverse order of dependencies to avoid foreign key constraints
    console.log('Deleting financial reports...')
    await prisma.financialReport.deleteMany({})
    
    console.log('Deleting sales data...')
    await prisma.sale.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    
    console.log('Deleting menu data...')
    await prisma.menuItem.deleteMany({})
    
    console.log('Deleting expense data...')
    await prisma.expense.deleteMany({})
    await prisma.expenseCategory.deleteMany({})
    await prisma.purchaseItem.deleteMany({})
    await prisma.purchase.deleteMany({})
    
    console.log('Deleting attendance data...')
    await prisma.attendance.deleteMany({})
    await prisma.payroll.deleteMany({})
    
    console.log('Deleting employee data...')
    await prisma.employee.deleteMany({})
    
    console.log('Deleting inventory data...')
    await prisma.inventoryLog.deleteMany({})
    await prisma.item.deleteMany({})
    await prisma.supplier.deleteMany({})
    await prisma.category.deleteMany({})
    
    console.log('Deleting partnership data...')
    await prisma.profitShare.deleteMany({})
    await prisma.partner.deleteMany({})
    
    console.log('Deleting user data...')
    await prisma.user.deleteMany({})
    
    console.log('✅ Database cleaned successfully!')
    console.log('📊 All tables are now empty and ready for fresh data input.')
    
    // Initialize basic data that should always exist
    console.log('🔧 Initializing essential data...')
    
    // Create default categories for inventory
    const categories = [
      { name: 'Vegetables', description: 'Fresh vegetables and greens' },
      { name: 'Meat', description: 'Meat and poultry items' },
      { name: 'Fish', description: 'Fish and seafood' },
      { name: 'Rice & Grains', description: 'Rice, wheat, and other grains' },
      { name: 'Spices', description: 'Spices and seasonings' },
      { name: 'Oil & Condiments', description: 'Cooking oil and condiments' },
      { name: 'Dairy', description: 'Milk, cheese, and dairy products' },
      { name: 'Beverages', description: 'Drinks and beverages' },
      { name: 'Main Course', description: 'Main course menu items' },
      { name: 'Appetizers', description: 'Starter and appetizer items' },
      { name: 'Desserts', description: 'Sweet dishes and desserts' },
      { name: 'Drinks', description: 'Beverages and drinks' }
    ]
    
    for (const category of categories) {
      await prisma.category.create({ data: category })
    }
    
    // Create default expense categories
    const expenseCategories = [
      { name: 'Stock Purchase', type: 'STOCK', description: 'Inventory and raw material purchases' },
      { name: 'Employee Salary', type: 'PAYROLL', description: 'Employee salaries and wages' },
      { name: 'Electricity Bill', type: 'UTILITIES', description: 'Electricity and power costs' },
      { name: 'Water Bill', type: 'UTILITIES', description: 'Water and sewerage costs' },
      { name: 'Gas Bill', type: 'UTILITIES', description: 'Gas and fuel costs' },
      { name: 'Shop Rent', type: 'RENT', description: 'Monthly shop rent' },
      { name: 'Equipment Maintenance', type: 'MAINTENANCE', description: 'Kitchen and equipment maintenance' },
      { name: 'Marketing', type: 'MARKETING', description: 'Advertising and promotional expenses' },
      { name: 'Office Supplies', type: 'OPERATIONAL', description: 'Office and administrative supplies' },
      { name: 'Transportation', type: 'OPERATIONAL', description: 'Delivery and transportation costs' },
      { name: 'Insurance', type: 'INSURANCE', description: 'Business insurance premiums' },
      { name: 'Government Taxes', type: 'TAXES', description: 'Tax payments to government' },
      { name: 'Miscellaneous', type: 'OTHER', description: 'Other business expenses' }
    ]
    
    for (const category of expenseCategories) {
      await prisma.expenseCategory.create({ data: category })
    }
    
    console.log('✅ Essential data initialized!')
    console.log('🎯 Database is ready for fresh data input!')
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
