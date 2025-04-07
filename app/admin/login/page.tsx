"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    if (isLoggedIn) {
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // التحقق المباشر من بيانات الدخول (في تطبيق حقيقي، يجب أن يتم هذا على الخادم)
    if (email === "qssitiabdo@gmail.com" && password === "Qssiti") {
      // تخزين حالة تسجيل الدخول في localStorage
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem(
        "adminUser",
        JSON.stringify({ email: "qssitiabdo@gmail.com", role: "admin", fullAccess: true }),
      )

      // الانتقال إلى لوحة التحكم
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 500)
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Shield className="h-10 w-10 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold">لوحة تحكم المسؤول</CardTitle>
          <CardDescription>أدخل بيانات الدخول للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني"
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
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>البريد الإلكتروني: qssitiabdo@gmail.com</p>
              <p>كلمة المرور: Qssiti</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

