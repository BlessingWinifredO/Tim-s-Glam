'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiLogOut, FiShield } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '@/context/AuthContext'

export default function AccountPage() {
  const router = useRouter()
  const {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    requestVerificationForExistingUser,
    logout,
  } = useAuth()
  const [mode, setMode] = useState('signin')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')

  // Reset form when user logs out
  useEffect(() => {
    if (!user && !loading) {
      setSubmitted(false)
      setAuthError('')
      setAuthMessage('')
      setIsSubmitting(false)
      setErrors({})
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 md:py-16">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <p className="text-gray-600">Loading account...</p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    const initial = user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white">
              <h1 className="text-3xl font-playfair font-bold mb-2">My Account</h1>
              <p className="text-primary-100">Manage your profile and activity on TIM&apos;S GLAM</p>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between border border-gray-100 rounded-xl p-5 bg-gray-50/70">
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={56}
                      height={56}
                      className="rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-lg font-bold">
                      {initial}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{user.displayName || 'TIM\'S GLAM Member'}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiLogOut size={16} />
                  Sign Out
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 rounded-xl border border-gray-100 bg-white">
                  <h2 className="font-semibold text-gray-900 mb-2">Profile Details</h2>
                  <p className="text-sm text-gray-600">Name: {user.displayName || 'Not set'}</p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600 mt-2">Provider: {user.providerData?.[0]?.providerId || 'password'}</p>
                </div>

                <div className="p-5 rounded-xl border border-gray-100 bg-white">
                  <h2 className="font-semibold text-gray-900 mb-2">Activity</h2>
                  <p className="text-sm text-gray-600">Order history and saved activity will appear here as you use the platform.</p>
                  <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold mt-3">
                    Continue Shopping
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gold-50 border border-gold-200 text-sm text-gray-700 flex items-start gap-3">
                <FiShield className="text-gold-600 mt-0.5" size={16} />
                <p>Your account is secured with Firebase Authentication. Use Google or email login anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setAuthError('')
    setAuthMessage('')
  }

  const validate = () => {
    const nextErrors = {}

    if (mode === 'signup' && !formData.fullName.trim()) {
      nextErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        nextErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        nextErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitted(false)
    setAuthError('')
    setAuthMessage('')

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'signin') {
        await signInWithEmail({ email: formData.email, password: formData.password })
        setAuthMessage('Signed in successfully.')
      } else {
        const result = await signUpWithEmail({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        })

        const params = new URLSearchParams({ email: formData.email.toLowerCase() })
        if (result?.code && process.env.NODE_ENV !== 'production') {
          params.set('devCode', result.code)
        }
        params.set('mailSent', result?.emailSent ? '1' : '0')

        router.push(`/verify-email?${params.toString()}`)
        return
      }

      setSubmitted(true)
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      const message = error?.message || 'Authentication failed. Please try again.'
      const emailInUse = message.includes('auth/email-already-in-use')
      const needsVerification = message.toLowerCase().includes('verify your email')

      if ((mode === 'signup' && emailInUse) || (mode === 'signin' && needsVerification)) {
        try {
          const result = await requestVerificationForExistingUser({
            email: formData.email,
            password: formData.password,
          })

          const params = new URLSearchParams({ email: formData.email.toLowerCase() })
          if (result?.code && process.env.NODE_ENV !== 'production') {
            params.set('devCode', result.code)
          }
          params.set('mailSent', result?.emailSent ? '1' : '0')

          router.push(`/verify-email?${params.toString()}`)
          return
        } catch (verificationError) {
          setAuthError(verificationError?.message || 'Could not send verification code. Please try again.')
          return
        }
      }

      setAuthError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setAuthError('')
    setAuthMessage('')
    setIsSubmitting(true)

    try {
      await signInWithGoogle()
      setAuthMessage('Signed in with Google successfully.')
      setSubmitted(true)
    } catch (error) {
      setAuthError(error.message || 'Could not send password reset email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 md:py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white text-center">
            <h1 className="text-3xl font-playfair font-bold mb-2">Account</h1>
            <p className="text-primary-100">
              {mode === 'signin' ? 'Welcome back to TIM\'S GLAM' : 'Create your TIM\'S GLAM account'}
            </p>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => {
                  setMode('signin')
                  setErrors({})
                  setSubmitted(false)
                  setAuthError('')
                  setAuthMessage('')
                }}
                className={`py-2.5 rounded-lg font-semibold transition-all ${
                  mode === 'signin' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                }`}
                type="button"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('signup')
                  setErrors({})
                  setSubmitted(false)
                  setAuthError('')
                  setAuthMessage('')
                }}
                className={`py-2.5 rounded-lg font-semibold transition-all ${
                  mode === 'signup' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                }`}
                type="button"
              >
                Sign Up
              </button>
            </div>

            {submitted && (
              <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {authMessage || (mode === 'signin' ? 'Signed in successfully.' : 'Account created successfully.')}
              </div>
            )}

            {authError && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <FcGoogle size={20} />
              <span>{mode === 'signin' ? 'Sign In with Google' : 'Sign Up with Google'}</span>
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-500">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>}
                </div>
              )}

              {mode === 'signin' && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" className="w-full btn-primary inline-flex items-center justify-center gap-2">
                <span>{isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <FiArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}