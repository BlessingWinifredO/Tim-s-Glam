import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const db = getAdminDb()
    const snapshot = await db
      .collection('emailLogs')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate?.()?.toISOString?.() || null,
    }))

    return NextResponse.json({ success: true, logs })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load email logs.' },
      { status: 500 }
    )
  }
}
