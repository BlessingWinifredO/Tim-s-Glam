'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiMail, FiArrowRight, FiCheck } from 'react-icons/fi'
import { useAuth } from '@/context/AuthContext'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const mailSent = searchParams.get('mailSent')
  const { verifyEmailCode, resendVerificationCode, loading } = useAuth()
  
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push('/account')
    }
  }, [email, router])

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!code.trim()) {
      setError('Please enter the verification code')
      return
    }

    if (code.length !== 6) {
      setError('Verification code must be 6 digits')
      return
    }

    setIsVerifying(true)

    try {
      await verifyEmailCode({ email, code: code.trim() })
      setVerified(true)
      setMessage('Email verified successfully! Redirecting to sign in...')
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setError('')
    setMessage('')
    setIsResending(true)

    try {
      const result = await resendVerificationCode(email)
      if (!result?.emailSent) {
        throw new Error('We could not send the verification code email right now. Please try again in a moment.')
      }
      setMessage('Verification code has been resent to your email')
    } catch (err) {
      setError(err.message || 'Failed to resend verification code')
    } finally {
      setIsResending(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now sign in to your account.</p>
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
            <FiMail className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-primary-600 font-semibold mt-1">{email}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {mailSent === '0' && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                We could not confirm email delivery. Please click &quot;Resend verification code&quot;.
              </p>
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-6">
            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                disabled={isVerifying || loading}
              />
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
              disabled={isVerifying || loading || code.length !== 6}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
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
                {isResending ? 'Sending...' : 'Resend verification code'}
              </button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/account" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Sign In
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don&apos;t see the email. The code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
