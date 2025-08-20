const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkExpenses() {
  try {
    console.log('=== CHECKING EXPENSE DATA ===\n');

    // Check expense categories
    const categories = await prisma.expenseCategory.findMany();
    console.log('Expense Categories:');
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.type}) - Active: ${cat.isActive}`);
    });

    // Check expenses
    const expenses = await prisma.expense.findMany({
      include: {
        expenseCategory: true
      },
      orderBy: {
        expenseDate: 'desc'
      }
    });

    console.log(`\nTotal Expenses: ${expenses.length}\n`);

    if (expenses.length > 0) {
      console.log('Recent Expenses:');
      expenses.slice(0, 10).forEach(expense => {
        console.log(`- ${expense.description}: $${expense.amount} (${expense.status}) - ${expense.expenseCategory?.name || 'No Category'} - ${expense.expenseDate.toDateString()}`);
      });

      // Check today's expenses
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const todayExpenses = expenses.filter(e => 
        e.expenseDate >= startOfDay && e.expenseDate <= endOfDay
      );

      console.log(`\nToday's Expenses (${today.toDateString()}): ${todayExpenses.length}`);
      todayExpenses.forEach(expense => {
        console.log(`- ${expense.description}: $${expense.amount} (${expense.status}) - ${expense.expenseCategory?.name}`);
      });

      // Check approved expenses
      const approvedExpenses = expenses.filter(e => e.status === 'APPROVED');
      console.log(`\nApproved Expenses: ${approvedExpenses.length}`);

      // Check payroll expenses
      const payrollExpenses = expenses.filter(e => 
        e.expenseCategory?.type === 'PAYROLL' && e.status === 'APPROVED'
      );
      console.log(`Payroll Expenses (APPROVED): ${payrollExpenses.length}`);
      
      const totalPayroll = payrollExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      console.log(`Total Payroll Amount: $${totalPayroll.toFixed(2)}`);

    } else {
      console.log('No expenses found in database.');
    }

    // Check if expense categories exist
    const payrollCategory = await prisma.expenseCategory.findFirst({
      where: { type: 'PAYROLL' }
    });

    if (!payrollCategory) {
      console.log('\n⚠️  WARNING: No PAYROLL category found!');
      console.log('This could be why salary expenses are not appearing in profit calculations.');
    }

  } catch (error) {
    console.error('Error checking expenses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExpenses();
