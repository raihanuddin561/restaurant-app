const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

// Create Prisma client with PostgreSQL (using current .env)
const postgresClient = new PrismaClient()

async function importDataToPostgreSQL() {
  try {
    console.log('📥 Importing data to PostgreSQL database...')
    
    // Read the backup data
    const data = JSON.parse(fs.readFileSync('./data-backup.json', 'utf8'))
    
    console.log('🔄 Starting data migration...')
    
    // Import in correct order to respect foreign keys
    
    // 1. Users (no dependencies)
    if (data.users.length > 0) {
      console.log(`   📝 Importing ${data.users.length} users...`)
      for (const user of data.users) {
        await postgresClient.user.create({
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          }
        })
      }
    }

    // 2. Partners (no dependencies)
    if (data.partners.length > 0) {
      console.log(`   🤝 Importing ${data.partners.length} partners...`)
      for (const partner of data.partners) {
        await postgresClient.partner.create({
          data: {
            id: partner.id,
            name: partner.name,
            sharePercent: partner.sharePercent,
            email: partner.email,
            phone: partner.phone,
            address: partner.address,
            isActive: partner.isActive,
            createdAt: new Date(partner.createdAt),
            updatedAt: new Date(partner.updatedAt)
          }
        })
      }
    }

    // 3. Categories (no dependencies)
    if (data.categories.length > 0) {
      console.log(`   📁 Importing ${data.categories.length} categories...`)
      for (const category of data.categories) {
        await postgresClient.category.create({
          data: {
            id: category.id,
            name: category.name,
            description: category.description,
            isActive: category.isActive,
            createdAt: new Date(category.createdAt),
            updatedAt: new Date(category.updatedAt)
          }
        })
      }
    }

    // 4. Suppliers (no dependencies)
    if (data.suppliers.length > 0) {
      console.log(`   🚚 Importing ${data.suppliers.length} suppliers...`)
      for (const supplier of data.suppliers) {
        await postgresClient.supplier.create({
          data: {
            id: supplier.id,
            name: supplier.name,
            contactName: supplier.contactName,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            isActive: supplier.isActive,
            createdAt: new Date(supplier.createdAt),
            updatedAt: new Date(supplier.updatedAt)
          }
        })
      }
    }

    // 5. Employees (depends on users)
    if (data.employees.length > 0) {
      console.log(`   👥 Importing ${data.employees.length} employees...`)
      for (const employee of data.employees) {
        await postgresClient.employee.create({
          data: {
            id: employee.id,
            userId: employee.userId,
            employeeId: employee.employeeId,
            position: employee.position,
            department: employee.department,
            salary: employee.salary,
            hireDate: new Date(employee.hireDate),
            isActive: employee.isActive,
            createdAt: new Date(employee.createdAt),
            updatedAt: new Date(employee.updatedAt)
          }
        })
      }
    }

    // 6. Items (depends on categories, suppliers)
    if (data.items.length > 0) {
      console.log(`   📦 Importing ${data.items.length} items...`)
      for (const item of data.items) {
        await postgresClient.item.create({
          data: {
            id: item.id,
            name: item.name,
            categoryId: item.categoryId,
            supplierId: item.supplierId,
            sku: item.sku,
            description: item.description,
            specification: item.specification,
            brand: item.brand,
            grade: item.grade,
            unit: item.unit,
            packSize: item.packSize,
            costPrice: item.costPrice,
            sellingPrice: item.sellingPrice,
            reorderLevel: item.reorderLevel,
            currentStock: item.currentStock,
            isActive: item.isActive,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt)
          }
        })
      }
    }

    // 7. Menu Items (depends on categories)
    if (data.menuItems.length > 0) {
      console.log(`   🍽️ Importing ${data.menuItems.length} menu items...`)
      for (const menuItem of data.menuItems) {
        await postgresClient.menuItem.create({
          data: {
            id: menuItem.id,
            name: menuItem.name,
            categoryId: menuItem.categoryId,
            description: menuItem.description,
            price: menuItem.price,
            costPrice: menuItem.costPrice,
            prepTime: menuItem.prepTime,
            isActive: menuItem.isActive,
            isAvailable: menuItem.isAvailable,
            createdAt: new Date(menuItem.createdAt),
            updatedAt: new Date(menuItem.updatedAt)
          }
        })
      }
    }

    // 8. Expense Categories (no dependencies)
    if (data.expenseCategories.length > 0) {
      console.log(`   💰 Importing ${data.expenseCategories.length} expense categories...`)
      for (const expenseCategory of data.expenseCategories) {
        await postgresClient.expenseCategory.create({
          data: {
            id: expenseCategory.id,
            name: expenseCategory.name,
            description: expenseCategory.description,
            isActive: expenseCategory.isActive,
            createdAt: new Date(expenseCategory.createdAt),
            updatedAt: new Date(expenseCategory.updatedAt)
          }
        })
      }
    }

    // 9. Orders (depends on users)
    if (data.orders.length > 0) {
      console.log(`   📋 Importing ${data.orders.length} orders...`)
      for (const order of data.orders) {
        await postgresClient.order.create({
          data: {
            id: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId,
            orderType: order.orderType,
            status: order.status,
            tableNumber: order.tableNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            totalAmount: order.totalAmount,
            discountAmount: order.discountAmount,
            finalAmount: order.finalAmount,
            notes: order.notes,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt)
          }
        })
      }
    }

    // 10. Order Items (depends on orders, menu items)
    if (data.orderItems.length > 0) {
      console.log(`   🍽️ Importing ${data.orderItems.length} order items...`)
      for (const orderItem of data.orderItems) {
        await postgresClient.orderItem.create({
          data: {
            id: orderItem.id,
            orderId: orderItem.orderId,
            menuItemId: orderItem.menuItemId,
            quantity: orderItem.quantity,
            unitPrice: orderItem.unitPrice,
            totalPrice: orderItem.totalPrice,
            specialInstructions: orderItem.specialInstructions,
            createdAt: new Date(orderItem.createdAt)
          }
        })
      }
    }

    // 11. Sales (depends on orders, users)
    if (data.sales.length > 0) {
      console.log(`   💳 Importing ${data.sales.length} sales...`)
      for (const sale of data.sales) {
        await postgresClient.sale.create({
          data: {
            id: sale.id,
            orderId: sale.orderId,
            saleNumber: sale.saleNumber,
            userId: sale.userId,
            saleDate: new Date(sale.saleDate),
            totalAmount: sale.totalAmount,
            discountAmount: sale.discountAmount,
            finalAmount: sale.finalAmount,
            paymentMethod: sale.paymentMethod,
            createdAt: new Date(sale.createdAt),
            updatedAt: new Date(sale.updatedAt)
          }
        })
      }
    }

    // 12. Expenses (depends on expense categories)
    if (data.expenses.length > 0) {
      console.log(`   💸 Importing ${data.expenses.length} expenses...`)
      for (const expense of data.expenses) {
        await postgresClient.expense.create({
          data: {
            id: expense.id,
            expenseCategoryId: expense.expenseCategoryId,
            description: expense.description,
            amount: expense.amount,
            expenseDate: new Date(expense.expenseDate),
            status: expense.status,
            receiptPath: expense.receiptPath,
            notes: expense.notes,
            createdAt: new Date(expense.createdAt),
            updatedAt: new Date(expense.updatedAt)
          }
        })
      }
    }

    // 13. Inventory Logs (depends on items, users) - if any
    if (data.inventoryLogs.length > 0) {
      console.log(`   📊 Importing ${data.inventoryLogs.length} inventory logs...`)
      for (const inventoryLog of data.inventoryLogs) {
        await postgresClient.inventoryLog.create({
          data: {
            id: inventoryLog.id,
            itemId: inventoryLog.itemId,
            userId: inventoryLog.userId,
            type: inventoryLog.type,
            quantity: inventoryLog.quantity,
            previousStock: inventoryLog.previousStock,
            newStock: inventoryLog.newStock,
            reason: inventoryLog.reason,
            reference: inventoryLog.reference,
            createdAt: new Date(inventoryLog.createdAt)
          }
        })
      }
    }

    console.log('✅ Data migration completed successfully!')
    console.log('🎉 Your Royal Food data has been transferred to PostgreSQL!')
    
  } catch (error) {
    console.error('❌ Import error:', error.message)
    console.error('Full error:', error)
  } finally {
    await postgresClient.$disconnect()
  }
}

importDataToPostgreSQL()
