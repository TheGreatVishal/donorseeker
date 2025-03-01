"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {

        console.log("Sending otp to email: ", email);
        
      const response = await fetch("/api/auth/forgot-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");

      setSuccess("OTP sent successfully to your email");
      setStep(2);
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong. Please try again.");
  }
} finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    console.log("Verifying otp: ", otp);
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");

      setSuccess("OTP verified successfully");
      setStep(3);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
     finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    console.log("Updating password....");
    
    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update password");

      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong. Please try again.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-white">
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center text-gray-200">
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Enter the verification code sent to your email"}
            {step === 3 && "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="bg-red-100 text-red-800 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-100 text-green-800 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              <Button onClick={handleSendOtp} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading} />
              <Button onClick={handleVerifyOtp} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
              <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
              <Button onClick={handleUpdatePassword} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-white hover:text-gray-200">Back to Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
}