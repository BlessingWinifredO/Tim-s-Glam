import { NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin'

function getAllowedAdminEmails() {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'winniewizzyb@gmail.com,admin@tims-glam.com'
  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

async function validateAdminCredentials(adminEmail, adminPassword) {
  const normalizedEmail = String(adminEmail || '').trim().toLowerCase()
  const allowedAdmins = getAllowedAdminEmails()

  if (!allowedAdmins.includes(normalizedEmail)) {
    throw new Error('Access denied. This account is not authorized as admin.')
  }

  if (!adminPassword) {
    throw new Error('Admin password is required.')
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error('Firebase API key not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY.')
  }
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        password: adminPassword,
        returnSecureToken: true,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Admin re-authentication failed. Please check your password.')
  }
}

export async function POST(request) {
  try {
    const {
      customerUid,
      customerEmail,
      adminEmail,
      adminPassword,
      deleteOrders = true,
    } = await request.json()

    if (!customerEmail) {
      return NextResponse.json({ error: 'customerEmail is required.' }, { status: 400 })
    }

    await validateAdminCredentials(adminEmail, adminPassword)

    const normalizedEmail = String(customerEmail).trim().toLowerCase()
    const adminAuth = getAdminAuth()
    const adminDb = getAdminDb()

    let targetUid = customerUid || null

    if (!targetUid) {
      try {
        const userRecord = await adminAuth.getUserByEmail(normalizedEmail)
        targetUid = userRecord.uid
      } catch {
        targetUid = null
      }
    }

    let authDeleted = false
    if (targetUid) {
      try {
        await adminAuth.deleteUser(targetUid)
        authDeleted = true
      } catch (error) {
        // If uid is stale/mismatched, try deleting by email record before failing.
        if (error?.code === 'auth/user-not-found') {
          try {
            const userRecordByEmail = await adminAuth.getUserByEmail(normalizedEmail)
            await adminAuth.deleteUser(userRecordByEmail.uid)
            authDeleted = true
            targetUid = userRecordByEmail.uid
          } catch (emailLookupError) {
            if (emailLookupError?.code !== 'auth/user-not-found') {
              throw emailLookupError
            }
            // Auth record does not exist; still continue deleting Firestore records.
            targetUid = null
          }
        } else {
          throw error
        }
      }
    }

    // Delete primary user document by uid if available.
    if (targetUid) {
      await adminDb.collection('users').doc(targetUid).delete()
    }

    // Delete any user docs that match email (handles legacy/orphan docs).
    const usersByEmailSnapshot = await adminDb
      .collection('users')
      .where('email', '==', normalizedEmail)
      .get()
    for (const userDoc of usersByEmailSnapshot.docs) {
      await userDoc.ref.delete()
    }

    // Delete verification and reset code docs.
    await adminDb.collection('verificationCodes').doc(normalizedEmail).delete().catch(() => null)
    await adminDb.collection('resetCodes').doc(normalizedEmail).delete().catch(() => null)

    let deletedOrderCount = 0
    if (deleteOrders) {
      const ordersSnapshot = await adminDb
        .collection('orders')
        .where('customerEmail', '==', normalizedEmail)
        .get()
      deletedOrderCount = ordersSnapshot.size
      for (const orderDoc of ordersSnapshot.docs) {
        await orderDoc.ref.delete()
      }
    }

    return NextResponse.json({
      success: true,
      authDeleted,
      deletedOrderCount,
      message: 'Customer deleted from Authentication and Firestore.',
    })
  } catch (error) {
    const message = error?.message || 'Failed to delete customer account.'

    if (message.includes('Firebase Admin SDK is not configured')) {
      return NextResponse.json(
        {
          error: 'Customer delete is not configured yet. Add FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY to .env.local, then restart the server.',
          requiresAdminSDK: true,
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    )
  }
}
