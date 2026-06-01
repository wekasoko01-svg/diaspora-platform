import { z } from "zod"

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  country: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const bookingSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  countryOfResidence: z.string().min(2),
  serviceType: z.enum([
    "LAND_VERIFICATION", "CONSTRUCTION_MONITORING", "VEHICLE_INSPECTION",
    "RELOCATION_SUPPORT", "FAMILY_SUPPORT", "FRAUD_PREVENTION",
    "DOCUMENT_FACILITATION", "CONSULTATION",
  ]),
  budget: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  timeline: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const requestSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().datetime().optional(),
})

export const paymentSchema = z.object({
  bookingId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default("KES"),
  method: z.enum(["MPESA", "BANK_TRANSFER", "CARD", "CASH"]).optional(),
  reference: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
})
