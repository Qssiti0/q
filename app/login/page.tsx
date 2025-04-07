"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // التحقق من وجود رسالة نجاح التسجيل
    if (searchParams?.get("registered") === "true") {
      setSuccessMessage("تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // إرسال بيانات تسجيل الدخول إلى API
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // تسجيل الدخول بنجاح
        localStorage.setItem("currentUser", JSON.stringify(data.user))
        localStorage.setItem("userLoggedIn", "true")
        router.push("/")
      } else {
        // فشل تسجيل الدخول
        setError(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة")
      }
    } catch (err) {
      console.error("Error during login:", err)
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Coins className="h-8 w-8 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول إلى CoinRewards</CardTitle>
          <CardDescription>أدخل بيانات حسابك للوصول إلى منصة العروض</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                placeholder="example@mail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link href="/forgot-password" className="text-sm text-emerald-500 hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
            <div className="text-center text-sm">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-emerald-500 hover:underline">
                إنشاء حساب جديد
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

