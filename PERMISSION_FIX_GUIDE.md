# 🔧 Permission Fix Guide for Guzarishh

## Issues Identified:
1. ✅ **Authentication Fixed** - Login/Register now works
2. ❌ **Permission Errors** - Collections need proper read/write permissions
3. ❌ **Missing Attributes** - Some collection attributes are missing
4. ❌ **User Profile Creation** - User profiles not being created properly

## 🚀 Quick Fix (Manual Steps):

### Step 1: Fix Collection Permissions
1. **Open Appwrite Console**: Go to `http://31.97.229.201`
2. **Login** with your Appwrite credentials
3. **Select Project**: `68b5d113000306db095e`
4. **Go to Databases** → `guzarishh-db`

For **EACH** collection (categories, products, users, cart, orders, reviews):

1. **Click on the collection name**
2. **Go to "Settings" tab**
3. **Scroll to "Permissions" section**
4. **Update permissions as follows**:

   **Read Permissions:**
   - Add: `any`
   
   **Write Permissions:**
   - Add: `any`

5. **Click "Update"**

### Step 2: Add Missing Attributes

#### For Cart Collection:
1. **Go to cart collection**
2. **Click "Attributes" tab**
3. **Add new attribute**:
   - **Key**: `addedAt`
   - **Type**: DateTime
   - **Required**: Yes
   - **Default**: Current timestamp

#### For Products Collection (if missing):
Add these attributes if they don't exist:
- `images` (String, 2000 chars, optional)
- `sizes` (String, 500 chars, optional) 
- `colors` (String, 500 chars, optional)
- `tags` (String, 1000 chars, optional)
- `shortDescription` (String, 500 chars, optional)
- `material` (String, 200 chars, optional)
- `careInstructions` (String, 1000 chars, optional)
- `weight` (Float, optional)

### Step 3: Test the Application

After fixing permissions:

1. **Refresh your website**: `http://localhost:3002`
2. **Try to login** with your account
3. **Check if products load** on the homepage
4. **Test adding items to cart**
5. **Access admin dashboard** at `/admin`

## 🔍 Alternative: Automated Permission Fix

If manual steps don't work, try this automated approach:

### Option A: Use Appwrite Console API
1. **Go to Appwrite Console**
2. **Open browser developer tools** (F12)
3. **Go to Console tab**
4. **Run this JavaScript code**:

```javascript
// This will update all collection permissions
const collections = ['categories', 'products', 'users', 'cart', 'orders', 'reviews'];

collections.forEach(async (collectionId) => {
  try {
    const response = await fetch(`http://31.97.229.201/v1/databases/guzarishh-db/collections/${collectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': '68b5d113000306db095e',
        'X-Appwrite-Key': 'your-api-key-here'
      },
      body: JSON.stringify({
        name: collectionId.charAt(0).toUpperCase() + collectionId.slice(1),
        permissions: {
          read: ['any'],
          write: ['any']
        }
      })
    });
    console.log(`Updated ${collectionId}:`, response.status);
  } catch (error) {
    console.error(`Error updating ${collectionId}:`, error);
  }
});
```

### Option B: Recreate Collections
If permissions still don't work:

1. **Delete all collections** in Appwrite console
2. **Run the setup script again**:
   ```bash
   node scripts/create-collections-mcp.js
   ```
3. **Add sample data**:
   ```bash
   node scripts/add-sample-data-mcp.js
   ```

## 🎯 Expected Results After Fix:

### ✅ What Should Work:
- **Homepage loads** with products and categories
- **User can login/register** without errors
- **Products display** in the featured section
- **Shopping cart works** (add/remove items)
- **Admin dashboard accessible** at `/admin`
- **No console errors** related to permissions

### 🔍 How to Verify:
1. **Check browser console** - should see no permission errors
2. **Homepage shows products** - not empty state
3. **Cart icon shows count** when items added
4. **Admin button appears** after login
5. **Debug page** (`/admin-test`) shows admin access granted

## 🚨 If Still Having Issues:

### Check These:
1. **Appwrite server is running** - `http://31.97.229.201`
2. **Project ID is correct** - `68b5d113000306db095e`
3. **Database exists** - `guzarishh-db`
4. **Collections exist** - all 6 collections created
5. **Permissions are set** - `any` for read and write

### Debug Steps:
1. **Visit `/test-auth`** - check authentication status
2. **Visit `/admin-test`** - check admin access
3. **Check browser console** - look for specific error messages
4. **Check Appwrite logs** - in the console under "Functions" → "Logs"

## 📞 Need Help?
If you're still having issues after following this guide:
1. **Check the browser console** for specific error messages
2. **Try the debug pages** (`/test-auth`, `/admin-test`)
3. **Verify all collections exist** in Appwrite console
4. **Make sure permissions are set to "any"** for testing

The most important step is **fixing the collection permissions** in the Appwrite console. Once that's done, everything should work smoothly!
