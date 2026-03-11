export function formatEmailLogTimestamp(value) {
  if (!value) return 'N/A'

  const raw = typeof value?.toDate === 'function' ? value.toDate() : value
  const date = raw instanceof Date ? raw : new Date(raw)

  if (Number.isNaN(date.getTime())) return 'N/A'

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
