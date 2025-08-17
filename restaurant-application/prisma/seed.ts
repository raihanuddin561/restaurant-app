import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Royal Food database seeding...')

  // Create Partners
  const partner1 = await prisma.partner.create({
    data: {
      name: 'Partner A',
      sharePercent: 60.0,
      email: 'partnera@royalfood.com',
      phone: '+8801234567890',
      address: 'Dhaka, Bangladesh'
    }
  })

  const partner2 = await prisma.partner.create({
    data: {
      name: 'Partner B', 
      sharePercent: 40.0,
      email: 'partnerb@royalfood.com',
      phone: '+8801234567891',
      address: 'Dhaka, Bangladesh'
    }
  })

  console.log('✅ Partners created')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@royalfood.com',
      password: hashedPassword,
      name: 'Royal Food Admin',
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created')

  // Create Employee Users
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@royalfood.com',
      password: await bcrypt.hash('manager123', 12),
      name: 'Restaurant Manager',
      role: 'MANAGER'
    }
  })

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@royalfood.com',
      password: await bcrypt.hash('staff123', 12),
      name: 'Staff Member',
      role: 'EMPLOYEE'
    }
  })

  console.log('✅ Staff users created')

  // Create Employee Profiles
  await prisma.employee.create({
    data: {
      userId: managerUser.id,
      employeeId: 'RF001',
      position: 'Restaurant Manager',
      department: 'Management',
      salary: 50000,
      hireDate: new Date('2024-01-01')
    }
  })

  await prisma.employee.create({
    data: {
      userId: staffUser.id,
      employeeId: 'RF002',
      position: 'Server',
      department: 'Service',
      salary: 25000,
      hireDate: new Date('2024-03-15')
    }
  })

  console.log('✅ Employee profiles created')

  // Create Categories
  const appetizers = await prisma.category.create({
    data: {
      name: 'Appetizers',
      description: 'Starters and small plates'
    }
  })

  const mainCourse = await prisma.category.create({
    data: {
      name: 'Main Course',
      description: 'Main dishes and entrees'
    }
  })

  const beverages = await prisma.category.create({
    data: {
      name: 'Beverages',
      description: 'Drinks and beverages'
    }
  })

  const desserts = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Sweet treats and desserts'
    }
  })

  const ingredients = await prisma.category.create({
    data: {
      name: 'Ingredients',
      description: 'Raw materials and ingredients'
    }
  })

  console.log('✅ Categories created')

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Fresh Foods Ltd.',
      contactName: 'Mohammad Rahman',
      email: 'info@freshfoods.com.bd',
      phone: '+8802123456789',
      address: 'Karwan Bazar, Dhaka'
    }
  })

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Quality Meats & Fish',
      contactName: 'Ahmed Hassan',
      email: 'orders@qualitymeats.bd',
      phone: '+8802987654321',
      address: 'Gulshan, Dhaka'
    }
  })

  console.log('✅ Suppliers created')

  // Create Inventory Items
  const rice = await prisma.item.create({
    data: {
      name: 'Basmati Rice',
      categoryId: ingredients.id,
      supplierId: supplier1.id,
      sku: 'ING001',
      description: 'Premium basmati rice',
      unit: 'kg',
      costPrice: 120,
      reorderLevel: 10,
      currentStock: 25
    }
  })

  const chicken = await prisma.item.create({
    data: {
      name: 'Chicken Breast',
      categoryId: ingredients.id,
      supplierId: supplier2.id,
      sku: 'ING002',
      description: 'Fresh chicken breast',
      unit: 'kg',
      costPrice: 280,
      reorderLevel: 5,
      currentStock: 8
    }
  })

  const tomatoes = await prisma.item.create({
    data: {
      name: 'Fresh Tomatoes',
      categoryId: ingredients.id,
      supplierId: supplier1.id,
      sku: 'ING003',
      description: 'Fresh tomatoes',
      unit: 'kg',
      costPrice: 60,
      reorderLevel: 3,
      currentStock: 2
    }
  })

  const oil = await prisma.item.create({
    data: {
      name: 'Cooking Oil',
      categoryId: ingredients.id,
      supplierId: supplier1.id,
      sku: 'ING004',
      description: 'Refined cooking oil',
      unit: 'L',
      costPrice: 180,
      reorderLevel: 2,
      currentStock: 1
    }
  })

  console.log('✅ Inventory items created')

  // Create Menu Items
  const chickenBiryani = await prisma.menuItem.create({
    data: {
      name: 'Chicken Biryani',
      categoryId: mainCourse.id,
      description: 'Traditional Bengali chicken biryani with fragrant basmati rice',
      price: 450,
      costPrice: 180,
      prepTime: 45
    }
  })

  const mixedSalad = await prisma.menuItem.create({
    data: {
      name: 'Mixed Salad',
      categoryId: appetizers.id,
      description: 'Fresh mixed vegetables with house dressing',
      price: 150,
      costPrice: 45,
      prepTime: 10
    }
  })

  const mangoJuice = await prisma.menuItem.create({
    data: {
      name: 'Fresh Mango Juice',
      categoryId: beverages.id,
      description: 'Freshly squeezed mango juice',
      price: 120,
      costPrice: 35,
      prepTime: 5
    }
  })

  const kheer = await prisma.menuItem.create({
    data: {
      name: 'Rice Kheer',
      categoryId: desserts.id,
      description: 'Traditional rice pudding with milk and cardamom',
      price: 180,
      costPrice: 60,
      prepTime: 20
    }
  })

  console.log('✅ Menu items created')

  // Create Expense Categories
  await prisma.expenseCategory.createMany({
    data: [
      { name: 'Food & Ingredients', description: 'Food purchases and raw materials' },
      { name: 'Staff Salaries', description: 'Employee wages and benefits' },
      { name: 'Utilities', description: 'Electricity, gas, water bills' },
      { name: 'Rent & Lease', description: 'Restaurant rent and equipment lease' },
      { name: 'Marketing', description: 'Advertising and promotional expenses' },
      { name: 'Equipment', description: 'Kitchen equipment and maintenance' },
      { name: 'Supplies', description: 'Cleaning supplies, packaging, etc.' }
    ]
  })

  console.log('✅ Expense categories created')

  // Create Sample Orders and Sales for Dashboard Data
  const currentDate = new Date()
  const todayStart = new Date(currentDate.setHours(0, 0, 0, 0))
  
  // Create multiple orders for today
  for (let i = 1; i <= 15; i++) {
    const orderTime = new Date(todayStart.getTime() + Math.random() * 24 * 60 * 60 * 1000)
    
    const order = await prisma.order.create({
      data: {
        orderNumber: `RF${String(i).padStart(4, '0')}`,
        userId: managerUser.id,
        orderType: ['DINE_IN', 'TAKEAWAY', 'DELIVERY'][Math.floor(Math.random() * 3)] as any,
        status: ['COMPLETED', 'PREPARING', 'READY'][Math.floor(Math.random() * 3)] as any,
        tableNumber: Math.random() > 0.3 ? `T${Math.floor(Math.random() * 20) + 1}` : null,
        totalAmount: 0,
        finalAmount: 0,
        createdAt: orderTime,
        updatedAt: orderTime
      }
    })

    // Add random order items
    const menuItems = [chickenBiryani, mixedSalad, mangoJuice, kheer]
    const numItems = Math.floor(Math.random() * 3) + 1
    let orderTotal = 0

    for (let j = 0; j < numItems; j++) {
      const randomMenuItem = menuItems[Math.floor(Math.random() * menuItems.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const totalPrice = randomMenuItem.price * quantity
      orderTotal += totalPrice

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: randomMenuItem.id,
          quantity,
          unitPrice: randomMenuItem.price,
          totalPrice
        }
      })
    }

    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: {
        totalAmount: orderTotal,
        finalAmount: orderTotal
      }
    })

    // Create corresponding sale if order is completed
    if (['COMPLETED'].includes(order.status as string)) {
      await prisma.sale.create({
        data: {
          orderId: order.id,
          saleNumber: `S${String(i).padStart(4, '0')}`,
          userId: managerUser.id,
          saleDate: orderTime,
          totalAmount: orderTotal,
          finalAmount: orderTotal,
          paymentMethod: ['CASH', 'CARD', 'DIGITAL_WALLET'][Math.floor(Math.random() * 3)] as any
        }
      })
    }
  }

  console.log('✅ Sample orders and sales created')

  // Create some expenses for this month
  const expenseCategories = await prisma.expenseCategory.findMany()
  for (let i = 0; i < 10; i++) {
    const randomCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
    const expenseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), Math.floor(Math.random() * 28) + 1)
    
    await prisma.expense.create({
      data: {
        expenseCategoryId: randomCategory.id,
        description: `${randomCategory.name} expense`,
        amount: Math.floor(Math.random() * 10000) + 1000,
        expenseDate,
        status: 'APPROVED'
      }
    })
  }

  console.log('✅ Sample expenses created')

  console.log('🎉 Royal Food database seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@royalfood.com / admin123')
  console.log('Manager: manager@royalfood.com / manager123')
  console.log('Staff: staff@royalfood.com / staff123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
