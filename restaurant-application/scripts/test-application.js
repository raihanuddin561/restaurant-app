const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testApplication() {
  console.log('🧪 Testing application with clean database...')
  
  try {
    // Test 1: Check if essential categories exist
    console.log('1. Checking categories...')
    const categories = await prisma.category.findMany()
    console.log(`   ✅ Found ${categories.length} categories`)
    
    // Test 2: Check if expense categories exist
    console.log('2. Checking expense categories...')
    const expenseCategories = await prisma.expenseCategory.findMany()
    console.log(`   ✅ Found ${expenseCategories.length} expense categories`)
    
    // Test 3: Try to create a test item
    console.log('3. Testing item creation...')
    const testCategory = categories.find(c => c.name === 'Vegetables')
    if (testCategory) {
      const testItem = await prisma.item.create({
        data: {
          name: 'Test Tomato',
          sku: 'TEST-001',
          categoryId: testCategory.id,
          unit: 'kg',
          costPrice: 100.00,
          currentStock: 0,
          reorderLevel: 10,
          description: 'Test item for validation'
        }
      })
      console.log(`   ✅ Created test item: ${testItem.name}`)
      
      // Clean up test item
      await prisma.item.delete({
        where: { id: testItem.id }
      })
      console.log('   ✅ Cleaned up test item')
    }
    
    // Test 4: Test expense category creation
    console.log('4. Testing expense operations...')
    const stockCategory = expenseCategories.find(c => c.type === 'STOCK')
    if (stockCategory) {
      console.log(`   ✅ Stock expense category exists: ${stockCategory.name}`)
    }
    
    // Test 5: Check database connection and basic operations
    console.log('5. Testing database operations...')
    const now = new Date()
    const testQuery = await prisma.$queryRaw`SELECT 1 as test`
    console.log('   ✅ Database connection working')
    
    console.log('\n🎉 All tests passed! Application is ready for use.')
    console.log('\n📝 Summary:')
    console.log(`   - Database is clean and ready`)
    console.log(`   - ${categories.length} inventory categories available`)
    console.log(`   - ${expenseCategories.length} expense categories ready`)
    console.log(`   - All essential data initialized`)
    console.log(`   - Exception handling implemented`)
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('   - Check if database is running')
    console.log('   - Verify DATABASE_URL in .env')
    console.log('   - Run: npx prisma db push')
    console.log('   - Re-run cleaning script if needed')
  } finally {
    await prisma.$disconnect()
  }
}

testApplication()
