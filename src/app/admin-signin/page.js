import { redirect } from 'next/navigation'

export default function LegacyAdminSigninRedirect() {
  redirect('/admin/signin')
}
