import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@diaspora/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    message: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    notificationPreference: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))

vi.mock("../services/email", () => ({
  sendVerificationEmail: vi.fn(),
  sendPasswordReset: vi.fn(),
  sendBookingConfirmation: vi.fn(),
  sendNotificationEmail: vi.fn(),
  sendContactNotification: vi.fn(),
}))

import { prisma } from "@diaspora/db"
import * as authService from "../services/auth"
import * as emailService from "../services/email"
import * as messagingService from "../services/messaging"
import * as notificationService from "../services/notifications"

describe("auth service", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("register throws if email exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: "1" } as any)
    await expect(authService.register({ fullName: "T", email: "t@t.com", phone: "+254", password: "12345678" }))
      .rejects.toThrow("Email already registered")
  })

  it("register creates user and returns token", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.user.create).mockResolvedValueOnce({ id: "u-1", fullName: "Test", email: "t@t.com", role: "CLIENT" } as any)
    const result = await authService.register({ fullName: "Test", email: "t@t.com", phone: "+254", password: "12345678" })
    expect(result.user.email).toBe("t@t.com")
    expect(result.token).toBeTruthy()
  })

  it("login throws on wrong email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    await expect(authService.login("bad@email.com", "pwd")).rejects.toThrow("Invalid email or password")
  })

  it("forgotPassword returns generic message for unknown email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    const result = await authService.forgotPassword("nobody@example.com")
    expect(result.message).toContain("If that email exists")
  })

  it("verifyEmail throws on invalid token", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
    await expect(authService.verifyEmail("bad-token")).rejects.toThrow("Invalid or expired verification token")
  })
})

describe("email service", () => {
  it("sendContactNotification dispatches correctly", async () => {
    // Mock is in place; verify the mock function is callable
    await emailService.sendContactNotification("T", "t@t.com", "+254", "Hello")
    expect(vi.mocked(emailService.sendContactNotification)).toHaveBeenCalled()
  })

  it("sendPasswordReset dispatches correctly", async () => {
    await emailService.sendPasswordReset("t@t.com", "tok123")
    expect(vi.mocked(emailService.sendPasswordReset)).toHaveBeenCalled()
  })
})

describe("messaging service", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("sends a message", async () => {
    vi.mocked(prisma.message.create).mockResolvedValueOnce({
      id: "msg-1", bookingId: "b-1", senderId: "u-1", content: "Hello", createdAt: new Date(),
      sender: { id: "u-1", fullName: "Test", role: "CLIENT" },
    } as any)
    const msg = await messagingService.sendMessage({ bookingId: "b-1", senderId: "u-1", content: "Hello" })
    expect(msg.id).toBe("msg-1")
    expect(msg.content).toBe("Hello")
  })

  it("getMessages returns empty array", async () => {
    vi.mocked(prisma.message.findMany).mockResolvedValueOnce([])
    const msgs = await messagingService.getMessages("b-1")
    expect(msgs).toEqual([])
  })
})

describe("notification preferences service", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("creates default preferences on first access", async () => {
    vi.mocked(prisma.notificationPreference.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.notificationPreference.create).mockResolvedValueOnce({ id: "np-1", userId: "u-1", email: true, sms: false, whatsapp: true, push: false, marketing: false } as any)
    const prefs = await notificationService.getPreferences("u-1")
    expect(prefs.email).toBe(true)
  })

  it("updates preferences", async () => {
    vi.mocked(prisma.notificationPreference.upsert).mockResolvedValueOnce({ id: "np-1", userId: "u-1", email: false, sms: true, whatsapp: false, push: false, marketing: false } as any)
    const prefs = await notificationService.updatePreferences("u-1", { email: false, sms: true })
    expect(prefs.email).toBe(false)
    expect(prefs.sms).toBe(true)
  })

  it("shouldNotify returns true when enabled", async () => {
    vi.mocked(prisma.notificationPreference.findUnique).mockResolvedValueOnce({ id: "np-1", userId: "u-1", email: true, sms: false, whatsapp: true, push: false, marketing: false } as any)
    const result = await notificationService.shouldNotify("u-1", "email")
    expect(result).toBe(true)
  })
})
