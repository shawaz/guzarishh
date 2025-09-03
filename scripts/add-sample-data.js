const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

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

const sampleProducts = [
  {
    name: 'Royal Blue Silk Saree',
    slug: 'royal-blue-silk-saree',
    description: 'Exquisite royal blue silk saree with intricate golden embroidery. Perfect for weddings and special occasions.',
    shortDescription: 'Royal blue silk saree with golden embroidery',
    price: 299.99,
    salePrice: 249.99,
    sku: 'SAR001',
    stock: 15,
    images: JSON.stringify([]),
    sizes: JSON.stringify(['Free Size']),
    colors: JSON.stringify(['Royal Blue']),
    tags: JSON.stringify(['silk', 'wedding', 'traditional', 'embroidery']),
    featured: true,
    active: true,
    weight: 0.8,
    material: '100% Pure Silk',
    careInstructions: 'Dry clean only. Store in a cool, dry place.'
  },
  {
    name: 'Pink Georgette Lehenga',
    slug: 'pink-georgette-lehenga',
    description: 'Beautiful pink georgette lehenga with heavy embellishments. Includes blouse and dupatta.',
    shortDescription: 'Pink georgette lehenga with embellishments',
    price: 599.99,
    salePrice: 499.99,
    sku: 'LEH001',
    stock: 8,
    images: JSON.stringify([]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Pink', 'Rose Gold']),
    tags: JSON.stringify(['georgette', 'wedding', 'lehenga', 'embellished']),
    featured: true,
    active: true,
    weight: 1.2,
    material: 'Georgette with Embellishments',
    careInstructions: 'Dry clean recommended. Handle with care.'
  },
  {
    name: 'Cotton Anarkali Suit',
    slug: 'cotton-anarkali-suit',
    description: 'Comfortable cotton anarkali suit in vibrant colors. Perfect for daily wear and casual occasions.',
    shortDescription: 'Cotton anarkali suit for daily wear',
    price: 89.99,
    sku: 'ANR001',
    stock: 25,
    images: JSON.stringify([]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Green', 'Blue', 'Orange']),
    tags: JSON.stringify(['cotton', 'anarkali', 'casual', 'comfortable']),
    featured: false,
    active: true,
    weight: 0.5,
    material: '100% Cotton',
    careInstructions: 'Machine wash cold. Tumble dry low.'
  },
  {
    name: 'Designer Kurti',
    slug: 'designer-kurti',
    description: 'Trendy designer kurti with modern prints. Ideal for office wear and casual outings.',
    shortDescription: 'Designer kurti with modern prints',
    price: 45.99,
    sku: 'KUR001',
    stock: 30,
    images: JSON.stringify([]),
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    colors: JSON.stringify(['Black', 'White', 'Navy']),
    tags: JSON.stringify(['kurti', 'designer', 'modern', 'office wear']),
    featured: false,
    active: true,
    weight: 0.3,
    material: 'Cotton Blend',
    careInstructions: 'Machine wash cold. Iron on medium heat.'
  },
  {
    name: 'Traditional Jewelry Set',
    slug: 'traditional-jewelry-set',
    description: 'Complete traditional jewelry set including necklace, earrings, and bangles. Gold-plated with artificial stones.',
    shortDescription: 'Traditional jewelry set with necklace and earrings',
    price: 129.99,
    salePrice: 99.99,
    sku: 'JEW001',
    stock: 12,
    images: JSON.stringify([]),
    sizes: JSON.stringify(['One Size']),
    colors: JSON.stringify(['Gold', 'Silver']),
    tags: JSON.stringify(['jewelry', 'traditional', 'necklace', 'earrings']),
    featured: true,
    active: true,
    weight: 0.2,
    material: 'Gold Plated with Artificial Stones',
    careInstructions: 'Keep away from water and perfume. Store in jewelry box.'
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
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Category already exists: ${category.name}`);
        } else {
          console.error(`❌ Error adding category ${category.name}:`, error.message);
        }
      }
    }

    // Add products
    console.log('🛍️  Adding products...');
    
    for (const product of sampleProducts) {
      try {
        // Assign category ID based on product type
        let categoryId = '';
        if (product.name.includes('Saree')) {
          categoryId = categoryIds['sarees'] || '';
        } else if (product.name.includes('Lehenga')) {
          categoryId = categoryIds['lehengas'] || '';
        } else if (product.name.includes('Suit') || product.name.includes('Anarkali')) {
          categoryId = categoryIds['salwar-kameez'] || '';
        } else if (product.name.includes('Kurti')) {
          categoryId = categoryIds['kurtis'] || '';
        } else if (product.name.includes('Jewelry')) {
          categoryId = categoryIds['accessories'] || '';
        }

        const productData = {
          ...product,
          categoryId
        };

        const result = await databases.createDocument(
          DATABASE_ID,
          'products',
          ID.unique(),
          productData
        );
        console.log(`✅ Added product: ${product.name}`);
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
    console.log('1. Visit your website to see the products');
    console.log('2. Create an admin account with email: admin@guzarishh.com');
    console.log('3. Access the admin dashboard to manage products');
    
  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
  }
}

addSampleData();
