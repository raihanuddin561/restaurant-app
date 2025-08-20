const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMenuItems() {
  try {
    // Get the first category to use
    const category = await prisma.category.findFirst();
    
    if (!category) {
      console.log('No category found. Creating a default category...');
      const newCategory = await prisma.category.create({
        data: {
          name: 'Main Dishes',
          description: 'Main course items',
          isActive: true
        }
      });
      console.log('Created category: Main Dishes');
    }

    const categoryToUse = category || await prisma.category.findFirst();

    const menuItems = [
      {
        name: 'Chicken Curry',
        description: 'Spicy chicken curry with rice',
        price: 15.99,
        categoryId: categoryToUse.id,
        isAvailable: true
      },
      {
        name: 'Fried Rice',
        description: 'Vegetable fried rice',
        price: 12.99,
        categoryId: categoryToUse.id,
        isAvailable: true
      },
      {
        name: 'Chicken Biryani',
        description: 'Fragrant rice with chicken',
        price: 18.99,
        categoryId: categoryToUse.id,
        isAvailable: true
      },
      {
        name: 'Vegetable Curry',
        description: 'Mixed vegetable curry',
        price: 11.99,
        categoryId: categoryToUse.id,
        isAvailable: true
      }
    ];

    for (const item of menuItems) {
      try {
        const existingItem = await prisma.menuItem.findFirst({
          where: { name: item.name }
        });
        
        if (!existingItem) {
          await prisma.menuItem.create({
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

    console.log('\nMenu items added successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMenuItems();
