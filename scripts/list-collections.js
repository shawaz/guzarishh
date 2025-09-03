const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('http://31.97.229.201/v1')
  .setProject('68b5d113000306db095e')
  .setKey('standard_95534f235aeae5e9a71ab05fc7e647d128da7e4e0411d747c5e9d9e6f25c6b4132480f4f26bcb04479bbdaa3251f0ace77a8926b43a03df1e92d7cc9d15361222cf8c2481878c9b695c484aca0ed89556d84cdef25b3604220834e3391826cb785eb7b87dc5ad41de29f5e61b45370264d962619b3f83dff293df35a241ab342');

const databases = new Databases(client);
const DATABASE_ID = 'guzarishh-db';

async function listCollections() {
  try {
    console.log('📋 Listing all collections in database:', DATABASE_ID);
    
    const response = await databases.listCollections(DATABASE_ID);
    
    console.log('\n✅ Collections found:');
    console.log('Total collections:', response.total);
    
    response.collections.forEach((collection, index) => {
      console.log(`\n${index + 1}. ${collection.name}`);
      console.log(`   ID: ${collection.$id}`);
      console.log(`   Documents: ${collection.documentsCount || 0}`);
      console.log(`   Attributes: ${collection.attributes?.length || 0}`);
    });

    console.log('\n📝 Environment variables should be:');
    response.collections.forEach((collection) => {
      const envName = `NEXT_PUBLIC_${collection.name.toUpperCase().replace(/\s+/g, '_')}_COLLECTION_ID`;
      console.log(`${envName}=${collection.$id}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing collections:', error);
  }
}

listCollections();
