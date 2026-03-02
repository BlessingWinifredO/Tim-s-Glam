'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi'

export default function AccountPage() {
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
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

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(false)

    if (!validate()) {
      return
    }

    setSubmitted(true)
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
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
                {mode === 'signin' ? 'Signed in successfully.' : 'Account created successfully.'}
              </div>
            )}

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
                  <Link href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button type="submit" className="w-full btn-primary inline-flex items-center justify-center gap-2">
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <FiArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
