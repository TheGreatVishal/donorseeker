"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Lock, Phone, Key, Heart, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { checkUsernameAvailability, sendOTP, verifyAdminKeyRequest } from "./actions"

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    contact: z
      .string()
      .min(7, "Contact number must be at least 7 characters")
      .max(15, "Contact number must not exceed 15 characters"),
    isAdmin: z.boolean().default(false),
    adminKey: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => !(data.isAdmin && (!data.adminKey || data.adminKey.length === 0)), {
    message: "Admin key is required for admin registration",
    path: ["adminKey"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [adminKeyVerified, setAdminKeyVerified] = useState(false)
  const [verifyingAdminKey, setVerifyingAdminKey] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const usernameTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    // getValues,
    formState: { errors, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      isAdmin: false,
    },
    mode: "onChange",
  })

  const isAdmin = watch("isAdmin")
  const adminKey = watch("adminKey")
  const username = watch("username")
  const watchedEmail = watch("email")

  // Check username availability when user types
  useEffect(() => {
    if (usernameTimeoutRef.current) {
      clearTimeout(usernameTimeoutRef.current)
    }

    if (username && username.length >= 3 && !errors.username) {
      setCheckingUsername(true)
      usernameTimeoutRef.current = setTimeout(async () => {
        try {
          const isAvailable = await checkUsernameAvailability(username)
          setUsernameAvailable(isAvailable)
        } catch (err) {
          console.error("Error checking username:", err)
          setUsernameAvailable(null)
        } finally {
          setCheckingUsername(false)
        }
      }, 500)
    } else {
      setUsernameAvailable(null)
    }

    return () => {
      if (usernameTimeoutRef.current) {
        clearTimeout(usernameTimeoutRef.current)
      }
    }
  }, [username, errors.username])

  // Validate email format
  useEffect(() => {
    if (watchedEmail) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      // Start at beginning of string or line
      // Include all characters except @ until the @ sign
      // Include the @ sign
      // Include all characters except @ after the @ sign until the full stop
      // Include all characters except @ after the full stop
      // Stop at the end of the string or line

      setEmailValid(emailPattern.test(watchedEmail))
    } else {
      setEmailValid(null)
    }
  }, [watchedEmail])

  const handleSendOtp = async () => {
	if (!emailValid || !watchedEmail) {
	  console.error("Invalid email or empty email:", watchedEmail);
	  return;
	}
  
	console.log("(sign up page) Sending OTP for email:", watchedEmail); // Debugging log
  
	setSendingOtp(true);
	setError(null);
  
	try {
	  const result = await sendOTP(watchedEmail);
	  if (result.success) {
		setOtpSent(true);
	  } else {
		throw new Error(result.error || "Failed to send OTP");
	  }
	} catch (err) {
	  setError(err instanceof Error ? err.message : "Failed to send OTP");
	  setOtpSent(false);
	} finally {
	  setSendingOtp(false);
	}
  };
  

  const verifyAdminKey = async () => {
    if (!adminKey || adminKey.length === 0) return

    setVerifyingAdminKey(true)
    setError(null)

    try {
      const result = await verifyAdminKeyRequest(adminKey)
      setAdminKeyVerified(result.success)
      if (!result.success) {
        throw new Error(result.error || "Invalid admin key")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify admin key")
      setAdminKeyVerified(false)
    } finally {
      setVerifyingAdminKey(false)
    }
  }

  const onSubmit = async (data: SignupFormValues) => {
    if (data.isAdmin && !adminKeyVerified) {
      setError("Please verify your admin key first")
      return
    }

    if (!usernameAvailable) {
      setError("Username is already taken")
      return
    }

    if (!otpSent) {
      setError("Please send OTP to your email first")
      return
    }

    if (!otp || otp.length === 0) {
      setError("Please enter the verification code sent to your email")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Verify OTP
      const verifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          otp,
        }),
      })

      const verifyResult = await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(verifyResult.error || "OTP verification failed")
      }

      // Register user after OTP verification
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          contact: data.contact,
          isAdmin: data.isAdmin,
          otp: data.otp,
          adminKey: data.adminKey,
        }),
      })

      const registerResult = await registerResponse.json()

      if (!registerResponse.ok) {
        throw new Error(registerResult.error || "Registration failed")
      }

      // Redirect to login page after successful registration
      router.push("/loginSystem/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-indigo-50 p-4">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-rose-400 to-indigo-500 rounded-b-[30%] opacity-80" />

      <Card className="w-full max-w-md relative z-10 border-none shadow-xl bg-white/90 backdrop-blur-sm mt-10">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-lg">
          <div className="bg-gradient-to-r from-rose-500 to-indigo-500 p-3 rounded-full">
            <Heart className="h-6 w-6 text-white" />
          </div>
        </div>

        <CardHeader className="pt-10">
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-rose-500 to-indigo-500 text-transparent bg-clip-text">
            Join Donor Seeker
          </CardTitle>
          <CardDescription className="text-center bg-gradient-to-r from-rose-500 to-indigo-500 text-transparent bg-clip-text">
            Create an account to connect with donors and those in need
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-6 border-rose-200 bg-rose-50">
              <AlertDescription className="text-rose-700">{error}</AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="johndoe"
                    {...register("username")}
                    className={`pl-10 py-6 text-black ${
                      usernameAvailable === false
                        ? "bg-rose-50/50 border-rose-300 focus:border-rose-500"
                        : "bg-rose-50/50 border-rose-100 focus:border-rose-300"
                    }`}
                    onBlur={() => trigger("username")}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-400" />
                  {checkingUsername && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400 animate-spin" />
                  )}
                  {usernameAvailable === true && !checkingUsername && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                  {usernameAvailable === false && !checkingUsername && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-rose-500" />
                  )}
                </div>
                {errors.username && <p className="text-sm text-rose-500 mt-1">{errors.username.message}</p>}
                {usernameAvailable === false && !errors.username && (
                  <p className="text-sm text-rose-500 mt-1">Username already exists</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={`pl-10 py-6 text-black ${
                        emailValid === false
                          ? "bg-rose-50/50 border-rose-300 focus:border-rose-500 text-indigo-700"
                          : "bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 text-indigo-700"
                      }`}
                      onBlur={() => trigger("email")}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
                    {emailValid === true && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {emailValid === false && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-rose-500" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!emailValid || sendingOtp || otpSent}
                    className="bg-indigo-500 hover:bg-indigo-600 py-6 px-4 whitespace-nowrap"
                  >
                    {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? "OTP Sent ✓" : "Send OTP"}
                  </Button>
                </div>
                {errors.email && <p className="text-sm text-rose-500 mt-1">{errors.email.message}</p>}
                {emailValid === false && !errors.email && (
                  <p className="text-sm text-rose-500 mt-1">Please enter a valid email address</p>
                )}
              </div>

              <AnimatePresence>
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <Label htmlFor="otp" className="text-sm font-medium">
                        Verification Code
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="otp"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="pl-10 py-6 bg-white border-indigo-200 focus:border-indigo-400 text-indigo-700"
                        />
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter the verification code sent to your email
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="pl-10 py-6 bg-rose-50/50 border-rose-100 focus:border-rose-300 text-indigo-700"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-400" />
                  </div>
                  {errors.password && <p className="text-sm text-rose-500 mt-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      className= "text-indigo-700 pl-10 py-6 bg-rose-50/50 border-rose-100 focus:border-rose-300 "
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-400"  />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-rose-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">
                  Contact Number
                </Label>
                <div className="relative">
                  <Input
                    id="contact"
                    placeholder="+1234567890"
                    {...register("contact")}
                    className="pl-10 py-6 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 text-indigo-700"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
                </div>
                {errors.contact && <p className="text-sm text-rose-500 mt-1">{errors.contact.message}</p>}
              </div>

              <div className="space-y-3 bg-gradient-to-r from-rose-50 to-indigo-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAdmin" className="text-sm font-medium">
                    Sign up as Admin
                  </Label>
                  <Switch
                    id="isAdmin"
                    checked={isAdmin}
                    onCheckedChange={(checked) => setValue("isAdmin", checked)}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
                <p className="text-xs text-slate-950">
                  Admins have additional privileges to manage the platform
                </p>
              </div>

              <AnimatePresence>
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                      <Label htmlFor="adminKey" className="text-sm font-medium">
                        Admin Key
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="adminKey"
                          type="password"
                          placeholder="Enter admin key"
                          {...register("adminKey")}
                          className="pl-10 py-6 bg-white border-indigo-200 focus:border-indigo-400 text-indigo-700"
                        />
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-500" />
                      </div>
                      {errors.adminKey && <p className="text-sm text-rose-500 mt-1">{errors.adminKey.message}</p>}

                      <div className="mt-3">
                        <Button
                          type="button"
                          onClick={verifyAdminKey}
                          disabled={verifyingAdminKey || !adminKey || adminKey.length === 0}
                          variant="outline"
                          className="w-full border-indigo-200 hover:bg-indigo-100"
                        >
                          {verifyingAdminKey ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : adminKeyVerified ? (
                            "Verified ✓"
                          ) : (
                            "Verify Admin Key"
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 transition-all duration-300"
                disabled={
                  isLoading ||
                  (isAdmin && !adminKeyVerified) ||
                  !isValid ||
                  usernameAvailable === false ||
                  !otpSent ||
                  !otp
                }
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
              </Button>
            </motion.form>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm text-muted-foreground bg-gradient-to-r from-rose-500 to-indigo-500 text-transparent bg-clip-text">
            Already have an account?{" "}
            <Link
              href="/loginSystem/login"
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

