import { NextResponse } from "next/server"
import { updateWithdrawalStatus } from "@/lib/models/withdrawal"

// تحديث حالة طلب سحب (للمسؤولين فقط)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا
    const adminId = body.adminId

    if (!adminId) {
      return NextResponse.json({ success: false, message: "معرف المسؤول مطلوب" }, { status: 400 })
    }

    if (!["completed", "rejected"].includes(body.status)) {
      return NextResponse.json({ success: false, message: "حالة غير صالحة" }, { status: 400 })
    }

    const updatedWithdrawal = await updateWithdrawalStatus(params.id, body.status as "completed" | "rejected", adminId)

    if (!updatedWithdrawal) {
      return NextResponse.json({ success: false, message: "طلب السحب غير موجود أو تم معالجته بالفعل" }, { status: 404 })
    }

    return NextResponse.json({ success: true, withdrawal: updatedWithdrawal })
  } catch (error) {
    console.error("Error updating withdrawal status:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

