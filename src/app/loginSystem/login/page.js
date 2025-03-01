"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Heart, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})
	const [errorMessage, setErrorMessage] = useState("") // Renamed from error to errorMessage
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)

		const { email, password } = formData
		// console.log("Trying login for Email",email, password);
		
		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			})

			// alert(`Result: ${JSON.stringify(result)}`);

			// console.log("Result",JSON.stringify(result))
			if (result?.error) {
				setErrorMessage(result.error)
			} else {
				router.push("/home")
			}
		} catch (err) {
			// console.error("Error occurred:", err);
			setErrorMessage("An unexpected error occurred");
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-indigo-50 p-4">
			<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-rose-400 to-indigo-500 rounded-b-[30%] opacity-80" />

			<Card className="w-full max-w-md relative z-10 border-none shadow-xl bg-white/90 backdrop-blur-sm">
				<div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-lg">
					<div className="bg-gradient-to-r from-rose-500 to-indigo-500 p-3 rounded-full">
						<Heart className="h-6 w-6 text-white" />
					</div>
				</div>

				<CardHeader className="pt-10">
					<CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-rose-500 to-indigo-500 text-transparent bg-clip-text">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-center bg-gradient-to-r from-rose-500 to-indigo-500 text-transparent bg-clip-text">
						Sign in to your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					{errorMessage && (
						<Alert className="mb-6 border-rose-200 bg-rose-50">
							<AlertDescription className="text-rose-700">{errorMessage}</AlertDescription>
						</Alert>
					)}

					{searchParams.get("registered") === "true" && (
						<Alert className="mb-6 border-green-200 bg-green-50">
							<AlertDescription className="text-green-700">
								Registration successful! Please sign in with your credentials.
							</AlertDescription>
						</Alert>
					)}

					<motion.form
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium">
								Email
							</Label>
							<div className="relative">
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="john@example.com"
									value={formData.email}
									onChange={handleChange}
									required
									className="pl-10 py-6 bg-indigo-50/50 border-indigo-100 focus:border-indigo-300 text-indigo-700"
								/>
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={formData.password}
									onChange={handleChange}
									required
									className="pl-10 py-6 bg-rose-50/50 border-rose-100 focus:border-rose-300 text-indigo-700"
								/>
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-400" />
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<Eye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full py-6 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 transition-all duration-300"
							disabled={isLoading}
						>
							{isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
						</Button>
					</motion.form>
				</CardContent>

				<CardFooter className="flex flex-col items-center gap-4 pb-6">
					<Link
						href="/forgot-password"
						className="text-sm text-muted-foreground text-black hover:text-indigo-600 transition-colors"
					>
						Forgot your password?
					</Link>
					<p className="text-sm text-muted-foreground bg-gradient-to-r from-rose-500 to-indigo-500 text-transparent bg-clip-text">
						Do not have an account?{" "}
						<Link
							href="/loginSystem/signup"
							className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500 hover:underline"
						>
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	)
}