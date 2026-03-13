import nodemailer from 'nodemailer'

// ---------------------------------------------------------------------------
// Test-mode Ethereal account (auto-created when no real SMTP is configured)
// ---------------------------------------------------------------------------
let _testAccount = null
let _testTransporter = null
let _realTransporter = null
let _verifiedCache = null

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue
  return String(value).trim().toLowerCase() === 'true'
}

export function getEmailConfig() {
  const service = String(process.env.SMTP_SERVICE || '').trim()
  const host = String(process.env.SMTP_HOST || '').trim()
  const port = Number(process.env.SMTP_PORT || 587)
  const user = String(process.env.SMTP_USER || '').trim()
  const pass = String(process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').trim()
  const from = String(process.env.SMTP_FROM || user).trim()
  const secure = toBoolean(process.env.SMTP_SECURE, port === 465)

  return { service, host, port, user, pass, from, secure }
}

export function getEmailConfigStatus() {
  const config = getEmailConfig()
  const missing = []

  if (!config.user) missing.push('SMTP_USER')
  if (!config.pass) missing.push('SMTP_PASSWORD')

  if (!config.service && !config.host) {
    missing.push('SMTP_HOST or SMTP_SERVICE')
  }

  const configured = missing.length === 0

  return {
    configured,
    testMode: !configured,
    missing,
    service: config.service || null,
    host: config.host || null,
    port: Number.isFinite(config.port) ? config.port : null,
    from: config.from || null,
  }
}

// ---------------------------------------------------------------------------
// Real SMTP transporter (only when credentials are present)
// ---------------------------------------------------------------------------
function createRealTransporter() {
  const config = getEmailConfig()
  const status = getEmailConfigStatus()
  if (!status.configured) return null

  return nodemailer.createTransport({
    ...(config.service
      ? { service: config.service }
      : { host: config.host, port: config.port, secure: config.secure }),
    auth: { user: config.user, pass: config.pass },
  })
}

// ---------------------------------------------------------------------------
// Ethereal test transporter — created once, cached
// ---------------------------------------------------------------------------
async function getTestTransporter() {
  if (_testTransporter) return _testTransporter

  _testAccount = await nodemailer.createTestAccount()
  _testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: _testAccount.user, pass: _testAccount.pass },
  })

  console.log('[EMAIL] No SMTP configured — using Ethereal test account:', _testAccount.user)
  return _testTransporter
}

// ---------------------------------------------------------------------------
// Main resolver — returns { transporter, from, isTestMode }
// ---------------------------------------------------------------------------
async function resolveTransporter() {
  const status = getEmailConfigStatus()

  if (status.configured) {
    if (!_realTransporter) _realTransporter = createRealTransporter()
    const config = getEmailConfig()
    return { transporter: _realTransporter, from: config.from || config.user, isTestMode: false }
  }

  const transporter = await getTestTransporter()
  return {
    transporter,
    from: `"Tim's Glam (Test)" <${_testAccount.user}>`,
    isTestMode: true,
  }
}

// ---------------------------------------------------------------------------
// Public: verify connection
// ---------------------------------------------------------------------------
export async function verifyEmailTransporter() {
  if (_verifiedCache) return _verifiedCache

  try {
    const { transporter, isTestMode } = await resolveTransporter()
    await transporter.verify()
    _verifiedCache = {
      ok: true,
      configured: !isTestMode,
      testMode: isTestMode,
      missing: [],
      error: null,
    }
  } catch (error) {
    const status = getEmailConfigStatus()
    _verifiedCache = {
      ok: false,
      configured: status.configured,
      testMode: status.testMode,
      missing: status.missing,
      error: error?.message || 'SMTP verification failed.',
    }
  }

  return _verifiedCache
}

// ---------------------------------------------------------------------------
// Public: send an email
// Returns { messageId, testMode, previewUrl? }
// ---------------------------------------------------------------------------
export async function sendEmail({ to, subject, html }) {
  const { transporter, from, isTestMode } = await resolveTransporter()

  const info = await transporter.sendMail({ from, to, subject, html })

  const result = { messageId: info.messageId, testMode: isTestMode }

  if (isTestMode) {
    result.previewUrl = nodemailer.getTestMessageUrl(info)
    console.log(`[EMAIL TEST] Subject: "${subject}" → ${to}`)
    console.log(`[EMAIL TEST] Preview: ${result.previewUrl}`)
  }

  return result
}

// Legacy sync helpers kept for API compatibility
export function createEmailTransporter() {
  return createRealTransporter()
}

export function getEmailTransporter() {
  if (!_realTransporter) _realTransporter = createRealTransporter()
  return _realTransporter
}