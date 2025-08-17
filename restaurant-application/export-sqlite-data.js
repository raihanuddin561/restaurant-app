const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

// Create Prisma client with SQLite
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
})

async function exportSQLiteData() {
  try {
    console.log('📤 Exporting data from SQLite database...')
    
    // Export all data
    const data = {
      users: await sqliteClient.user.findMany(),
      partners: await sqliteClient.partner.findMany(),
      categories: await sqliteClient.category.findMany(),
      suppliers: await sqliteClient.supplier.findMany(),
      items: await sqliteClient.item.findMany(),
      inventoryLogs: await sqliteClient.inventoryLog.findMany(),
      employees: await sqliteClient.employee.findMany(),
      expenseCategories: await sqliteClient.expenseCategory.findMany(),
      menuItems: await sqliteClient.menuItem.findMany(),
      orders: await sqliteClient.order.findMany(),
      orderItems: await sqliteClient.orderItem.findMany(),
      sales: await sqliteClient.sale.findMany(),
      expenses: await sqliteClient.expense.findMany(),
    }

    // Save to JSON file
    fs.writeFileSync('./data-backup.json', JSON.stringify(data, null, 2))
    
    console.log('✅ Data exported to data-backup.json')
    console.log('📊 Data Summary:')
    console.log(`   - Users: ${data.users.length}`)
    console.log(`   - Partners: ${data.partners.length}`)
    console.log(`   - Categories: ${data.categories.length}`)
    console.log(`   - Suppliers: ${data.suppliers.length}`)
    console.log(`   - Items: ${data.items.length}`)
    console.log(`   - Inventory Logs: ${data.inventoryLogs.length}`)
    console.log(`   - Employees: ${data.employees.length}`)
    console.log(`   - Menu Items: ${data.menuItems.length}`)
    console.log(`   - Orders: ${data.orders.length}`)
    console.log(`   - Sales: ${data.sales.length}`)
    
  } catch (error) {
    console.error('❌ Export error:', error.message)
  } finally {
    await sqliteClient.$disconnect()
  }
}

exportSQLiteData()
