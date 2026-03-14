'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const AdminAuthContext = createContext()
const IDLE_TIMEOUT_MS = 30 * 60 * 1000

export function AdminAuthProvider({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') || false
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const inactivityTimerRef = useRef(null)

  const hasExplicitAdminSession = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.sessionStorage.getItem('adminSessionActive') === '1'
  }, [])

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
    if (!isAdminRoute) {
      setLoading(false)
      return
    }

    // Show admin signin form immediately when there is no explicit admin session.
    // This avoids an unnecessary full-screen loading state on /admin/signin.
    if (!hasExplicitAdminSession()) {
      setLoading(false)
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const normalizedEmail = String(currentUser?.email || '').trim().toLowerCase()
      const allowedAdminEmails = getAllowedAdminEmails()

      if (currentUser && allowedAdminEmails.includes(normalizedEmail) && hasExplicitAdminSession()) {
        let previous = null
        try {
          previous = JSON.parse(localStorage.getItem('adminUser') || 'null')
        } catch {
          previous = null
        }

        const adminData = buildAdminData(normalizedEmail, previous)
        setAdminUser(adminData)
        localStorage.setItem('adminUser', JSON.stringify(adminData))
      } else {
        if (currentUser && allowedAdminEmails.includes(normalizedEmail) && !hasExplicitAdminSession()) {
          try {
            await signOut(auth)
          } catch {
            // Ignore sign-out sync failures.
          }
        }
        setAdminUser(null)
        localStorage.removeItem('adminUser')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [buildAdminData, getAllowedAdminEmails, hasExplicitAdminSession, isAdminRoute])

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
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('adminSessionActive', '1')
      }
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
      } else if (err?.code === 'auth/network-request-failed') {
        message = 'Firebase sign-in request was blocked by the browser or network. If you are using Brave, disable Shields for localhost:3000, allow third-party cookies for localhost and firebaseapp.com, then hard refresh and try again.'
      }

      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [buildAdminData, getAllowedAdminEmails])

  const adminLogout = useCallback(async () => {
    setAdminUser(null)
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('adminSessionActive')
    }
    localStorage.removeItem('adminUser')
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error signing out from Firebase Auth:', err)
    }
  }, [])

  const resetInactivityTimer = useCallback(() => {
    if (!adminUser || typeof window === 'undefined') return

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(async () => {
      try {
        await adminLogout()
      } catch {
        // Ignore sign-out errors on idle timeout.
      }
    }, IDLE_TIMEOUT_MS)
  }, [adminLogout, adminUser])

  useEffect(() => {
    if (typeof window === 'undefined' || !adminUser) return

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    const handleActivity = () => resetInactivityTimer()

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity)
    })

    resetInactivityTimer()

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity)
      })

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = null
      }
    }
  }, [adminUser, resetInactivityTimer])

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
