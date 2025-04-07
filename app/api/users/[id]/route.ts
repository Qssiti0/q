import { NextResponse } from "next/server"
import { getUserById, updateUser } from "@/lib/models/user"

// الحصول على معلومات مستخدم محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const user = await getUserById(params.id)

    if (!user) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود" }, { status: 404 })
    }

    // لا ترسل كلمة المرور في الاستجابة
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// تحديث معلومات مستخدم
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    // لا تسمح بتحديث الدور مباشرة (يجب أن يكون هناك طريقة منفصلة لذلك)
    const { role, password, ...updateData } = body

    const updatedUser = await updateUser(params.id, updateData)

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود" }, { status: 404 })
    }

    // لا ترسل كلمة المرور في الاستجابة
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

