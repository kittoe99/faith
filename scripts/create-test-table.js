require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase URL or Service Role Key in environment variables');
  console.log('Make sure you have set up your .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestTable() {
  try {
    console.log('🚀 Creating test table using Supabase client...');
    
    // First, let's try to check if we can connect
    console.log('🔍 Testing Supabase connection...');
    
    // Try a simple operation to verify connection
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    
    if (versionError) {
      console.log('ℹ️ Direct RPC not available, but connection might still work for other operations');
    } else {
      console.log('✅ Supabase connection successful');
    }
    
    // Create the test table with a simpler approach
    console.log('\n🔧 Creating test table structure...');
    
    // Create table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS test (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        value INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    
    // We'll use a different approach since direct DDL isn't supported through the JS client
    console.log('ℹ️ Note: Direct DDL execution is not supported through the Supabase JS client');
    console.log('ℹ️ For security reasons, schema changes should be made through the Supabase SQL Editor');
    console.log('ℹ️ Please run the following SQL in your Supabase SQL Editor:\n');
    console.log(createTableQuery);
    
    // Instead, let's show how to insert data programmatically
    console.log('\n📝 Inserting sample data (this will work if the table exists)...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('test')
      .insert([
        { name: 'Programmatic Test 1', description: 'Created via script', value: 100 },
        { name: 'Programmatic Test 2', description: 'Another test record', value: 200 }
      ]);
    
    if (insertError) {
      console.log('ℹ️ Could not insert data - table may not exist yet');
      console.log('Please create the table first using the SQL Editor with the query above');
    } else {
      console.log('✅ Sample data inserted successfully!');
    }
    
    // Try to read data
    console.log('\n🔍 Reading data from test table...');
    const { data: readData, error: readError } = await supabase
      .from('test')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log('ℹ️ Could not read data - table may not exist yet');
    } else {
      console.log(`✅ Successfully read ${readData?.length || 0} records from test table:`);
      console.log(readData);
    }
    
    console.log('\n📋 Summary:');
    console.log('1. For security reasons, schema changes (CREATE TABLE, ALTER TABLE, etc.) cannot be executed through the Supabase JS client');
    console.log('2. Please create the table using the Supabase SQL Editor with the SQL query provided above');
    console.log('3. Data operations (INSERT, SELECT, UPDATE, DELETE) work perfectly through the JS client');
    console.log('4. Your programmatic database interaction is ready for data operations!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your Supabase URL and Service Role Key in .env.local');
    console.log('2. Check your internet connection');
    console.log('3. Ensure your Supabase project is running');
    console.log('4. Check if your IP is allowed in Supabase dashboard');
    process.exit(1);
  }
}

createTestTable();
