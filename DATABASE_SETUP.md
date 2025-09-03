# Guzarishh Database Setup Guide

## Manual Database Setup (Recommended)

Since there are version compatibility issues with the automated script, please follow these steps to set up your Appwrite database manually:

### 1. Access Appwrite Console
- Open your browser and go to: `http://31.97.229.201`
- Login with your Appwrite credentials
- Select your project: `68b5d113000306db095e`

### 2. Create Database
1. Go to "Databases" in the left sidebar
2. Click "Create Database"
3. Name: `guzarishh-db`
4. Database ID: `guzarishh-db`
5. Click "Create"

### 3. Create Collections

#### Collection 1: Categories
- **Collection ID**: `categories`
- **Name**: `Categories`
- **Permissions**: 
  - Read: `any`
  - Create/Update/Delete: `users`

**Attributes:**
- `name` (String, 100 chars, required)
- `slug` (String, 100 chars, required)
- `description` (String, 500 chars, optional)
- `image` (String, 255 chars, optional)
- `active` (Boolean, required, default: true)
- `sortOrder` (Integer, optional, default: 0)

#### Collection 2: Products
- **Collection ID**: `products`
- **Name**: `Products`
- **Permissions**: 
  - Read: `any`
  - Create/Update/Delete: `users`

**Attributes:**
- `name` (String, 200 chars, required)
- `slug` (String, 200 chars, required)
- `description` (String, 2000 chars, required)
- `shortDescription` (String, 500 chars, optional)
- `categoryId` (String, 50 chars, required)
- `price` (Float, required, min: 0)
- `salePrice` (Float, optional)
- `sku` (String, 100 chars, required)
- `stock` (Integer, required, min: 0)
- `images` (String, 2000 chars, optional) - JSON array
- `sizes` (String, 500 chars, optional) - JSON array
- `colors` (String, 500 chars, optional) - JSON array
- `tags` (String, 1000 chars, optional) - JSON array
- `featured` (Boolean, optional, default: false)
- `active` (Boolean, required, default: true)
- `weight` (Float, optional)
- `material` (String, 200 chars, optional)
- `careInstructions` (String, 1000 chars, optional)

#### Collection 3: Users (User Profiles)
- **Collection ID**: `users`
- **Name**: `User Profiles`
- **Permissions**: 
  - Read: `user:{userId}`
  - Create: `users`
  - Update/Delete: `user:{userId}`

**Attributes:**
- `name` (String, 100 chars, required)
- `email` (String, 255 chars, required)
- `phone` (String, 20 chars, optional)
- `address` (String, 2000 chars, optional) - JSON object
- `preferences` (String, 1000 chars, optional) - JSON object
- `role` (String, 20 chars, optional, default: "customer")
- `lastLogin` (DateTime, optional)

#### Collection 4: Cart
- **Collection ID**: `cart`
- **Name**: `Shopping Cart`
- **Permissions**: 
  - Read: `user:{userId}`
  - Create: `users`
  - Update/Delete: `user:{userId}`

**Attributes:**
- `userId` (String, 50 chars, required)
- `productId` (String, 50 chars, required)
- `quantity` (Integer, required, min: 1)
- `size` (String, 20 chars, optional)
- `color` (String, 50 chars, optional)
- `addedAt` (DateTime, required)

#### Collection 5: Orders
- **Collection ID**: `orders`
- **Name**: `Orders`
- **Permissions**: 
  - Read: `user:{userId}`
  - Create: `users`
  - Update/Delete: `users`

**Attributes:**
- `orderId` (String, 50 chars, required)
- `userId` (String, 50 chars, required)
- `items` (String, 5000 chars, required) - JSON array
- `shippingAddress` (String, 2000 chars, required) - JSON object
- `customerInfo` (String, 1000 chars, required) - JSON object
- `subtotal` (Float, required)
- `shipping` (Float, required)
- `tax` (Float, required)
- `total` (Float, required)
- `status` (String, 50 chars, required, default: "pending")
- `paymentStatus` (String, 50 chars, required, default: "pending")
- `paymentMethod` (String, 50 chars, optional)
- `paymentReference` (String, 100 chars, optional)
- `trackingNumber` (String, 100 chars, optional)
- `estimatedDelivery` (DateTime, optional)
- `notes` (String, 1000 chars, optional)

#### Collection 6: Reviews
- **Collection ID**: `reviews`
- **Name**: `Product Reviews`
- **Permissions**: 
  - Read: `any`
  - Create: `users`
  - Update/Delete: `user:{userId}`

**Attributes:**
- `productId` (String, 50 chars, required)
- `userId` (String, 50 chars, required)
- `userName` (String, 100 chars, required)
- `rating` (Integer, required, min: 1, max: 5)
- `title` (String, 200 chars, optional)
- `comment` (String, 2000 chars, required)
- `verified` (Boolean, optional, default: false)
- `approved` (Boolean, optional, default: false)

### 4. Create Storage Bucket
1. Go to "Storage" in the left sidebar
2. Click "Create Bucket"
3. **Bucket ID**: `product-images`
4. **Name**: `Product Images`
5. **Permissions**: 
   - Read: `any`
   - Create/Update/Delete: `users`

### 5. Add Sample Data
After creating the collections, you can add some sample categories and products:

#### Sample Categories:
1. **Sarees** (slug: sarees)
2. **Lehengas** (slug: lehengas)
3. **Salwar Kameez** (slug: salwar-kameez)
4. **Kurtis** (slug: kurtis)
5. **Accessories** (slug: accessories)

#### Sample Products:
1. **Royal Blue Silk Saree** - AED 249.99 (was 299.99)
2. **Pink Georgette Lehenga** - AED 499.99 (was 599.99)
3. **Cotton Anarkali Suit** - AED 89.99
4. **Designer Kurti** - AED 45.99
5. **Traditional Jewelry Set** - AED 99.99 (was 129.99)

### 6. Create Admin User
1. Register a new account with email: `admin@guzarishh.com`
2. After registration, go to the Users collection
3. Find your user profile and update the `role` field to `admin`

### 7. Test the Application
1. Visit your website at `http://localhost:3002`
2. Browse products and test the shopping cart
3. Login with your admin account to access the admin dashboard
4. Test the checkout process (payment will be in test mode)

## Environment Variables
Make sure your `.env.local` file has the correct values:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://31.97.229.201/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=68b5d113000306db095e
NEXT_PUBLIC_APPWRITE_DATABASE_ID=guzarishh-db
NEXT_PUBLIC_PRODUCTS_COLLECTION_ID=products
NEXT_PUBLIC_CATEGORIES_COLLECTION_ID=categories
NEXT_PUBLIC_ORDERS_COLLECTION_ID=orders
NEXT_PUBLIC_CART_COLLECTION_ID=cart
NEXT_PUBLIC_USERS_COLLECTION_ID=users
NEXT_PUBLIC_REVIEWS_COLLECTION_ID=reviews
NEXT_PUBLIC_APPWRITE_BUCKET_ID=product-images
```

## Troubleshooting
- If you get permission errors, make sure the collection permissions are set correctly
- If products don't load, check that the collection IDs match your environment variables
- For admin access issues, verify the user role is set to "admin" in the users collection

## Next Steps
1. Upload product images to the storage bucket
2. Configure Telr payment gateway with your credentials
3. Set up email notifications for orders
4. Add more products and categories
5. Customize the design and branding
