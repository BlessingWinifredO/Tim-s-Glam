'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUpWithEmail = async ({ fullName, email, password }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (fullName?.trim()) {
      await updateProfile(credential.user, { displayName: fullName.trim() })
    }

    await setDoc(
      doc(db, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        fullName: fullName?.trim() || credential.user.displayName || '',
        email: credential.user.email,
        photoURL: credential.user.photoURL || '',
        provider: 'password',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    )

    return credential
  }

  const signInWithEmail = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)

    await setDoc(
      doc(db, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        fullName: credential.user.displayName || '',
        email: credential.user.email,
        photoURL: credential.user.photoURL || '',
        provider: credential.user.providerData?.[0]?.providerId || 'password',
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    )

    return credential
  }

  const signInWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider)

    await setDoc(
      doc(db, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        fullName: credential.user.displayName || '',
        email: credential.user.email,
        photoURL: credential.user.photoURL || '',
        provider: 'google.com',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    )

    return credential
  }

  const logout = () => signOut(auth)

  const value = useMemo(
    () => ({
      user,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      logout,
    }),
    [user, loading]
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
