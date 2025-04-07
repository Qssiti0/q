import { NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/models/user"

// دالة تسجيل الدخول
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // البحث عن المستخدم بواسطة البريد الإلكتروني
    const user = await getUserByEmail(email)

    // التحقق من وجود المستخدم وصحة كلمة المرور
    if (user && user.password === password) {
      // في تطبيق حقيقي، استخدم bcrypt للتحقق من كلمة المرور
      // إنشاء جلسة بسيطة (في تطبيق حقيقي، استخدم JWT أو NextAuth)
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          coins: user.coins,
          referralCode: user.referralCode,
        },
      })
    }

    // إذا فشلت عملية تسجيل الدخول
    return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

