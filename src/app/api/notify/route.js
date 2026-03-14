import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { getEmailConfigStatus, sendEmail, verifyEmailTransporter } from '@/lib/email'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email))
}

function appLink(path = '/') {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}${path}`
}

function wrapTemplate(title, bodyHtml) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
      <div style="background: linear-gradient(135deg, #2b0b57, #4a1d75); color: #fff; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">TIM'S GLAM</h2>
        <p style="margin: 8px 0 0; opacity: .9;">Your Style. Your Signature. Your Glam.</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 12px 12px; padding: 24px; background: #fff;">
        <h3 style="margin-top: 0;">${title}</h3>
        ${bodyHtml}
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">This is an automated email from TIM'S GLAM.</p>
      </div>
    </div>
  `
}

async function getBroadcastRecipients() {
  const db = getAdminDb()

  const [usersSnap, newsletterSnap] = await Promise.all([
    db.collection('users').get(),
    db.collection('newsletterSubscribers').get(),
  ])

  const emails = new Set()

  usersSnap.docs.forEach((d) => {
    const email = normalizeEmail(d.data()?.email)
    if (isValidEmail(email)) emails.add(email)
  })

  newsletterSnap.docs.forEach((d) => {
    const email = normalizeEmail(d.data()?.email)
    if (isValidEmail(email)) emails.add(email)
  })

  return Array.from(emails)
}

async function logEmailAction(logEntry) {
  try {
    const db = getAdminDb()
    await db.collection('emailLogs').add({
      ...logEntry,
      createdAt: new Date(),
    })
  } catch (err) {
    console.error('[emailLog] Failed to log action:', err)
  }
}

export async function GET() {
  const configStatus = getEmailConfigStatus()
  const verifyStatus = await verifyEmailTransporter()

  return NextResponse.json({
    success: true,
    status: {
      configured: configStatus.configured,
      testMode: configStatus.testMode || false,
      missing: configStatus.missing,
      host: configStatus.host,
      port: configStatus.port,
      from: configStatus.from,
      verified: verifyStatus.ok,
      testModeNote: configStatus.testMode
        ? 'No SMTP configured — using Ethereal test inbox. Emails are captured but not delivered to real inboxes.'
        : null,
      verifyError: verifyStatus.error,
    },
  })
}

function getAllowedAdminEmails() {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
}

// Broadcast actions can only be triggered by an authenticated admin session.
// Transactional actions (welcome, orderPlaced, etc.) are called internally
// from checkout / auth flows and are validated by the presence of a valid payload.
// customEmail is NOT in this set — it is allowed from the contact form (public),
// but is restricted to sending only to whitelisted admin recipients inside its handler.
const BROADCAST_ACTIONS = new Set(['newProductBroadcast', 'newBlogBroadcast'])

export async function POST(request) {
  let payload = null
  let action = 'unknown'

  try {
    payload = await request.json()
    action = String(payload?.action || '')

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 })
    }

    // Require admin session header for broadcast/manual email actions
    if (BROADCAST_ACTIONS.has(action)) {
      const adminSession = request.headers.get('x-admin-session')
      const adminEmail = String(request.headers.get('x-admin-email') || '').trim().toLowerCase()
      const allowedAdmins = getAllowedAdminEmails()
      if (adminSession !== 'true' || !allowedAdmins.includes(adminEmail)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    if (action === 'welcome') {
      const email = normalizeEmail(payload?.email)
      const fullName = String(payload?.fullName || 'there')
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
      }

      const subject = "Welcome to TIM'S GLAM"
      const emailResult = await sendEmail({
        to: email,
        subject,
        html: wrapTemplate(
          'Account Setup Successful',
          `<p>Hi ${fullName}, your TIM'S GLAM account is ready.</p>
           <p>Start shopping premium fashion for adults and kids.</p>
           <p><a href="${appLink('/shop')}" style="color:#4a1d75; font-weight:600;">Explore Collections</a></p>`
        ),
      })

      await logEmailAction({
        action: 'welcome',
        status: 'success',
        subject,
        recipients: [email],
        recipientCount: 1,
        metadata: { fullName },
      })

      return NextResponse.json({
        success: true,
        testMode: emailResult.testMode || false,
        ...(emailResult.previewUrl ? { previewUrl: emailResult.previewUrl } : {}),
      })
    }

    if (action === 'orderPlaced') {
      const email = normalizeEmail(payload?.email)
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
      }

      const customerName = String(payload?.customerName || 'Customer')
      const orderId = String(payload?.orderId || '')
      const totalAmount = Number(payload?.totalAmount || 0).toFixed(2)
      const status = String(payload?.status || 'Processing')

      const subject = `Order Confirmation - #${orderId.slice(0, 8).toUpperCase()}`
      const emailResult = await sendEmail({
        to: email,
        subject,
        html: wrapTemplate(
          'Order Placed Successfully',
          `<p>Hi ${customerName}, your order has been placed.</p>
           <p><strong>Order ID:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
           <p><strong>Total:</strong> ₦${totalAmount}</p>
           <p><strong>Status:</strong> ${status}</p>
           <p><a href="${appLink('/account')}" style="color:#4a1d75; font-weight:600;">View Account</a></p>`
        ),
      })

      await logEmailAction({
        action: 'orderPlaced',
        status: 'success',
        subject,
        recipients: [email],
        recipientCount: 1,
        metadata: { orderId: orderId.slice(0, 8).toUpperCase(), totalAmount, orderStatus: status },
      })

      return NextResponse.json({
        success: true,
        testMode: emailResult.testMode || false,
        ...(emailResult.previewUrl ? { previewUrl: emailResult.previewUrl } : {}),
      })
    }

    if (action === 'orderStatusUpdated') {
      const email = normalizeEmail(payload?.email)
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
      }

      const customerName = String(payload?.customerName || 'Customer')
      const orderId = String(payload?.orderId || '')
      const status = String(payload?.status || 'Processing')

      const subject = `Order Status Updated - #${orderId.slice(0, 8).toUpperCase()}`
      const emailResult = await sendEmail({
        to: email,
        subject,
        html: wrapTemplate(
          'Your Order Status Changed',
          `<p>Hi ${customerName}, your order status has been updated.</p>
           <p><strong>Order ID:</strong> #${orderId.slice(0, 8).toUpperCase()}</p>
           <p><strong>Current Status:</strong> ${status}</p>
           <p><a href="${appLink('/account')}" style="color:#4a1d75; font-weight:600;">Track your order</a></p>`
        ),
      })

      await logEmailAction({
        action: 'orderStatusUpdated',
        status: 'success',
        subject,
        recipients: [email],
        recipientCount: 1,
        metadata: { orderId: orderId.slice(0, 8).toUpperCase(), newStatus: status },
      })

      return NextResponse.json({
        success: true,
        testMode: emailResult.testMode || false,
        ...(emailResult.previewUrl ? { previewUrl: emailResult.previewUrl } : {}),
      })
    }

    if (action === 'newProductBroadcast') {
      const recipients = await getBroadcastRecipients()
      if (!recipients.length) {
        await logEmailAction({
          action: 'newProductBroadcast',
          status: 'success',
          subject: `New Product Added: ${String(payload?.productName || 'New Product')}`,
          recipients: [],
          recipientCount: 0,
          sent: 0,
          attempted: 0,
          metadata: {},
        })
        return NextResponse.json({ success: true, sent: 0 })
      }

      const productName = String(payload?.productName || 'New Product')
      const price = Number(payload?.price || 0).toFixed(2)
      const productId = String(payload?.productId || '')

      const subject = `New Product Added: ${productName}`
      const html = wrapTemplate(
        'New Product Update',
        `<p>We just added a new item: <strong>${productName}</strong>.</p>
         <p><strong>Price:</strong> ₦${price}</p>
         <p><a href="${appLink(`/shop/${productId}`)}" style="color:#4a1d75; font-weight:600;">View Product</a></p>`
      )

      const results = await Promise.allSettled(recipients.map((to) => sendEmail({ to, subject, html })))
      const sent = results.filter((entry) => entry.status === 'fulfilled').length
      const broadcastStatus = sent === recipients.length ? 'success' : sent === 0 ? 'failure' : 'partial'
      await logEmailAction({
        action: 'newProductBroadcast',
        status: broadcastStatus,
        subject,
        recipients,
        recipientCount: recipients.length,
        sent,
        attempted: recipients.length,
        metadata: { productName, price, productId },
      })
      return NextResponse.json({ success: true, sent, attempted: recipients.length })
    }

    if (action === 'newBlogBroadcast') {
      const recipients = await getBroadcastRecipients()
      if (!recipients.length) {
        await logEmailAction({
          action: 'newBlogBroadcast',
          status: 'success',
          subject: `New Blog Update: ${String(payload?.title || 'New Blog Update')}`,
          recipients: [],
          recipientCount: 0,
          sent: 0,
          attempted: 0,
          metadata: {},
        })
        return NextResponse.json({ success: true, sent: 0 })
      }

      const title = String(payload?.title || 'New Blog Update')
      const excerpt = String(payload?.excerpt || '')
      const blogId = String(payload?.blogId || '')

      const subject = `New Blog Update: ${title}`
      const html = wrapTemplate(
        'Latest Blog Update',
        `<p><strong>${title}</strong></p>
         <p>${excerpt}</p>
         <p><a href="${appLink(`/blog/${blogId}`)}" style="color:#4a1d75; font-weight:600;">Read Article</a></p>`
      )

      const results = await Promise.allSettled(recipients.map((to) => sendEmail({ to, subject, html })))
      const sent = results.filter((entry) => entry.status === 'fulfilled').length
      const broadcastStatus = sent === recipients.length ? 'success' : sent === 0 ? 'failure' : 'partial'
      await logEmailAction({
        action: 'newBlogBroadcast',
        status: broadcastStatus,
        subject,
        recipients,
        recipientCount: recipients.length,
        sent,
        attempted: recipients.length,
        metadata: { title, blogId },
      })
      return NextResponse.json({ success: true, sent, attempted: recipients.length })
    }

    if (action === 'customEmail') {
      const to = normalizeEmail(payload?.to)
      const subject = String(payload?.subject || '').trim()
      const message = String(payload?.message || '').trim()

      if (!isValidEmail(to) || !subject || !message) {
        return NextResponse.json({ error: 'to, subject and message are required' }, { status: 400 })
      }

      // Prevent open relay: only allow delivery to known admin addresses
      const allowedAdmins = getAllowedAdminEmails()
      if (!allowedAdmins.includes(to)) {
        return NextResponse.json({ error: 'Recipient not allowed.' }, { status: 403 })
      }

      const emailResult = await sendEmail({
        to,
        subject,
        html: wrapTemplate(subject, `<p>${message.replace(/\n/g, '<br/>')}</p>`),
      })

      await logEmailAction({
        action: 'customEmail',
        status: 'success',
        subject,
        recipients: [to],
        recipientCount: 1,
        metadata: { messageLength: message.length },
      })

      return NextResponse.json({
        success: true,
        testMode: emailResult.testMode || false,
        ...(emailResult.previewUrl ? { previewUrl: emailResult.previewUrl } : {}),
      })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (error) {
    await logEmailAction({
      action,
      status: 'failed',
      subject: String(payload?.subject || ''),
      recipients: [normalizeEmail(payload?.to || payload?.email)].filter(Boolean),
      recipientCount: payload?.to || payload?.email ? 1 : 0,
      errorMessage: error?.message || 'Failed to process notification',
      metadata: {},
    })
    return NextResponse.json({ error: error?.message || 'Failed to process notification' }, { status: 500 })
  }
}
