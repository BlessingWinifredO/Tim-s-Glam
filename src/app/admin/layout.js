'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import AdminFooter from '@/components/AdminFooter'

export default function AdminLayout({ children }) {
  const { isAdminAuthenticated, loading, checkAdminSession } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Check admin session on mount
  useEffect(() => {
    checkAdminSession()
  }, [])

  // Redirect to signin if not authenticated (skip if still loading)
  useEffect(() => {
    if (loading) return // Wait for auth check to complete
    
    // If on signin page, don't redirect
    if (pathname === '/admin/signin') {
      return
    }

    // If not authenticated, redirect to signin
    if (!isAdminAuthenticated) {
      router.push('/admin-signin')
    }
  }, [isAdminAuthenticated, loading, router, pathname])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on signin page, show nothing (will be redirected)
  if (!isAdminAuthenticated) {
    return null
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
        <div className="flex-1 flex flex-col">
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
