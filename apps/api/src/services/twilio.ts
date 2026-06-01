import axios from "axios"

const accountSid = process.env.TWILIO_ACCOUNT_SID ?? ""
const authToken = process.env.TWILIO_AUTH_TOKEN ?? ""
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM ?? ""
const smsFrom = process.env.TWILIO_SMS_FROM ?? ""

export async function sendWhatsApp(to: string, message: string) {
  if (!accountSid || !authToken || !whatsappFrom) {
    console.log(`[TWILIO] Simulated WhatsApp to ${to}: ${message.slice(0, 60)}...`)
    return
  }
  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    new URLSearchParams({ From: `whatsapp:${whatsappFrom}`, To: `whatsapp:${to}`, Body: message }),
    { auth: { username: accountSid, password: authToken } }
  )
}

export async function sendSMS(to: string, message: string) {
  if (!accountSid || !authToken || !smsFrom) {
    console.log(`[TWILIO] Simulated SMS to ${to}: ${message.slice(0, 60)}...`)
    return
  }
  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    new URLSearchParams({ From: smsFrom, To: to, Body: message }),
    { auth: { username: accountSid, password: authToken } }
  )
}
