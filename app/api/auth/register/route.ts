import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/models/user"
import { checkRedisConnection } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    // التحقق من اتصال Redis
    const isConnected = await checkRedisConnection()
    if (!isConnected) {
      console.error("Redis connection failed")
      return NextResponse.json({ success: false, message: "فشل الاتصال بقاعدة البيانات" }, { status: 500 })
    }

    const body = await request.json()
    const { username, email, password } = body

    // التحقق من وجود جميع الحقول المطلوبة
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: "جميع الحقول مطلوبة" }, { status: 400 })
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "البريد الإلكتروني غير صالح" }, { status: 400 })
    }

    // التحقق من وجود المستخدم بالفعل
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "البريد الإلكتروني مسجل بالفعل" }, { status: 400 })
    }

    // إنشاء مستخدم جديد
    const newUser = await createUser({
      username,
      email,
      password, // في تطبيق حقيقي، يجب تشفير كلمة المرور
      role: "user",
      coins: 0,
    })

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء إنشاء الحساب",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

