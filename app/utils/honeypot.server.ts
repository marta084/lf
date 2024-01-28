import { Honeypot, SpamError } from 'remix-utils/honeypot/server'

export const honeypot = new Honeypot({
  validFromFieldName: '',
  encryptionSeed: '',
})

export function checkHoneypot(formData: FormData) {
  try {
    honeypot.check(formData)
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response('Form not submitted properly', { status: 400 })
    }
    throw error
  }
}
