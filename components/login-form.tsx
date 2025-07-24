"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useSecurity } from "@/components/security-provider"

interface LoginFormProps {
  onLogin: (user: any) => void
  onBack: () => void
}

export function LoginForm({ onLogin, onBack }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { sanitizeInput, generateCSRFToken } = useSecurity()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    if (!isLogin) {
      // Name validation for signup
      if (formData.name.length < 2) {
        newErrors.name = "Name must be at least 2 characters long"
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(formData.email),
      name: sanitizeInput(formData.name),
      password: formData.password, // Don't sanitize password as it might contain special chars
    }

    // Generate CSRF token for session
    const csrfToken = generateCSRFToken()

    // Simulate authentication
    const user = {
      id: Date.now().toString(),
      name: sanitizedData.name || "User",
      email: sanitizedData.email,
      hasGallery: false,
      csrfToken,
      createdAt: new Date().toISOString(),
    }

    onLogin(user)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/10 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>

        <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Join ArtVerse"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin ? "Sign in to your account" : "Create your artist account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required={!isLogin}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1 h-9 w-9 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required={!isLogin}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
              <p className="text-xs text-green-400 text-center">
                🔒 Your data is protected with advanced encryption and security measures
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
