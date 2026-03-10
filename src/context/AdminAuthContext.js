'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getAllowedAdminEmails = useCallback(() => {
    const allowedAdminsRaw = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    return allowedAdminsRaw
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  }, [])

  const buildAdminData = useCallback((email, previous = null) => ({
    email,
    name: 'Admin',
    role: 'admin',
    loggedInAt: previous?.loggedInAt || new Date().toISOString(),
  }), [])

  useEffect(() => {
    // Clear Firebase auth session on mount (require fresh admin login each time)
    const clearAndListen = async () => {
      try {
        await signOut(auth)
      } catch (err) {
        console.error('Error clearing auth on mount:', err)
      }

      setAdminUser(null)
      localStorage.removeItem('adminUser')
      setLoading(false)
    }

    clearAndListen()
  }, [])

  const adminSignIn = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const normalizedEmail = (email || '').trim().toLowerCase()
      const allowedAdminEmails = getAllowedAdminEmails()

      await signInWithEmailAndPassword(auth, normalizedEmail, password)

      if (!allowedAdminEmails.includes(normalizedEmail)) {
        await signOut(auth)
        const unauthorizedMessage = 'Access denied. This account is not authorized as admin.'
        setError(unauthorizedMessage)
        return { success: false, error: unauthorizedMessage }
      }

      const adminData = buildAdminData(normalizedEmail)
      setAdminUser(adminData)
      localStorage.setItem('adminUser', JSON.stringify(adminData))
      
      // Keep admin signed in to Firebase for Firestore write permissions
      // Admin state is tracked via localStorage AND Firebase auth
      return { success: true }
    } catch (err) {
      let message = err.message

      if (err?.code === 'auth/operation-not-allowed') {
        message = 'Firebase Email/Password sign-in is disabled. Enable it in Firebase Console > Authentication > Sign-in method > Email/Password.'
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
        message = 'Invalid email or password.'
      } else if (err?.code === 'auth/admin-restricted-operation') {
        message = 'This Firebase project restricts this sign-in operation. Enable Email/Password provider and create the admin user in Firebase Authentication.'
      }

      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [buildAdminData, getAllowedAdminEmails])

  const adminLogout = useCallback(async () => {
    setAdminUser(null)
    localStorage.removeItem('adminUser')
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error signing out from Firebase Auth:', err)
    }
  }, [])

  const checkAdminSession = useCallback(async () => {
    // Session restoration is handled by onAuthStateChanged subscription.
    return
  }, [])

  const value = useMemo(() => ({
    adminUser,
    loading,
    error,
    adminSignIn,
    adminLogout,
    checkAdminSession,
    isAdminAuthenticated: !!adminUser
  }), [adminUser, loading, error, adminSignIn, adminLogout, checkAdminSession])

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
