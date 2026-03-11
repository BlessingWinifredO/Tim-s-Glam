import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/firebase-admin'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export async function POST(request) {
  try {
    const body = await request.json()
    const email = String(body?.email || '').trim().toLowerCase()

    if (!email || !isValidEmail(email)) {
      return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    const db = getAdminDb()
    const existing = await db
      .collection('newsletterSubscribers')
      .where('email', '==', email)
      .limit(1)
      .get()

    if (!existing.empty) {
      return Response.json({ success: true, message: 'You are already subscribed.' })
    }

    await db.collection('newsletterSubscribers').add({
      email,
      source: 'homepage',
      createdAt: FieldValue.serverTimestamp(),
    })

    return Response.json({ success: true, message: 'Subscription successful.' })
  } catch (error) {
    return Response.json(
      { error: error?.message || 'Unable to subscribe right now. Please try again later.' },
      { status: 500 }
    )
  }
}
