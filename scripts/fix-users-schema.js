const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('http://31.97.229.201/v1')
  .setProject('68b5d113000306db095e')
  .setKey('standard_95534f235aeae5e9a71ab05fc7e647d128da7e4e0411d747c5e9d9e6f25c6b4132480f4f26bcb04479bbdaa3251f0ace77a8926b43a03df1e92d7cc9d15361222cf8c2481878c9b695c484aca0ed89556d84cdef25b3604220834e3391826cb785eb7b87dc5ad41de29f5e61b45370264d962619b3f83dff293df35a241ab342');

const databases = new Databases(client);
const DATABASE_ID = 'guzarishh-db';

async function fixUsersSchema() {
  try {
    console.log('🔧 Fixing users collection schema...');

    // Add missing attributes to users collection
    const attributesToAdd = [
      { key: 'address', type: 'string', size: 2000, required: false },
      { key: 'preferences', type: 'string', size: 1000, required: false },
      { key: 'lastLogin', type: 'datetime', required: false }
    ];

    for (const attr of attributesToAdd) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(DATABASE_ID, 'users', attr.key, attr.size, attr.required);
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(DATABASE_ID, 'users', attr.key, attr.required);
        }
        console.log(`✅ Added ${attr.key} attribute to users collection`);
        
        // Wait for attribute to be available
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  ${attr.key} attribute already exists`);
        } else {
          console.error(`❌ Error adding ${attr.key} attribute:`, error.message);
        }
      }
    }

    console.log('🎉 Users schema fixed!');
    
  } catch (error) {
    console.error('❌ Failed to fix users schema:', error);
  }
}

fixUsersSchema();
