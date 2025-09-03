const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('http://31.97.229.201/v1')
  .setProject('68b5d113000306db095e')
  .setKey('standard_95534f235aeae5e9a71ab05fc7e647d128da7e4e0411d747c5e9d9e6f25c6b4132480f4f26bcb04479bbdaa3251f0ace77a8926b43a03df1e92d7cc9d15361222cf8c2481878c9b695c484aca0ed89556d84cdef25b3604220834e3391826cb785eb7b87dc5ad41de29f5e61b45370264d962619b3f83dff293df35a241ab342');

const databases = new Databases(client);
const DATABASE_ID = 'guzarishh-db';

async function fixPermissions() {
  try {
    console.log('🔧 Fixing collection permissions...');

    const collections = [
      {
        id: 'categories',
        name: 'Categories',
        readPermissions: ['read("any")'],
        writePermissions: ['create("any")', 'update("any")', 'delete("any")']
      },
      {
        id: 'products',
        name: 'Products',
        readPermissions: ['read("any")'],
        writePermissions: ['create("any")', 'update("any")', 'delete("any")']
      },
      {
        id: 'users',
        name: 'User Profiles',
        readPermissions: ['read("any")'],
        writePermissions: ['create("any")', 'update("any")', 'delete("any")']
      },
      {
        id: 'cart',
        name: 'Shopping Cart',
        readPermissions: ['read("any")'],
        writePermissions: ['create("any")', 'update("any")', 'delete("any")']
      },
      {
        id: 'orders',
        name: 'Orders',
        readPermissions: ['read("any")'],
        writePermissions: ['create("any")', 'update("any")', 'delete("any")']
      },
      {
        id: 'reviews',
        name: 'Product Reviews',
        readPermissions: ['read("any")'],
        writePermissions: ['create("any")', 'update("any")', 'delete("any")']
      }
    ];

    for (const collection of collections) {
      try {
        await databases.updateCollection(
          DATABASE_ID,
          collection.id,
          collection.name,
          collection.readPermissions,
          collection.writePermissions,
          false // documentSecurity
        );
        console.log(`✅ Updated permissions for ${collection.name}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error updating ${collection.name}:`, error.message);
      }
    }

    console.log('🎉 Permissions updated!');
    console.log('⚠️  Note: All collections now allow "any" user to read/write for testing.');
    console.log('🔒 In production, you should restrict these permissions properly.');
    
  } catch (error) {
    console.error('❌ Failed to fix permissions:', error);
  }
}

fixPermissions();
