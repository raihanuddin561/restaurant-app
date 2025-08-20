import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDoubleCountingSalary() {
  try {
    console.log('🔍 Checking for Salary Double-Counting...')
    
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)
    
    // Get ALL expenses for today
    const allExpenses = await prisma.expense.findMany({
      where: {
        expenseDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        expenseCategory: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    console.log(`\n📊 ALL EXPENSES FOR TODAY (${allExpenses.length} records):`)
    
    let manualSalaryExpenses = []
    let autoSalaryExpenses = []
    let otherExpenses = []
    
    allExpenses.forEach((expense, index) => {
      console.log(`${index + 1}. [${expense.expenseCategory.type}] ${expense.description}: $${expense.amount.toFixed(2)}`)
      
      if (expense.expenseCategory.type === 'PAYROLL') {
        if (expense.description.includes('Daily salary allocation')) {
          autoSalaryExpenses.push(expense)
        } else {
          manualSalaryExpenses.push(expense)
        }
      } else {
        otherExpenses.push(expense)
      }
    })
    
    const manualTotal = manualSalaryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const autoTotal = autoSalaryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const otherTotal = otherExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    
    console.log(`\n💰 EXPENSE BREAKDOWN:`)
    console.log(`   Manual Salary Expenses: $${manualTotal.toFixed(2)} (${manualSalaryExpenses.length} records)`)
    console.log(`   Auto Daily Salary: $${autoTotal.toFixed(2)} (${autoSalaryExpenses.length} records)`)
    console.log(`   Other Expenses: $${otherTotal.toFixed(2)} (${otherExpenses.length} records)`)
    console.log(`   TOTAL: $${(manualTotal + autoTotal + otherTotal).toFixed(2)}`)
    
    if (manualTotal > 0 && autoTotal > 0) {
      console.log(`\n⚠️  WARNING: DOUBLE-COUNTING DETECTED!`)
      console.log(`   You have BOTH manual salary entries AND automatic salary allocation.`)
      console.log(`   Total salary being counted: $${(manualTotal + autoTotal).toFixed(2)}`)
      console.log(`   This is inflating your expense calculations!`)
      console.log(`\n🔧 SOLUTION:`)
      console.log(`   1. Delete manual salary expense entries`)
      console.log(`   2. Use only the automatic daily salary allocation system`)
      console.log(`   3. Or disable automatic salary recording if you prefer manual entry`)
    } else if (manualTotal > 0) {
      console.log(`\n📝 You are using MANUAL salary expense entry`)
      console.log(`   The automatic salary allocation system should be disabled.`)
    } else if (autoTotal > 0) {
      console.log(`\n🤖 You are using AUTOMATIC salary allocation`)
      console.log(`   This is the recommended approach for accurate daily costing.`)
    } else {
      console.log(`\n❌ No salary expenses found!`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDoubleCountingSalary()
