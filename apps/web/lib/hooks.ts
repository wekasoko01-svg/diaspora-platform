"use client"

import { useState, useCallback, startTransition } from "react"
import { apiFetch } from "./api"
import type { ApiResponse } from "@diaspora/shared"

export function useMutation<TData, TResponse = unknown>() {
  const [data, setData] = useState<TResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(async (path: string, body: TData, options?: RequestInit): Promise<TResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch<ApiResponse<TResponse>>(path, {
        method: "POST",
        body: JSON.stringify(body),
        ...options,
      })
      if (res.data) setData(res.data)
      return res.data ?? null
    } catch (err: any) {
      const msg = err.message ?? "Something went wrong"
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { mutate, data, error, loading, setError }
}

export function useFetch<TData>() {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (path: string, options?: RequestInit) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFetch<ApiResponse<TData>>(path, options)
      if (res.data) setData(res.data)
      return res.data ?? null
    } catch (err: any) {
      setError(err.message ?? "Failed to load")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, error, loading, fetch, setData, setError }
}
