import './globals.css'
import Header from '@/components/Header'
import LayoutContent from '@/components/LayoutContent'
import SplashScreen from '@/components/SplashScreen'
import { AuthProvider } from '@/context/AuthContext'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import { AdminDataProvider } from '@/context/AdminDataContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

export const metadata = {
  title: "TIM'S GLAM - Your Style, Your Signature, Your Glam",
  description: 'Premium unisex fashion for adults and kids. Discover your unique style with our curated collection.',
  keywords: 'fashion, unisex clothing, kids fashion, adult fashion, online shopping, TIM\'S GLAM',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SplashScreen />
        <AuthProvider>
          <AdminAuthProvider>
            <AdminDataProvider>
              <WishlistProvider>
                <CartProvider>
                  <Header />
                  <LayoutContent>{children}</LayoutContent>
                </CartProvider>
              </WishlistProvider>
            </AdminDataProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
