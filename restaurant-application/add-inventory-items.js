const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addInventoryItems() {
  try {
    // Get the first category to use
    const category = await prisma.category.findFirst();
    
    if (!category) {
      console.log('No category found. Please add categories first.');
      return;
    }

    const items = [
      {
        name: 'Rice',
        sku: 'RICE001',
        unit: 'kg',
        costPrice: 2.50,
        currentStock: 50,
        reorderLevel: 10,
        categoryId: category.id
      },
      {
        name: 'Onions',
        sku: 'ONION001',
        unit: 'kg',
        costPrice: 1.20,
        currentStock: 25,
        reorderLevel: 5,
        categoryId: category.id
      },
      {
        name: 'Tomatoes',
        sku: 'TOMATO001',
        unit: 'kg',
        costPrice: 3.00,
        currentStock: 20,
        reorderLevel: 5,
        categoryId: category.id
      },
      {
        name: 'Cooking Oil',
        sku: 'OIL001',
        unit: 'L',
        costPrice: 8.50,
        currentStock: 15,
        reorderLevel: 3,
        categoryId: category.id
      },
      {
        name: 'Salt',
        sku: 'SALT001',
        unit: 'kg',
        costPrice: 0.80,
        currentStock: 5,
        reorderLevel: 1,
        categoryId: category.id
      }
    ];

    for (const item of items) {
      try {
        const existingItem = await prisma.item.findFirst({
          where: { name: item.name }
        });
        
        if (!existingItem) {
          await prisma.item.create({
            data: item
          });
          console.log(`Added: ${item.name}`);
        } else {
          console.log(`Already exists: ${item.name}`);
        }
      } catch (error) {
        console.log(`Failed to add ${item.name}:`, error.message);
      }
    }

    console.log('\nInventory items added successfully!');
    
    // Show updated inventory
    const allItems = await prisma.item.findMany({
      where: { isActive: true },
      select: {
        name: true,
        currentStock: true,
        unit: true,
        costPrice: true
      }
    });
    
    console.log('\nCurrent inventory:');
    allItems.forEach(item => {
      console.log(`- ${item.name}: ${item.currentStock} ${item.unit} - $${item.costPrice.toFixed(2)}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addInventoryItems();
