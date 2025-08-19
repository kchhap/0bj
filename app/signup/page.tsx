"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState<string[]>(new Array(6).fill("")) // State for 6 individual code digits
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]) // Refs for each input field
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError(null)

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      })

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setPendingVerification(true)
    } catch (err: any) {
      console.error("Sign-up error:", err)
      setError(err.errors?.[0]?.longMessage || "An error occurred during sign-up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError(null)

    try {
      const fullCode = code.join("") // Join the 6 digits to form the full code
      const result = await signUp.attemptEmailAddressVerification({ code: fullCode })
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/") // Redirect to home page after successful verification
      } else {
        console.log(result)
        setError("Verification failed. Please try again.")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.errors?.[0]?.longMessage || "Invalid verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle input for each code box
  const handleCodeInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target
    // Only allow single digit or empty string
    if (!/^\d?$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Move focus to next input if a digit was entered and it's not the last input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste event for code boxes
  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const paste = e.clipboardData.getData("text")
    if (!/^\d{6}$/.test(paste)) return // Ensure pasted content is 6 digits

    const newCode = paste.split("")
    setCode(newCode)

    // Move focus to the last input after pasting
    codeInputRefs.current[5]?.focus()
  }

  // Handle backspace and arrow keys for code boxes
  const handleCodeKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // If backspace is pressed and current input is empty, move to previous
      codeInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      codeInputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {pendingVerification ? "Verification" : "Create your account"}
          </CardTitle>
          {!pendingVerification && (
            <CardDescription>Create your account to start generating 3D models.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="first-name" className="flex items-baseline justify-between">
                    First name <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="last-name" className="flex items-baseline justify-between">
                    Last name <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-0 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {/* Clerk CAPTCHA element */}
              <div id="clerk-captcha" className="mt-4" />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Continuing...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-gray-600">
                A verification code has been sent to your email address. Please enter it below.
              </p>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInputChange(e, index)}
                    onKeyDown={(e) => handleCodeKeyDown(e, index)}
                    onPaste={handleCodePaste}
                    ref={(el) => (codeInputRefs.current[index] = el)}
                    className="w-10 text-center text-lg font-bold"
                    disabled={loading}
                  />
                ))}
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Continuing...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-black hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
