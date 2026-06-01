import { Request, Response } from "express"
import * as authService from "../services/auth"

function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export async function register(req: Request, res: Response) {
  try {
    const result = await authService.register(req.body)
    setTokenCookie(res, result.token)
    res.status(201).json({ success: true, data: result.user })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    setTokenCookie(res, result.token)
    res.json({ success: true, data: result.user })
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message })
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token")
  res.json({ success: true, message: "Logged out" })
}

export function me(req: Request, res: Response) {
  res.json({ success: true, data: req.user })
}

export async function verifyEmailHandler(req: Request, res: Response) {
  try {
    const result = await authService.verifyEmail(req.query.token as string)
    res.json({ success: true, message: result.message })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const result = await authService.forgotPassword(req.body.email)
    res.json({ success: true, message: result.message })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { token, password } = req.body
    const result = await authService.resetPassword(token, password)
    res.json({ success: true, message: result.message })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}

export async function resendVerificationHandler(req: Request, res: Response) {
  try {
    const result = await authService.resendVerification(req.body.email)
    res.json({ success: true, message: result.message })
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message })
  }
}
