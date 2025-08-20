const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    console.log('All users in database:');
    console.log(JSON.stringify(users, null, 2));

    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    console.log('\nAdmin users found:');
    console.log(JSON.stringify(adminUsers, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUsers();
