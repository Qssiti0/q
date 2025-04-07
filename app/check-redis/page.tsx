"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function CheckRedisPage() {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected" | "error">("loading")
  const [message, setMessage] = useState("")
  const [isChecking, setIsChecking] = useState(false)

  const checkRedisConnection = async () => {
    setIsChecking(true)
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/check-redis")
      const data = await response.json()

      if (data.success) {
        setStatus(data.connected ? "connected" : "disconnected")
      } else {
        setStatus("error")
      }

      setMessage(data.message)

      if (data.error) {
        setMessage(`${data.message}: ${data.error}`)
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "حدث خطأ غير معروف")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkRedisConnection()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">فحص اتصال Redis</CardTitle>
          <CardDescription>التحقق من اتصال قاعدة البيانات Redis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <Alert>
              <AlertDescription>جاري التحقق من الاتصال...</AlertDescription>
            </Alert>
          )}

          {status === "connected" && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>تم الاتصال بنجاح بقاعدة البيانات Redis</AlertDescription>
            </Alert>
          )}

          {status === "disconnected" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>فشل الاتصال بقاعدة البيانات Redis</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>حدث خطأ: {message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={checkRedisConnection} disabled={isChecking} className="w-full">
            {isChecking ? "جاري الفحص..." : "إعادة الفحص"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

