import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Phone number is required"),
  country: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(6, "Phone number is required"),
  countryOfResidence: z.string().min(2, "Country is required"),
  serviceType: z.string().min(1, "Please select a service"),
  budget: z.string().optional(),
  priority: z.string().default("MEDIUM"),
  message: z.string().min(10, "Please provide at least 10 characters"),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide at least 10 characters"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type ContactInput = z.infer<typeof contactSchema>
