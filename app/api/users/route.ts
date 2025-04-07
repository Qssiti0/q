import { NextResponse } from "next/server"
import { getAllUsers, createUser } from "@/lib/models/user"

// الحصول على قائمة المستخدمين
export async function GET(request: Request) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const users = await getAllUsers()

    // لا ترسل كلمات المرور في الاستجابة
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({ success: true, users: usersWithoutPasswords })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم", error: String(error) }, { status: 500 })
  }
}

// إنشاء مستخدم جديد
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, firstName, lastName, coins, status, role } = body

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    // التحقق من وجود الحقول المطلوبة
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: "الحقول المطلوبة مفقودة" }, { status: 400 })
    }

    // إنشاء المستخدم الجديد
    const newUser = await createUser({
      username,
      email,
      password, // في تطبيق حقيقي، قم بتشفير كلمة المرور
      role: role || "user",
      coins: coins || 0,
      firstName,
      lastName,
    })

    // لا ترسل كلمة المرور في الاستجابة
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم", error: String(error) }, { status: 500 })
  }
}

