"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { UserMessages } from "@/components/user-messages"

export default function MessagesPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // التحقق من تسجيل الدخول وجلب بيانات المستخدم
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"

    if (!userLoggedIn) {
      router.push("/login?redirect=/messages")
      return
    }

    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setCurrentUser(JSON.parse(userData))
      }
      setIsLoading(false)
    } catch (err) {
      console.error("Error loading user data:", err)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <UserMessages userId={currentUser.id} />
    </div>
  )
}

