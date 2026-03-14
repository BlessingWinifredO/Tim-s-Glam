'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'

export default function AdminSignIn() {
  const router = useRouter()
  const { adminSignIn, loading, error, isAdminAuthenticated } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    // Only redirect if authenticated and not loading
    if (isAdminAuthenticated && !loading) {
      router.push('/admin')
    }
  }, [isAdminAuthenticated, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!email || !password) {
      setSubmitError('Please enter both email and password')
      return
    }

    setIsSubmitting(true)
    const result = await adminSignIn(email, password)
    setIsSubmitting(false)
    if (result.success) {
      // Successfully signed in, navigate to admin dashboard
      router.replace('/admin')
    } else {
      setSubmitError(result.error)
    }
  }

  // Redirect loader only when already authenticated.
  if (isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-200">Loading admin session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.18),transparent_30%)]" />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 mb-4 shadow-xl">
            <span className="text-white font-bold text-xl">TG</span>
          </div>
          <h1 className="text-3xl font-bold text-white">TIM&apos;S GLAM</h1>
          <p className="text-cyan-300 mt-2 tracking-wide">ADMIN CONSOLE</p>
        </div>

        {/* Card */}
        <div className="relative bg-white/95 rounded-2xl shadow-2xl p-8 border border-slate-200">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 mb-4">
            <FiShield size={13} /> Restricted Access
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Sign In</h2>
          <p className="text-slate-500 text-sm mb-6">
            Enter your admin credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Messages */}
            {(error || submitError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  ⚠️ {error || submitError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Not an admin?{' '}
              <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
                Go to Store
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-slate-400 text-xs mt-8">
          Admin Console © 2026 TIM&apos;S GLAM.
        </p>
      </div>
    </div>
  )
}
