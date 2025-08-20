const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStockUsage() {
  try {
    // Get first available item
    const item = await prisma.item.findFirst({
      where: {
        currentStock: {
          gt: 0
        }
      }
    });

    if (!item) {
      console.log('No items with stock found');
      return;
    }

    console.log('Testing stock usage with item:', item.name);
    console.log('Current stock:', item.currentStock, item.unit);

    // Test the record stock usage functionality
    const { recordStockUsage } = require('./src/app/actions/restaurant-operations.ts');
    
    const result = await recordStockUsage({
      itemId: item.id,
      quantity: 1,
      usageType: 'OTHER'
    });

    console.log('Result:', result);

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStockUsage();
