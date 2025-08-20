const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDailyCosts() {
  try {
    console.log('=== TESTING DAILY COSTS CALCULATION ===\n');

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    console.log(`Testing for date: ${today.toDateString()}`);
    console.log(`Start: ${startOfDay.toISOString()}`);
    console.log(`End: ${endOfDay.toISOString()}\n`);

    // Test employee costs query directly
    const employeeCosts = await prisma.expense.aggregate({
      where: {
        expenseDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        expenseCategory: {
          type: 'PAYROLL'
        },
        status: 'APPROVED'
      },
      _sum: {
        amount: true
      }
    });

    console.log('Employee Costs Query Result:', employeeCosts);

    // Test operational costs query
    const operationalCosts = await prisma.expense.groupBy({
      by: ['expenseCategoryId'],
      where: {
        expenseDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        expenseCategory: {
          type: {
            not: 'PAYROLL'
          }
        },
        status: 'APPROVED'
      },
      _sum: {
        amount: true
      }
    });

    console.log('Operational Costs Query Result:', operationalCosts);

    // Test sales
    const dailySales = await prisma.sale.aggregate({
      where: {
        saleDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      _sum: {
        totalAmount: true
      }
    });

    console.log('Daily Sales Query Result:', dailySales);

    // Calculate totals
    const totalEmployeeCosts = employeeCosts._sum.amount || 0;
    const totalOperationalCosts = operationalCosts.reduce((total, expense) => total + (expense._sum.amount || 0), 0);
    const totalSales = dailySales._sum.totalAmount || 0;
    const totalCosts = totalEmployeeCosts + totalOperationalCosts;
    const grossProfit = totalSales - totalCosts;

    console.log('\n=== CALCULATED RESULTS ===');
    console.log(`Total Sales: $${totalSales.toFixed(2)}`);
    console.log(`Employee Costs: $${totalEmployeeCosts.toFixed(2)}`);
    console.log(`Operational Costs: $${totalOperationalCosts.toFixed(2)}`);
    console.log(`Total Costs: $${totalCosts.toFixed(2)}`);
    console.log(`Gross Profit: $${grossProfit.toFixed(2)}`);

  } catch (error) {
    console.error('Error testing daily costs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDailyCosts();
