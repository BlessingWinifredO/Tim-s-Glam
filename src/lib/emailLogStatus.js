export function getEmailLogStatusTone(status) {
  if (status === 'success') return 'bg-green-100 text-green-700'
  if (status === 'failed') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}
