const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Starting database cleanup...\n');

    // Delete data in correct order to avoid foreign key constraints
    console.log('Deleting transactional data...');
    
    // Delete stock usage records
    await prisma.stockUsage.deleteMany();
    console.log('✅ Stock usage records deleted');

    // Delete inventory logs
    await prisma.inventoryLog.deleteMany();
    console.log('✅ Inventory logs deleted');

    // Delete expenses
    await prisma.expense.deleteMany();
    console.log('✅ Expenses deleted');

    // Delete sales and related records
    await prisma.menuItemSale.deleteMany();
    await prisma.sale.deleteMany();
    console.log('✅ Sales records deleted');

    // Delete order items and orders
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    console.log('✅ Orders deleted');

    // Delete recipe items (no separate recipe model)
    await prisma.recipeItem.deleteMany();
    console.log('✅ Recipe items deleted');

    // Delete purchase items and purchases
    await prisma.purchaseItem.deleteMany();
    await prisma.purchase.deleteMany();
    console.log('✅ Purchases deleted');

    // Delete payroll records
    await prisma.payroll.deleteMany();
    console.log('✅ Payroll records deleted');

    // Delete attendance records
    await prisma.attendance.deleteMany();
    console.log('✅ Attendance records deleted');

    // Delete menu items
    await prisma.menuItem.deleteMany();
    console.log('✅ Menu items deleted');

    // Delete inventory items
    await prisma.item.deleteMany();
    console.log('✅ Inventory items deleted');

    // Delete suppliers
    await prisma.supplier.deleteMany();
    console.log('✅ Suppliers deleted');

    // Delete employees (except admin users)
    await prisma.employee.deleteMany();
    console.log('✅ Employees deleted');

    // Keep admin users but delete other users
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    await prisma.user.deleteMany({
      where: { 
        role: { not: 'ADMIN' }
      }
    });
    console.log('✅ Non-admin users deleted');

    // Reset categories but keep essential ones
    await prisma.category.deleteMany();
    await prisma.expenseCategory.deleteMany();
    console.log('✅ Categories deleted');

    console.log('\n🏗️  Creating essential data...\n');

    // Create default categories
    const defaultCategories = [
      { name: 'Vegetables', description: 'Fresh vegetables and produce', isActive: true },
      { name: 'Meat & Poultry', description: 'Meat, chicken, and seafood', isActive: true },
      { name: 'Grains & Rice', description: 'Rice, wheat, and grain products', isActive: true },
      { name: 'Dairy Products', description: 'Milk, cheese, and dairy items', isActive: true },
      { name: 'Spices & Seasonings', description: 'Spices, herbs, and seasonings', isActive: true },
      { name: 'Beverages', description: 'Drinks and beverage ingredients', isActive: true }
    ];

    for (const category of defaultCategories) {
      await prisma.category.create({ data: category });
    }
    console.log('✅ Default inventory categories created');

    // Create default expense categories
    const defaultExpenseCategories = [
      { name: 'Employee Salaries', description: 'Monthly employee salary payments', type: 'PAYROLL', isActive: true },
      { name: 'Inventory Purchases', description: 'Cost of goods and inventory purchases', type: 'STOCK', isActive: true },
      { name: 'Utilities', description: 'Electricity, water, gas bills', type: 'UTILITIES', isActive: true },
      { name: 'Property Rent', description: 'Monthly restaurant rent payments', type: 'RENT', isActive: true },
      { name: 'Equipment Maintenance', description: 'Kitchen equipment repairs', type: 'MAINTENANCE', isActive: true },
      { name: 'Marketing & Advertising', description: 'Promotional activities', type: 'MARKETING', isActive: true },
      { name: 'Business Insurance', description: 'Insurance premiums', type: 'INSURANCE', isActive: true },
      { name: 'Government Taxes', description: 'Business taxes and fees', type: 'TAXES', isActive: true },
      { name: 'Office Supplies', description: 'Stationery and office materials', type: 'OPERATIONAL', isActive: true },
      { name: 'Transportation', description: 'Delivery and transport costs', type: 'OPERATIONAL', isActive: true }
    ];

    for (const category of defaultExpenseCategories) {
      await prisma.expenseCategory.create({ data: category });
    }
    console.log('✅ Default expense categories created');

    // Show remaining admin users
    console.log('\n👤 Remaining admin users:');
    adminUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });

    console.log('\n✨ Database cleanup completed successfully!');
    console.log('\n📝 You can now add data through the application:');
    console.log('   • Inventory items at /inventory/add');
    console.log('   • Menu items at /menu/add');
    console.log('   • Suppliers at /suppliers');
    console.log('   • Employees at /employees');
    console.log('   • Daily expenses at /inventory/usage');
    console.log('   • Regular expenses at /expenses');

  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
