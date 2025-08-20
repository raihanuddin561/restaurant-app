import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupManualSalaryEntries() {
  try {
    console.log('🧹 Cleaning up manual salary entries...')
    
    // Find all PAYROLL expenses that are NOT auto-generated
    const manualSalaryExpenses = await prisma.expense.findMany({
      where: {
        expenseCategory: {
          type: 'PAYROLL'
        },
        description: {
          not: {
            contains: 'Daily salary allocation'
          }
        }
      },
      include: {
        expenseCategory: true
      }
    })
    
    console.log(`Found ${manualSalaryExpenses.length} manual salary entries:`)
    manualSalaryExpenses.forEach(expense => {
      console.log(`   - ${expense.description}: $${expense.amount}`)
    })
    
    if (manualSalaryExpenses.length > 0) {
      // Delete manual salary entries
      const deletedCount = await prisma.expense.deleteMany({
        where: {
          expenseCategory: {
            type: 'PAYROLL'
          },
          description: {
            not: {
              contains: 'Daily salary allocation'
            }
          }
        }
      })
      
      console.log(`✅ Deleted ${deletedCount.count} manual salary entries`)
      console.log(`✅ Only automatic daily salary allocation will be used`)
    } else {
      console.log('✅ No manual salary entries found to clean up')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupManualSalaryEntries()
