import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSalaryCosts() {
  try {
    console.log('🧪 Testing Salary Cost Integration...')
    
    // 1. Check if we have employees
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: { user: true }
    })
    
    console.log(`📋 Found ${employees.length} active employees:`)
    employees.forEach(emp => {
      console.log(`   - ${emp.user.name}: $${emp.salary}/month ($${(emp.salary/30).toFixed(2)}/day)`)
    })
    
    if (employees.length === 0) {
      console.log('❌ No employees found! Salary costs cannot be calculated.')
      console.log('   Add employees first at: http://localhost:3001/employees')
      return
    }
    
    // 2. Check if salary expenses exist for today
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)
    
    const salaryExpenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        expenseCategory: {
          type: 'PAYROLL'
        }
      },
      include: {
        expenseCategory: true
      }
    })
    
    console.log(`💰 Found ${salaryExpenses.length} salary expense records for today:`)
    let totalSalaryExpenses = 0
    salaryExpenses.forEach(expense => {
      console.log(`   - ${expense.description}: $${expense.amount}`)
      totalSalaryExpenses += expense.amount
    })
    
    console.log(`💰 Total salary expenses for today: $${totalSalaryExpenses.toFixed(2)}`)
    
    // 3. Calculate expected daily salary
    const expectedDailySalary = employees.reduce((total, emp) => total + (emp.salary / 30), 0)
    console.log(`🎯 Expected daily salary cost: $${expectedDailySalary.toFixed(2)}`)
    
    // 4. Check total expenses including salary
    const allExpenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: 'APPROVED'
      },
      include: {
        expenseCategory: true
      }
    })
    
    console.log(`📊 Total expenses for today: ${allExpenses.length} records`)
    let totalExpenses = 0
    allExpenses.forEach(expense => {
      console.log(`   - ${expense.expenseCategory.name}: $${expense.amount}`)
      totalExpenses += expense.amount
    })
    
    console.log(`💸 Total daily expenses (all categories): $${totalExpenses.toFixed(2)}`)
    
    // 5. Check sales for profit calculation
    const sales = await prisma.sale.findMany({
      where: {
        saleDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })
    
    const totalSales = sales.reduce((total, sale) => total + sale.totalAmount, 0)
    console.log(`💵 Total sales for today: $${totalSales.toFixed(2)}`)
    
    // 6. Calculate profit
    const profit = totalSales - totalExpenses
    const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0
    
    console.log(`\n📈 PROFIT CALCULATION:`)
    console.log(`   Revenue: $${totalSales.toFixed(2)}`)
    console.log(`   Total Expenses: $${totalExpenses.toFixed(2)}`)
    console.log(`   - Salary Expenses: $${totalSalaryExpenses.toFixed(2)}`)
    console.log(`   - Other Expenses: $${(totalExpenses - totalSalaryExpenses).toFixed(2)}`)
    console.log(`   Net Profit: $${profit.toFixed(2)} (${profitMargin.toFixed(1)}%)`)
    
    if (totalSalaryExpenses === 0) {
      console.log(`\n⚠️  WARNING: No salary expenses recorded!`)
      console.log(`   This means salary costs are NOT being included in profit calculations.`)
      console.log(`   Call the API to record salary expenses: http://localhost:3001/api/record-salary-expenses`)
    } else {
      console.log(`\n✅ SUCCESS: Salary costs are being included in profit calculations!`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testSalaryCosts()
