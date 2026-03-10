import { NextResponse } from 'next/server'
import { getAdminAuth } from '@/lib/firebase-admin'

/**
 * API Route: Reset Password
 * 
 * This endpoint requires Firebase Admin SDK to update user passwords.
 * To implement this properly, you need to:
 * 
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Set up service account credentials
 * 3. Initialize Admin SDK in a separate admin config file
 * 4. Use admin.auth().updateUser(uid, { password: newPassword })
 * 
 * For now, this returns an instructional error.
 */

export async function POST(request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password are required' },
        { status: 400 }
      )
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const adminAuth = getAdminAuth()

    const userRecord = await adminAuth.getUserByEmail(normalizedEmail)
    await adminAuth.updateUser(userRecord.uid, { password: newPassword })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error?.message || 'Failed to reset password'

    if (message.includes('Firebase Admin SDK is not configured')) {
      return NextResponse.json(
        {
          error: 'Password reset is not configured yet. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in .env.local, then restart the server.',
          requiresAdminSDK: true,
        },
        { status: 503 }
      )
    }

    if (error?.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'No Authentication account exists for this email.' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
