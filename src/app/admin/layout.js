'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import AdminFooter from '@/components/AdminFooter'

export default function AdminLayout({ children }) {
  const { isAdminAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isSigninPage = pathname === '/admin/signin'

  // Redirect to signin if not authenticated
  useEffect(() => {
    // If on signin page, don't redirect
    if (isSigninPage) {
      return
    }

    // If not authenticated, redirect to signin
    if (!isAdminAuthenticated && !loading) {
      router.replace('/admin/signin')
    }
  }, [isAdminAuthenticated, isSigninPage, loading, router])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Show loading only if actively loading, not just unauthenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on signin page, show nothing while redirecting
  if (!isAdminAuthenticated && !isSigninPage) {
    return null
  }

  if (isSigninPage) {
    return children
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:pl-72">
          <AdminHeader onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl">
              {children}
            </div>
          </main>
          <AdminFooter />
        </div>
      </div>
    </div>
  )
}
