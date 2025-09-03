const { Client, Databases, Storage, ID } = require('node-appwrite');

// Use the same configuration as your MCP server
const client = new Client()
  .setEndpoint('http://31.97.229.201/v1')
  .setProject('68b5d113000306db095e')
  .setKey('standard_95534f235aeae5e9a71ab05fc7e647d128da7e4e0411d747c5e9d9e6f25c6b4132480f4f26bcb04479bbdaa3251f0ace77a8926b43a03df1e92d7cc9d15361222cf8c2481878c9b695c484aca0ed89556d84cdef25b3604220834e3391826cb785eb7b87dc5ad41de29f5e61b45370264d962619b3f83dff293df35a241ab342');

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'guzarishh-db';

async function createCollections() {
  try {
    console.log('🚀 Creating Guzarishh database and collections...');

    // Create database
    try {
      await databases.create(DATABASE_ID, 'Guzarishh Database');
      console.log('✅ Database created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists');
      } else {
        console.log('⚠️  Database creation issue:', error.message);
      }
    }

    // Create storage bucket
    try {
      await storage.createBucket('product-images', 'Product Images');
      console.log('✅ Storage bucket created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Storage bucket already exists');
      } else {
        console.log('⚠️  Storage bucket creation issue:', error.message);
      }
    }

    // Create Categories Collection
    try {
      await databases.createCollection(DATABASE_ID, 'categories', 'Categories');
      console.log('✅ Categories collection created');
      
      // Add attributes with delays to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'name', 100, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'slug', 100, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'description', 500, false);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createBooleanAttribute(DATABASE_ID, 'categories', 'active', false, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createIntegerAttribute(DATABASE_ID, 'categories', 'sortOrder', false, 0);
      
      console.log('✅ Categories attributes added');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Categories collection already exists');
      } else {
        console.log('⚠️  Categories collection issue:', error.message);
      }
    }

    // Create Products Collection
    try {
      await databases.createCollection(DATABASE_ID, 'products', 'Products');
      console.log('✅ Products collection created');
      
      // Add attributes with delays
      await new Promise(resolve => setTimeout(resolve, 1000));
      await databases.createStringAttribute(DATABASE_ID, 'products', 'name', 200, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'products', 'slug', 200, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'products', 'description', 2000, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'products', 'categoryId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createFloatAttribute(DATABASE_ID, 'products', 'price', true, 0);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createFloatAttribute(DATABASE_ID, 'products', 'salePrice', false);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'products', 'sku', 100, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createIntegerAttribute(DATABASE_ID, 'products', 'stock', true, 0);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createBooleanAttribute(DATABASE_ID, 'products', 'featured', false, false);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createBooleanAttribute(DATABASE_ID, 'products', 'active', false, true);
      
      console.log('✅ Products attributes added');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Products collection already exists');
      } else {
        console.log('⚠️  Products collection issue:', error.message);
      }
    }

    // Create Users Collection
    try {
      await databases.createCollection(DATABASE_ID, 'users', 'User Profiles');
      console.log('✅ Users collection created');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await databases.createStringAttribute(DATABASE_ID, 'users', 'name', 100, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'users', 'email', 255, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'users', 'phone', 20, false);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'users', 'role', 20, false, 'customer');
      
      console.log('✅ Users attributes added');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Users collection already exists');
      } else {
        console.log('⚠️  Users collection issue:', error.message);
      }
    }

    // Create Cart Collection
    try {
      await databases.createCollection(DATABASE_ID, 'cart', 'Shopping Cart');
      console.log('✅ Cart collection created');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'userId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'productId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createIntegerAttribute(DATABASE_ID, 'cart', 'quantity', true, 1);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'size', 20, false);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'color', 50, false);
      
      console.log('✅ Cart attributes added');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Cart collection already exists');
      } else {
        console.log('⚠️  Cart collection issue:', error.message);
      }
    }

    // Create Orders Collection
    try {
      await databases.createCollection(DATABASE_ID, 'orders', 'Orders');
      console.log('✅ Orders collection created');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'orderId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'userId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'items', 5000, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createFloatAttribute(DATABASE_ID, 'orders', 'total', true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'status', 50, false, 'pending');
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'paymentStatus', 50, false, 'pending');
      
      console.log('✅ Orders attributes added');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Orders collection already exists');
      } else {
        console.log('⚠️  Orders collection issue:', error.message);
      }
    }

    // Create Reviews Collection
    try {
      await databases.createCollection(DATABASE_ID, 'reviews', 'Product Reviews');
      console.log('✅ Reviews collection created');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'productId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'userId', 50, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'userName', 100, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createIntegerAttribute(DATABASE_ID, 'reviews', 'rating', true, 5, 1, 5);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'comment', 2000, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      await databases.createBooleanAttribute(DATABASE_ID, 'reviews', 'approved', false, false);
      
      console.log('✅ Reviews attributes added');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Reviews collection already exists');
      } else {
        console.log('⚠️  Reviews collection issue:', error.message);
      }
    }

    console.log('🎉 Database setup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Your collections are now ready');
    console.log('2. Login to your website to test admin access');
    console.log('3. Add some sample products through the admin dashboard');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

createCollections();
