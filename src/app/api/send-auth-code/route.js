import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

function getEmailTemplate(type, code) {
  if (type === 'reset') {
    return {
      subject: 'TIM\'S GLAM Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
          <h2 style="margin-bottom: 8px;">Reset your TIM'S GLAM password</h2>
          <p style="margin-bottom: 16px;">Use the code below to reset your password. It expires in 10 minutes.</p>
          <div style="font-size: 32px; letter-spacing: 6px; font-weight: bold; background: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px;">
            ${code}
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">If you did not request this, you can ignore this email.</p>
        </div>
      `,
    }
  }

  return {
    subject: 'TIM\'S GLAM Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Verify your TIM'S GLAM account</h2>
        <p style="margin-bottom: 16px;">Use the code below to verify your email. It expires in 10 minutes.</p>
        <div style="font-size: 32px; letter-spacing: 6px; font-weight: bold; background: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px;">
          ${code}
        </div>
        <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">If you did not create an account, you can ignore this email.</p>
      </div>
    `,
  }
}

export async function POST(request) {
  try {
    const { email, code, type } = await request.json()

    if (!email || !code || !type) {
      return NextResponse.json({ error: 'email, code and type are required' }, { status: 400 })
    }

    const transporter = getTransporter()
    if (!transporter) {
      return NextResponse.json(
        {
          error: 'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM in .env.local',
          code: 'SMTP_NOT_CONFIGURED',
        },
        { status: 503 }
      )
    }

    const { subject, html } = getEmailTemplate(type, code)

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to send email code' },
      { status: 500 }
    )
  }
}
