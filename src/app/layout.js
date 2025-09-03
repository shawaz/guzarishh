import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { AdminProvider } from '@/contexts/AdminContext';

export const metadata = {
  title: "Guzarishh - Exquisite Indian Women's Fashion",
  description: "Discover the finest collection of Indian women's clothing including sarees, lehengas, salwar kameez, and more. Shop authentic Indian fashion with modern elegance.",
  keywords: "Indian fashion, women's clothing, sarees, lehengas, salwar kameez, ethnic wear, traditional clothing",
  authors: [{ name: "Guzarishh" }],
  creator: "Guzarishh",
  publisher: "Guzarishh",
  openGraph: {
    title: "Guzarishh - Exquisite Indian Women's Fashion",
    description: "Discover the finest collection of Indian women's clothing",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Guzarishh",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Guzarishh - Indian Women's Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guzarishh - Exquisite Indian Women's Fashion",
    description: "Discover the finest collection of Indian women's clothing",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/appwrite.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:opsz,wght@14..32,100..900&family=Poppins:wght@300;400&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/appwrite.svg" />
      </head>
      <body className={"bg-gradient-to-br from-rose-50 to-pink-50 font-[Inter] text-sm text-gray-700 min-h-screen"}>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
