'use client'

import EmailSender from '@/components/dashboard/EmailSender'
import { EMAIL_TEMPLATES } from '@/lib/email/templates'

export default function EmailPage() {
  return <EmailSender templates={EMAIL_TEMPLATES} />
}
