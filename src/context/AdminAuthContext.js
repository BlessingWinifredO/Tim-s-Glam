'use client'

import { createContext, useContext, useState } from 'react'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const adminSignIn = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      // For demo purposes, you can set admin credentials in Firebase
      // Admin email: admin@timsgam.com
      // Admin password: stored in Firestore in adminUsers collection
      
      // Check if credentials match (hardcoded for now, can be moved to Firestore)
      const adminCredentials = {
        email: 'admin@timsgam.com',
        password: 'TimsGlam@Admin2026'
      }

      if (email === adminCredentials.email && password === adminCredentials.password) {
        const adminData = {
          email,
          name: 'Admin',
          role: 'admin',
          loggedInAt: new Date()
        }
        setAdminUser(adminData)
        localStorage.setItem('adminUser', JSON.stringify(adminData))
        return { success: true }
      } else {
        setError('Invalid admin credentials')
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const adminLogout = () => {
    setAdminUser(null)
    localStorage.removeItem('adminUser')
  }

  const checkAdminSession = () => {
    setLoading(true)
    try {
      const stored = localStorage.getItem('adminUser')
      if (stored) {
        setAdminUser(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Error restoring admin session:', err)
      setAdminUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    adminUser,
    loading,
    error,
    adminSignIn,
    adminLogout,
    checkAdminSession,
    isAdminAuthenticated: !!adminUser
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
