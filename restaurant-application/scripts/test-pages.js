const pages = [
  'http://localhost:3000',
  'http://localhost:3000/dashboard',
  'http://localhost:3000/financial-management',
  'http://localhost:3000/inventory',
  'http://localhost:3000/inventory/add',
  'http://localhost:3000/expenses',
  'http://localhost:3000/sales',
  'http://localhost:3000/menu',
  'http://localhost:3000/employees'
];

async function testPages() {
  console.log('🧪 Testing key application pages...\n');
  
  for (const [index, url] of pages.entries()) {
    try {
      const response = await fetch(url);
      const status = response.status;
      const statusText = status === 200 ? '✅ OK' : `❌ ${response.status} ${response.statusText}`;
      const pageName = url.replace('http://localhost:3000', '') || '/';
      
      console.log(`${index + 1}. ${pageName.padEnd(20)} ${statusText}`);
      
      if (status !== 200) {
        const text = await response.text();
        console.log(`   Error details: ${text.slice(0, 200)}...\n`);
      }
    } catch (error) {
      console.log(`${index + 1}. ${url.replace('http://localhost:3000', '') || '/'} ❌ Connection Error: ${error.message}`);
    }
  }
  
  console.log('\n🎯 Page testing complete!');
}

// Run the test
testPages().catch(console.error);
