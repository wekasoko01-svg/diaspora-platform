export type Role = "GUEST" | "CLIENT" | "STAFF" | "ADMIN" | "FOUNDER"

export type BookingStatus = "NEW" | "PENDING_REVIEW" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export type RequestStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED" | "CANCELLED"

export type PaymentStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "REFUNDED" | "FAILED"

export type PaymentMethod = "MPESA" | "BANK_TRANSFER" | "CARD" | "CASH"

export type ServiceType = "LAND_VERIFICATION" | "CONSTRUCTION_MONITORING" | "VEHICLE_INSPECTION" | "RELOCATION_SUPPORT" | "FAMILY_SUPPORT" | "FRAUD_PREVENTION" | "DOCUMENT_FACILITATION" | "CONSULTATION"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}

export interface AuthPayload {
  userId: string
  role: Role
}

export interface BookingInput {
  fullName: string
  email: string
  phone: string
  countryOfResidence: string
  serviceType: ServiceType
  budget: string
  priority: RequestPriority
  timeline: string
  message: string
}

export interface RequestInput {
  title: string
  description: string
  priority: RequestPriority
  dueDate?: string
}
