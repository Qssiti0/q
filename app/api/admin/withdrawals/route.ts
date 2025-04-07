import { NextResponse } from "next/server"
import { getPendingWithdrawals } from "@/lib/models/withdrawal"

// الحصول على جميع طلبات السحب المعلقة (للمسؤولين فقط)
export async function GET(request: Request) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const withdrawals = await getPendingWithdrawals()

    return NextResponse.json({ success: true, withdrawals })
  } catch (error) {
    console.error("Error fetching pending withdrawals:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

