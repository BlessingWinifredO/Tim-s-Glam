import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'
import MobileBottomNav from '@/components/MobileBottomNav'
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
        <WishlistProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow pb-16 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}
