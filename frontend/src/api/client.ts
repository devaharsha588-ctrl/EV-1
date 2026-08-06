import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

import type { ApiErrorResponse } from "@/types/api.types"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ""

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("ev_access_token") || localStorage.getItem("sb-uzfbmhtiivwjbbwklhwr-auth-token")
  if (token) {
    try {
      const parsed = typeof token === "string" && token.startsWith("{") ? JSON.parse(token) : null
      const bearer = parsed?.access_token || parsed?.accessToken || token
      if (bearer) {
        config.headers.Authorization = `Bearer ${bearer}`
      }
    } catch {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Handle unauthorized responses by clearing tokens if needed
    }
    return Promise.reject(error)
  },
)
