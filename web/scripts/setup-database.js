const { Client, Databases, Storage, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'guzarishh-db';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Guzarishh database...');

    // Create database
    try {
      await databases.create(DATABASE_ID, 'Guzarishh Database');
      console.log('✅ Database created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists');
      } else {
        throw error;
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
        console.log('⚠️  Storage bucket creation failed, continuing...');
      }
    }

    // Create Categories Collection
    try {
      await databases.createCollection(DATABASE_ID, 'categories', 'Categories', ['read("any")'], ['create("users")', 'update("users")', 'delete("users")']);
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'name', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'slug', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'description', 500, false);
      await databases.createStringAttribute(DATABASE_ID, 'categories', 'image', 255, false);
      await databases.createBooleanAttribute(DATABASE_ID, 'categories', 'active', true, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'categories', 'sortOrder', false, 0);
      
      console.log('✅ Categories collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Categories collection already exists');
      } else {
        console.error('❌ Error creating categories collection:', error);
      }
    }

    // Create Products Collection
    try {
      await databases.createCollection(DATABASE_ID, 'products', 'Products', ['read("any")'], ['create("users")', 'update("users")', 'delete("users")']);
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, 'products', 'name', 200, true);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'slug', 200, true);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'description', 2000, true);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'shortDescription', 500, false);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'categoryId', 50, true);
      await databases.createFloatAttribute(DATABASE_ID, 'products', 'price', true, 0);
      await databases.createFloatAttribute(DATABASE_ID, 'products', 'salePrice', false);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'sku', 100, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'products', 'stock', true, 0);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'images', 2000, false); // JSON array
      await databases.createStringAttribute(DATABASE_ID, 'products', 'sizes', 500, false); // JSON array
      await databases.createStringAttribute(DATABASE_ID, 'products', 'colors', 500, false); // JSON array
      await databases.createStringAttribute(DATABASE_ID, 'products', 'tags', 1000, false); // JSON array
      await databases.createBooleanAttribute(DATABASE_ID, 'products', 'featured', false, false);
      await databases.createBooleanAttribute(DATABASE_ID, 'products', 'active', true, true);
      await databases.createFloatAttribute(DATABASE_ID, 'products', 'weight', false);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'material', 200, false);
      await databases.createStringAttribute(DATABASE_ID, 'products', 'careInstructions', 1000, false);
      
      console.log('✅ Products collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Products collection already exists');
      } else {
        console.error('❌ Error creating products collection:', error);
      }
    }

    // Create Users Collection (for profiles)
    try {
      await databases.createCollection(DATABASE_ID, 'users', 'User Profiles', ['read("user:{userId}")'], ['create("users")', 'update("user:{userId}")', 'delete("user:{userId}")']);
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, 'users', 'name', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'users', 'email', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'users', 'phone', 20, false);
      await databases.createStringAttribute(DATABASE_ID, 'users', 'address', 2000, false); // JSON object
      await databases.createStringAttribute(DATABASE_ID, 'users', 'preferences', 1000, false); // JSON object
      await databases.createStringAttribute(DATABASE_ID, 'users', 'role', 20, false, 'customer');
      await databases.createDatetimeAttribute(DATABASE_ID, 'users', 'lastLogin', false);
      
      console.log('✅ Users collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Users collection already exists');
      } else {
        console.error('❌ Error creating users collection:', error);
      }
    }

    // Create Cart Collection
    try {
      await databases.createCollection(DATABASE_ID, 'cart', 'Shopping Cart', ['read("user:{userId}")'], ['create("users")', 'update("user:{userId}")', 'delete("user:{userId}")']);
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'userId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'productId', 50, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'cart', 'quantity', true, 1);
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'size', 20, false);
      await databases.createStringAttribute(DATABASE_ID, 'cart', 'color', 50, false);
      await databases.createDatetimeAttribute(DATABASE_ID, 'cart', 'addedAt', true);
      
      console.log('✅ Cart collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Cart collection already exists');
      } else {
        console.error('❌ Error creating cart collection:', error);
      }
    }

    // Create Orders Collection
    try {
      await databases.createCollection(DATABASE_ID, 'orders', 'Orders', ['read("user:{userId}")'], ['create("users")', 'update("users")', 'delete("users")']);
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'orderId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'userId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'items', 5000, true); // JSON array
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'shippingAddress', 2000, true); // JSON object
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'customerInfo', 1000, true); // JSON object
      await databases.createFloatAttribute(DATABASE_ID, 'orders', 'subtotal', true);
      await databases.createFloatAttribute(DATABASE_ID, 'orders', 'shipping', true);
      await databases.createFloatAttribute(DATABASE_ID, 'orders', 'tax', true);
      await databases.createFloatAttribute(DATABASE_ID, 'orders', 'total', true);
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'status', 50, true, 'pending');
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'paymentStatus', 50, true, 'pending');
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'paymentMethod', 50, false);
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'paymentReference', 100, false);
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'trackingNumber', 100, false);
      await databases.createDatetimeAttribute(DATABASE_ID, 'orders', 'estimatedDelivery', false);
      await databases.createStringAttribute(DATABASE_ID, 'orders', 'notes', 1000, false);
      
      console.log('✅ Orders collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Orders collection already exists');
      } else {
        console.error('❌ Error creating orders collection:', error);
      }
    }

    // Create Reviews Collection
    try {
      await databases.createCollection(DATABASE_ID, 'reviews', 'Product Reviews', ['read("any")'], ['create("users")', 'update("user:{userId}")', 'delete("user:{userId}")']);
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'productId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'userId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'userName', 100, true);
      await databases.createIntegerAttribute(DATABASE_ID, 'reviews', 'rating', true, 5, 1, 5);
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'title', 200, false);
      await databases.createStringAttribute(DATABASE_ID, 'reviews', 'comment', 2000, true);
      await databases.createBooleanAttribute(DATABASE_ID, 'reviews', 'verified', false, false);
      await databases.createBooleanAttribute(DATABASE_ID, 'reviews', 'approved', false, false);
      
      console.log('✅ Reviews collection created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Reviews collection already exists');
      } else {
        console.error('❌ Error creating reviews collection:', error);
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env.local file with the correct collection IDs');
    console.log('2. Create an admin user account');
    console.log('3. Add some sample products and categories');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

setupDatabase();
