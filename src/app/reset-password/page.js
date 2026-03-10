'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiLock, FiArrowRight, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const devCode = searchParams.get('devCode')
  const mailSent = searchParams.get('mailSent')
  const { resetPassword, resendResetCode, loading } = useAuth()
  
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push('/forgot-password')
    }
  }, [email, router])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!code.trim()) {
      setError('Please enter the reset code')
      return
    }

    if (code.length !== 6) {
      setError('Reset code must be 6 digits')
      return
    }

    if (!newPassword) {
      setError('Please enter a new password')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsResetting(true)

    try {
      await resetPassword({ email, code: code.trim(), newPassword })
      setResetSuccess(true)
      setMessage('Password reset successfully! Redirecting to sign in...')
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Invalid or expired reset code')
    } finally {
      setIsResetting(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setMessage('')
    setIsResending(true)

    try {
      const result = await resendResetCode(email)
      if (!result?.emailSent) {
        if (result?.code && process.env.NODE_ENV !== 'production') {
          setMessage(`Email sending is not configured yet. Use this dev code: ${result.code}`)
        } else {
          setMessage('Code created, but email delivery is not configured yet.')
        }
      } else {
        setMessage('Reset code has been resent to your email')
      }
    } catch (err) {
      setError(err.message || 'Failed to resend reset code')
    } finally {
      setIsResending(false)
    }
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900 mb-2">Password Reset!</h1>
          <p className="text-gray-600 mb-6">Your password has been successfully reset. You can now sign in with your new password.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <FiLock className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter the code sent to
          </p>
          <p className="text-primary-600 font-semibold mt-1">{email}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {mailSent === '0' && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Email delivery is not configured yet on this project. A reset code was created but not emailed.
              </p>
              {devCode && process.env.NODE_ENV !== 'production' && (
                <p className="text-sm font-semibold text-amber-900 mt-2">Dev code: {devCode}</p>
              )}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Reset Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Reset Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                disabled={isResetting || loading}
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={isResetting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  disabled={isResetting || loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Error/Success Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">⚠️ {error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">✓ {message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isResetting || loading || code.length !== 6 || !newPassword || !confirmPassword}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <FiArrowRight />
                </>
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">Didn&apos;t receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending || loading}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm disabled:text-gray-400"
              >
                {isResending ? 'Sending...' : 'Resend reset code'}
              </button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
              ← Use different email
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            The reset code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
