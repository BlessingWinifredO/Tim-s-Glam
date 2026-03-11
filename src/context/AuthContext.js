'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { collection, doc, serverTimestamp, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'

const AuthContext = createContext()
const IDLE_TIMEOUT_MS = 30 * 60 * 1000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const inactivityTimerRef = useRef(null)
  const pendingVerificationSignupRef = useRef(false)

  const isAdminEmail = useCallback((email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const allowedAdminsRaw = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
    const allowedAdminEmails = allowedAdminsRaw
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
    return allowedAdminEmails.includes(normalizedEmail)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // During sign-up verification transition, keep storefront user null to avoid UI flash.
      if (pendingVerificationSignupRef.current) {
        setUser(null)
      } else if (currentUser?.email && isAdminEmail(currentUser.email)) {
        // Keep admin auth isolated from storefront customer auth UI.
        setUser(null)
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [isAdminEmail])

  const clearAdminSession = useCallback(() => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem('adminUser')
  }, [])

  const persistUserProfile = useCallback(async (uid, payload) => {
    try {
      await setDoc(doc(db, 'users', uid), payload, { merge: true })
    } catch (error) {
      // Do not block authentication if Firestore rules are restrictive.
      if (error?.code !== 'permission-denied') {
        throw error
      }
    }
  }, [])

  const sendNotificationEmail = useCallback(async (payload) => {
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return response.ok
    } catch {
      // Notifications should not block auth flows.
      return false
    }
  }, [])

  const persistGoogleProfile = useCallback(
    async (googleUser) => {
      if (!googleUser?.uid) return

      const existingUserDoc = await getDoc(doc(db, 'users', googleUser.uid))
      const isNewUser = !existingUserDoc.exists()

      await persistUserProfile(googleUser.uid, {
        uid: googleUser.uid,
        fullName: googleUser.displayName || '',
        email: googleUser.email || '',
        photoURL: googleUser.photoURL || '',
        provider: 'google.com',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        emailVerified: true,
        welcomeEmailSent: false,
      })

      if (isNewUser && googleUser.email) {
        const welcomeSent = await sendNotificationEmail({
          action: 'welcome',
          email: googleUser.email,
          fullName: googleUser.displayName || 'there',
        })

        if (welcomeSent) {
          await persistUserProfile(googleUser.uid, {
            uid: googleUser.uid,
            welcomeEmailSent: true,
          })
        }
      }
    },
    [persistUserProfile, sendNotificationEmail]
  )

  useEffect(() => {
    let mounted = true

    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (!mounted || !result?.user) return
        await persistGoogleProfile(result.user)
      } catch (error) {
        console.error('Google redirect result error:', error)
      }
    }

    processRedirect()

    return () => {
      mounted = false
    }
  }, [persistGoogleProfile])

  const sendCodeEmail = useCallback(async ({ email, code, type }) => {
    try {
      const response = await fetch('/api/send-auth-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, type }),
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }, [])

  const findUserUidByEmail = useCallback(async (email) => {
    const normalizedEmail = email.toLowerCase()
    const usersRef = collection(db, 'users')

    const normalizedQuery = query(usersRef, where('email', '==', normalizedEmail))
    const normalizedSnapshot = await getDocs(normalizedQuery)
    if (!normalizedSnapshot.empty) {
      return normalizedSnapshot.docs[0].id
    }

    // Fallback for any legacy mixed-case stored email values.
    const legacyQuery = query(usersRef, where('email', '==', email))
    const legacySnapshot = await getDocs(legacyQuery)
    if (!legacySnapshot.empty) {
      return legacySnapshot.docs[0].id
    }

    return null
  }, [])

  // Generate 6-digit verification code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Store verification code in Firestore
  const storeVerificationCode = useCallback(async (email, code, uid) => {
    const codeDoc = doc(db, 'verificationCodes', email.toLowerCase())
    await setDoc(codeDoc, {
      code,
      email: email.toLowerCase(),
      uid, // Store user ID for verification
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      type: 'email-verification',
      used: false,
    })
    return code
  }, [])

  // Store password reset code in Firestore
  const storeResetCode = useCallback(async (email, code) => {
    const codeDoc = doc(db, 'resetCodes', email.toLowerCase())
    await setDoc(codeDoc, {
      code,
      email: email.toLowerCase(),
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      type: 'password-reset',
      used: false,
    })
    return code
  }, [])

  const signUpWithEmail = useCallback(async ({ fullName, email, password }) => {
    clearAdminSession()
    const normalizedEmail = email.toLowerCase()
    pendingVerificationSignupRef.current = true

    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password)

      if (fullName?.trim()) {
        await updateProfile(credential.user, { displayName: fullName.trim() })
      }

      await persistUserProfile(credential.user.uid, {
        uid: credential.user.uid,
        fullName: fullName?.trim() || credential.user.displayName || '',
        email: normalizedEmail,
        photoURL: credential.user.photoURL || '',
        provider: 'password',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        emailVerified: false,
        welcomeEmailSent: false,
      })

      // Generate and store verification code
      const code = generateCode()
      await storeVerificationCode(normalizedEmail, code, credential.user.uid)
      const emailSent = await sendCodeEmail({
        email: normalizedEmail,
        code,
        type: 'verification',
      })

      if (!emailSent) {
        throw new Error('We could not send the verification code email. Please check your email address and try again.')
      }

      const welcomeSent = await sendNotificationEmail({
        action: 'welcome',
        email: normalizedEmail,
        fullName: fullName?.trim() || 'there',
      })

      if (welcomeSent) {
        await persistUserProfile(credential.user.uid, {
          uid: credential.user.uid,
          welcomeEmailSent: true,
        })
      }

      // Sign out after registration (user must verify email first)
      await signOut(auth)

      return { credential, emailSent }
    } catch (error) {
      try {
        await signOut(auth)
      } catch {
        // Ignore cleanup sign-out failures.
      }
      throw error
    } finally {
      pendingVerificationSignupRef.current = false
    }
  }, [clearAdminSession, persistUserProfile, sendCodeEmail, sendNotificationEmail, storeVerificationCode])

  const createOrResendVerificationCode = useCallback(async (email) => {
    const normalizedEmail = email.toLowerCase()
    let uid = null

    const existingCodeDoc = await getDoc(doc(db, 'verificationCodes', normalizedEmail))
    if (existingCodeDoc.exists()) {
      uid = existingCodeDoc.data().uid || null
    }

    if (!uid) {
      uid = await findUserUidByEmail(normalizedEmail)
    }

    if (!uid) {
      throw new Error('No account found with this email. Please sign up first.')
    }

    const code = generateCode()
    await storeVerificationCode(normalizedEmail, code, uid)
    const emailSent = await sendCodeEmail({ email: normalizedEmail, code, type: 'verification' })

    return { success: true, code, emailSent }
  }, [findUserUidByEmail, sendCodeEmail, storeVerificationCode])

  const signInWithEmail = useCallback(async ({ email, password }) => {
    clearAdminSession()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (isAdminEmail(normalizedEmail)) {
      throw new Error('This account is an admin account. Please use the admin sign-in page.')
    }

    const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail)

    if (methods.length && !methods.includes('password')) {
      if (methods.includes('google.com')) {
        throw new Error('This account uses Google sign-in. Please click Continue with Google.')
      }
      throw new Error('This account does not use email/password sign-in.')
    }

    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password)

    // Check if Firestore user document exists
    const userRef = doc(db, 'users', credential.user.uid)
    const userDoc = await getDoc(userRef)
    const userData = userDoc.data()

    // If user document doesn't exist, create it (handles users created via Firebase Console)
    if (!userDoc.exists()) {
      // For Firebase Console-created users, assume admin verified the email, so set emailVerified: true
      await persistUserProfile(credential.user.uid, {
        uid: credential.user.uid,
        fullName: credential.user.displayName || '',
        email: normalizedEmail,
        photoURL: credential.user.photoURL || '',
        provider: credential.user.providerData?.[0]?.providerId || 'password',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        emailVerified: true,
      })
      
      // Allow signin for Firebase Console-created users (pre-verified by admin)
      return credential
    }

    // For existing users, check verification status
    const isVerified = Boolean(userData?.emailVerified || credential.user.emailVerified)

    if (!isVerified) {
      await signOut(auth)
      throw new Error('Please verify your email before signing in. Check your email for the verification code.')
    }

    // Backfill missing emailVerified flag for legacy users
    if (userData?.emailVerified !== true) {
      await persistUserProfile(credential.user.uid, {
        uid: credential.user.uid,
        fullName: credential.user.displayName || userData?.fullName || '',
        email: normalizedEmail,
        photoURL: credential.user.photoURL || userData?.photoURL || '',
        provider: credential.user.providerData?.[0]?.providerId || userData?.provider || 'password',
        emailVerified: true,
        createdAt: userData?.createdAt || serverTimestamp(),
      })
    }

    // Update last login time
    await persistUserProfile(credential.user.uid, {
      uid: credential.user.uid,
      fullName: credential.user.displayName || '',
      email: normalizedEmail,
      photoURL: credential.user.photoURL || '',
      provider: credential.user.providerData?.[0]?.providerId || 'password',
      lastLoginAt: serverTimestamp(),
    })

    return credential
  }, [clearAdminSession, isAdminEmail, persistUserProfile])

  const signInWithGoogle = useCallback(async () => {
    try {
      clearAdminSession()
      const credential = await signInWithPopup(auth, googleProvider)

      if (isAdminEmail(credential?.user?.email)) {
        await signOut(auth)
        throw new Error('This Google account is linked to admin access. Please use the admin sign-in page.')
      }

      await persistGoogleProfile(credential.user)

      return credential
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider)
        return { redirected: true }
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in popup is already open.')
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for OAuth operations. Please contact support.')
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
        await signInWithRedirect(auth, googleProvider)
        return { redirected: true }
      }
      
      throw new Error(error.message || 'Failed to sign in with Google')
    }
  }, [clearAdminSession, isAdminEmail, persistGoogleProfile])

  // Verify email with code
  const verifyEmailCode = useCallback(async ({ email, code }) => {
    const codeDoc = await getDoc(doc(db, 'verificationCodes', email.toLowerCase()))
    
    if (!codeDoc.exists()) {
      throw new Error('No verification code found. Please request a new one.')
    }

    const codeData = codeDoc.data()

    if (codeData.used) {
      throw new Error('This verification code has already been used.')
    }

    if (new Date() > codeData.expiresAt.toDate()) {
      throw new Error('Verification code has expired. Please request a new one.')
    }

    if (codeData.code !== code) {
      throw new Error('Invalid verification code.')
    }

    // Mark code as used
    await updateDoc(doc(db, 'verificationCodes', email.toLowerCase()), { used: true })

    // Mark user as verified in Firestore
    let userData = null
    try {
      const userRef = doc(db, 'users', codeData.uid)
      await updateDoc(userRef, { emailVerified: true })
      const userSnap = await getDoc(userRef)
      userData = userSnap.exists() ? userSnap.data() : null
    } catch (error) {
      if (error?.code === 'permission-denied') {
        throw new Error('Verification failed due to Firestore rules. Publish the latest firestore.rules and try again.')
      }
      throw error
    }

    if (userData?.email && !userData?.welcomeEmailSent) {
      const welcomeSent = await sendNotificationEmail({
        action: 'welcome',
        email: userData.email,
        fullName: userData.fullName || 'there',
      })

      if (welcomeSent) {
        await updateDoc(doc(db, 'users', codeData.uid), { welcomeEmailSent: true })
      }
    }

    return { success: true }
  }, [sendNotificationEmail])

  // Resend verification code
  const resendVerificationCode = useCallback(async (email) => {
    return createOrResendVerificationCode(email)
  }, [createOrResendVerificationCode])

  const requestVerificationForExistingUser = useCallback(async ({ email, password }) => {
    const normalizedEmail = email.toLowerCase()
    const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail)

    if (!methods.length) {
      throw new Error('No account found with this email. Please sign up first.')
    }

    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
    await signOut(auth)

    const userDoc = await getDoc(doc(db, 'users', credential.user.uid))
    if (userDoc.data()?.emailVerified) {
      throw new Error('This account is already verified. Please sign in normally.')
    }

    return createOrResendVerificationCode(normalizedEmail)
  }, [createOrResendVerificationCode])

  // Send password reset code
  const sendResetCode = useCallback(async (email) => {
    const normalizedEmail = email.toLowerCase()
    const firestoreUid = await findUserUidByEmail(normalizedEmail)

    if (!firestoreUid) {
      throw new Error('No account found with this email.')
    }

    const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail)

    if (methods.length && !methods.includes('password')) {
      if (methods.includes('google.com')) {
        throw new Error('This account uses Google sign-in. Password reset by code is only available for email/password accounts.')
      }
      throw new Error('This account does not use email/password sign-in.')
    }

    const code = generateCode()
    await storeResetCode(normalizedEmail, code)
    const emailSent = await sendCodeEmail({ email: normalizedEmail, code, type: 'reset' })

    return { success: true, code, emailSent }
  }, [findUserUidByEmail, sendCodeEmail, storeResetCode])

  // Reset password with code
  const resetPassword = useCallback(async ({ email, code, newPassword }) => {
    const codeDoc = await getDoc(doc(db, 'resetCodes', email.toLowerCase()))
    
    if (!codeDoc.exists()) {
      throw new Error('No reset code found. Please request a new one.')
    }

    const codeData = codeDoc.data()

    if (codeData.used) {
      throw new Error('This reset code has already been used.')
    }

    if (new Date() > codeData.expiresAt.toDate()) {
      throw new Error('Reset code has expired. Please request a new one.')
    }

    if (codeData.code !== code) {
      throw new Error('Invalid reset code.')
    }

    // Mark code as used
    await updateDoc(doc(db, 'resetCodes', email.toLowerCase()), { used: true })

    // Call API route to reset password using Admin SDK
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to reset password')
    }

    return { success: true }
  }, [])

  // Resend password reset code
  const resendResetCode = useCallback(async (email) => {
    const normalizedEmail = email.toLowerCase()
    const code = generateCode()
    await storeResetCode(normalizedEmail, code)
    const emailSent = await sendCodeEmail({ email: normalizedEmail, code, type: 'reset' })

    return { success: true, code, emailSent }
  }, [sendCodeEmail, storeResetCode])

  const logout = useCallback(() => signOut(auth), [])

  const resetInactivityTimer = useCallback(() => {
    if (!user || typeof window === 'undefined') return

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    inactivityTimerRef.current = setTimeout(async () => {
      try {
        await logout()
      } catch {
        // Ignore sign-out errors on idle timeout.
      }
    }, IDLE_TIMEOUT_MS)
  }, [logout, user])

  useEffect(() => {
    if (typeof window === 'undefined' || !user) return

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
  }, [resetInactivityTimer, user])

  const value = useMemo(
    () => ({
      user,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      verifyEmailCode,
      resendVerificationCode,
      requestVerificationForExistingUser,
      sendResetCode,
      resetPassword,
      resendResetCode,
      logout,
    }),
    [
      user,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      verifyEmailCode,
      resendVerificationCode,
      requestVerificationForExistingUser,
      sendResetCode,
      resetPassword,
      resendResetCode,
      logout,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
