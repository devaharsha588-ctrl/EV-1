import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

import type { ApiErrorResponse } from "@/types/api.types"

function getApiBaseUrl(): string {
  let envUrl = import.meta.env.VITE_API_BASE_URL || ""

  const isBrowser = typeof window !== "undefined"
  const isVercel = isBrowser && window.location.hostname.includes("vercel.app")

  // Fallback to production Render backend if deployed on Vercel without custom URL or pointing to localhost
  if (isVercel && (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
    envUrl = "https://ev-ai-backend.onrender.com/api/v1"
  }

  // Ensure /api/v1 suffix is present for non-empty URLs
  if (envUrl && !envUrl.endsWith("/api/v1") && !envUrl.endsWith("/api/v1/")) {
    envUrl = envUrl.replace(/\/+$/, "") + "/api/v1"
  }

  return envUrl
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60_000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrl()
  }
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
