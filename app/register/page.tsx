"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Coins } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [detailedError, setDetailedError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDetailedError("")

    // التحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    try {
      console.log("Sending registration request with data:", { username, email })

      // إرسال بيانات التسجيل إلى API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (response.ok) {
        // تم التسجيل بنجاح
        router.push("/login?registered=true")
      } else {
        // فشل التسجيل
        setError(data.message || "حدث خطأ أثناء التسجيل")
        if (data.error) {
          setDetailedError(data.error)
        }
      }
    } catch (err) {
      console.error("Error during registration:", err)
      setError("حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.")
      if (err instanceof Error) {
        setDetailedError(err.message)
      }
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
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription>أدخل بياناتك لإنشاء حساب في منصة CoinRewards</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
                {detailedError && <div className="mt-2 text-xs opacity-80">تفاصيل الخطأ: {detailedError}</div>}
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label
                htmlFor="terms"
                className="mr-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                أوافق على{" "}
                <Link href="/terms" className="text-emerald-500 hover:underline">
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-emerald-500 hover:underline">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
            <div className="text-center text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-emerald-500 hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

