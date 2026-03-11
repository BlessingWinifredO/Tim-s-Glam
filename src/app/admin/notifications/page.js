'use client'

import { useEffect, useState } from 'react'
import { FiMail, FiSend, FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { formatEmailLogTimestamp } from '@/lib/emailLog'
import { getEmailLogStatusTone } from '@/lib/emailLogStatus'

export default function AdminNotificationsPage() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(true)

  const loadLogs = async () => {
    try {
      setLogsLoading(true)
      const response = await fetch('/api/email-logs')
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to load email logs.')
      }
      setLogs(result.logs || [])
    } catch (err) {
      setError((current) => current || err?.message || 'Failed to load email logs.')
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    if (!formData.to.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Recipient email, subject, and message are required.')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'customEmail',
          to: formData.to.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send custom email.')
      }

      setSuccess('Custom email sent successfully.')
      setFormData({ to: '', subject: '', message: '' })
      await loadLogs()
    } catch (err) {
      setError(err?.message || 'Failed to send custom email.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FiMail className="text-primary-600" />
          Notifications
        </h1>
        <p className="text-gray-500 mt-1">Send custom emails manually and review recent delivery logs.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <FiCheck className="text-green-600 h-5 w-5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiX className="text-red-600 h-5 w-5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Email</label>
          <input
            type="email"
            value={formData.to}
            onChange={(e) => onChange('to', e.target.value)}
            placeholder="customer@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => onChange('subject', e.target.value)}
            placeholder="Email subject"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => onChange('message', e.target.value)}
            rows={8}
            placeholder="Write your message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-60"
        >
          {sending ? <FiLoader className="h-5 w-5 animate-spin" /> : <FiSend className="h-5 w-5" />}
          {sending ? 'Sending...' : 'Send Email'}
        </button>
      </form>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Email Logs</h2>
            <p className="text-sm text-gray-500 mt-1">Latest sent and failed email events across the platform.</p>
          </div>
          <button
            type="button"
            onClick={loadLogs}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {logsLoading ? (
          <div className="flex items-center gap-3 py-8 text-gray-600">
            <FiLoader className="h-5 w-5 animate-spin" />
            <span>Loading email logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No email logs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pr-4">Action</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pr-4">Subject</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pr-4">Recipients</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pr-4">Status</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 py-3 pr-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 align-top">
                    <td className="py-4 pr-4 text-sm font-medium text-gray-900">{log.action || 'N/A'}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">{log.subject || 'N/A'}</td>
                    <td className="py-4 pr-4 text-sm text-gray-700">
                      <div>{Array.isArray(log.recipients) && log.recipients.length ? log.recipients.slice(0, 2).join(', ') : 'N/A'}</div>
                      {log.recipientCount > 2 && (
                        <div className="text-xs text-gray-500 mt-1">+{log.recipientCount - 2} more</div>
                      )}
                      {typeof log.sent === 'number' && typeof log.attempted === 'number' && (
                        <div className="text-xs text-gray-500 mt-1">Delivered {log.sent}/{log.attempted}</div>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-sm">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getEmailLogStatusTone(log.status)}`}>
                        {log.status || 'unknown'}
                      </span>
                      {log.errorMessage && (
                        <div className="text-xs text-red-600 mt-2 max-w-xs">{log.errorMessage}</div>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-600">{formatEmailLogTimestamp(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
