"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"

type SecurityContextType = {
  sanitizeInput: (input: string) => string
  validateFileUpload: (file: File) => boolean
  generateCSRFToken: () => string
  validateCSRFToken: (token: string) => boolean
}

const SecurityContext = createContext<SecurityContextType | null>(null)

export function SecurityProvider({ children }: { children: ReactNode }) {
  // Input sanitization to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .replace(/on\w+=/gi, "") // Remove event handlers
      .trim()
      .slice(0, 1000) // Limit input length
  }

  // File upload validation
  const validateFileUpload = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
      return false
    }

    if (file.size > maxSize) {
      alert("File too large. Maximum size is 10MB.")
      return false
    }

    return true
  }

  // CSRF token generation (simplified for demo)
  const generateCSRFToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // CSRF token validation (simplified for demo)
  const validateCSRFToken = (token: string): boolean => {
    // In a real app, this would validate against server-stored tokens
    return token.length > 10
  }

  // Set security headers (in a real app, this would be done server-side)
  useEffect(() => {
    // Content Security Policy simulation
    const meta = document.createElement("meta")
    meta.httpEquiv = "Content-Security-Policy"
    meta.content =
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;"
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  const value = {
    sanitizeInput,
    validateFileUpload,
    generateCSRFToken,
    validateCSRFToken,
  }

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>
}

export function useSecurity() {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error("useSecurity must be used within SecurityProvider")
  }
  return context
}
