const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkInventoryItems() {
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        currentStock: true,
        unit: true,
        costPrice: true,
        isActive: true
      },
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Total items:', items.length);
    console.log('\nInventory items:');
    items.forEach(item => {
      console.log(`- ${item.name}: ${item.currentStock} ${item.unit} (${item.isActive ? 'Active' : 'Inactive'}) - $${item.costPrice}`);
    });

    const itemsWithStock = items.filter(item => item.currentStock > 0);
    console.log(`\nItems with stock: ${itemsWithStock.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInventoryItems();
