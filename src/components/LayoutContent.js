'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function LayoutContent({ children }) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')

  return (
    <>
      <main className={isAdminPage ? 'flex-grow' : 'flex-grow pb-16 md:pb-0'}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <MobileBottomNav />}
    </>
  )
}
