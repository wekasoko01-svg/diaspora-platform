import axios from "axios"

const consumerKey = process.env.MPESA_CONSUMER_KEY ?? ""
const consumerSecret = process.env.MPESA_CONSUMER_SECRET ?? ""
const passkey = process.env.MPESA_PASSKEY ?? ""
const shortCode = process.env.MPESA_SHORTCODE ?? "174379"
const env = process.env.MPESA_ENV ?? "sandbox"
const callbackUrl = process.env.MPESA_CALLBACK_URL ?? ""

const baseURL = env === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke"

let accessToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
  const { data } = await axios.get(`${baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return accessToken!
}

export async function initiateSTKPush(phone: string, amount: number, reference: string, description: string) {
  if (!consumerKey || !consumerSecret) {
    console.log(`[MPESA] Simulated STK Push to ${phone}: KES ${amount} (${reference})`)
    return { CheckoutRequestID: `sim_${Date.now()}`, ResponseCode: "0", ResponseDescription: "Simulated success" }
  }
  const token = await getToken()
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64")
  const { data } = await axios.post(
    `${baseURL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phone.replace(/[^0-9]/g, ""),
      PartyB: shortCode,
      PhoneNumber: phone.replace(/[^0-9]/g, ""),
      CallBackURL: callbackUrl,
      AccountReference: reference,
      TransactionDesc: description,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return data
}

export async function queryStatus(checkoutRequestId: string) {
  if (!consumerKey || !consumerSecret) return "SIMULATED_SUCCESS"
  const token = await getToken()
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14)
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64")
  const { data } = await axios.post(
    `${baseURL}/mpesa/stkpushquery/v1/query`,
    { BusinessShortCode: shortCode, Password: password, Timestamp: timestamp, CheckoutRequestID: checkoutRequestId },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return data.ResultCode === "0" ? "PAID" : "FAILED"
}
