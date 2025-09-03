const { Client, Databases, ID } = require('node-appwrite');

// Use the same configuration as your MCP server
const client = new Client()
  .setEndpoint('http://31.97.229.201/v1')
  .setProject('68b5d113000306db095e')
  .setKey('standard_95534f235aeae5e9a71ab05fc7e647d128da7e4e0411d747c5e9d9e6f25c6b4132480f4f26bcb04479bbdaa3251f0ace77a8926b43a03df1e92d7cc9d15361222cf8c2481878c9b695c484aca0ed89556d84cdef25b3604220834e3391826cb785eb7b87dc5ad41de29f5e61b45370264d962619b3f83dff293df35a241ab342');

const databases = new Databases(client);
const DATABASE_ID = 'guzarishh-db';

const sampleCategories = [
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Elegant traditional sarees for every occasion',
    active: true,
    sortOrder: 1
  },
  {
    name: 'Lehengas',
    slug: 'lehengas',
    description: 'Stunning lehengas for weddings and festivals',
    active: true,
    sortOrder: 2
  },
  {
    name: 'Salwar Kameez',
    slug: 'salwar-kameez',
    description: 'Comfortable and stylish salwar suits',
    active: true,
    sortOrder: 3
  },
  {
    name: 'Kurtis',
    slug: 'kurtis',
    description: 'Modern kurtis for everyday wear',
    active: true,
    sortOrder: 4
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Beautiful accessories to complete your look',
    active: true,
    sortOrder: 5
  }
];

async function addSampleData() {
  try {
    console.log('🚀 Adding sample data to Guzarishh...');

    // Add categories
    console.log('📁 Adding categories...');
    const categoryIds = {};
    
    for (const category of sampleCategories) {
      try {
        const result = await databases.createDocument(
          DATABASE_ID,
          'categories',
          ID.unique(),
          category
        );
        categoryIds[category.slug] = result.$id;
        console.log(`✅ Added category: ${category.name}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Category already exists: ${category.name}`);
        } else {
          console.error(`❌ Error adding category ${category.name}:`, error.message);
        }
      }
    }

    // Add sample products
    console.log('🛍️  Adding sample products...');
    
    const sampleProducts = [
      {
        name: 'Royal Blue Silk Saree',
        slug: 'royal-blue-silk-saree',
        description: 'Exquisite royal blue silk saree with intricate golden embroidery. Perfect for weddings and special occasions. This stunning piece features traditional craftsmanship with modern elegance.',
        categoryId: categoryIds['sarees'] || '',
        price: 299.99,
        salePrice: 249.99,
        sku: 'SAR001',
        stock: 15,
        featured: true,
        active: true
      },
      {
        name: 'Pink Georgette Lehenga',
        slug: 'pink-georgette-lehenga',
        description: 'Beautiful pink georgette lehenga with heavy embellishments. Includes blouse and dupatta. Perfect for weddings and special celebrations.',
        categoryId: categoryIds['lehengas'] || '',
        price: 599.99,
        salePrice: 499.99,
        sku: 'LEH001',
        stock: 8,
        featured: true,
        active: true
      },
      {
        name: 'Cotton Anarkali Suit',
        slug: 'cotton-anarkali-suit',
        description: 'Comfortable cotton anarkali suit in vibrant colors. Perfect for daily wear and casual occasions. Made from premium cotton fabric.',
        categoryId: categoryIds['salwar-kameez'] || '',
        price: 89.99,
        sku: 'ANR001',
        stock: 25,
        featured: false,
        active: true
      },
      {
        name: 'Designer Kurti',
        slug: 'designer-kurti',
        description: 'Trendy designer kurti with modern prints. Ideal for office wear and casual outings. Available in multiple colors and sizes.',
        categoryId: categoryIds['kurtis'] || '',
        price: 45.99,
        sku: 'KUR001',
        stock: 30,
        featured: false,
        active: true
      },
      {
        name: 'Traditional Jewelry Set',
        slug: 'traditional-jewelry-set',
        description: 'Complete traditional jewelry set including necklace, earrings, and bangles. Gold-plated with artificial stones. Perfect for ethnic wear.',
        categoryId: categoryIds['accessories'] || '',
        price: 129.99,
        salePrice: 99.99,
        sku: 'JEW001',
        stock: 12,
        featured: true,
        active: true
      },
      {
        name: 'Maroon Velvet Lehenga',
        slug: 'maroon-velvet-lehenga',
        description: 'Luxurious maroon velvet lehenga with gold embroidery. Perfect for winter weddings and formal events.',
        categoryId: categoryIds['lehengas'] || '',
        price: 799.99,
        salePrice: 649.99,
        sku: 'LEH002',
        stock: 5,
        featured: true,
        active: true
      },
      {
        name: 'Printed Cotton Kurti',
        slug: 'printed-cotton-kurti',
        description: 'Comfortable printed cotton kurti for everyday wear. Features beautiful floral prints and comfortable fit.',
        categoryId: categoryIds['kurtis'] || '',
        price: 35.99,
        sku: 'KUR002',
        stock: 40,
        featured: false,
        active: true
      },
      {
        name: 'Green Silk Saree',
        slug: 'green-silk-saree',
        description: 'Elegant green silk saree with traditional border. Perfect for festivals and special occasions.',
        categoryId: categoryIds['sarees'] || '',
        price: 199.99,
        sku: 'SAR002',
        stock: 20,
        featured: false,
        active: true
      }
    ];

    for (const product of sampleProducts) {
      try {
        const result = await databases.createDocument(
          DATABASE_ID,
          'products',
          ID.unique(),
          product
        );
        console.log(`✅ Added product: ${product.name}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Product already exists: ${product.name}`);
        } else {
          console.error(`❌ Error adding product ${product.name}:`, error.message);
        }
      }
    }

    console.log('🎉 Sample data added successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Visit your website at http://localhost:3002');
    console.log('2. Register/login to test the application');
    console.log('3. Access the admin dashboard to manage products');
    console.log('4. Test the shopping cart and checkout process');
    
  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
  }
}

addSampleData();
