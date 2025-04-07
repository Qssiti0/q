import { NextResponse } from "next/server"
import { getUserWithdrawals, createWithdrawalRequest } from "@/lib/models/withdrawal"
import { getUserById } from "@/lib/models/user"

// الحصول على طلبات سحب مستخدم محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const withdrawals = await getUserWithdrawals(params.id)

    return NextResponse.json({ success: true, withdrawals })
  } catch (error) {
    console.error("Error fetching withdrawals:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// إنشاء طلب سحب جديد
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    // التحقق من وجود المستخدم
    const user = await getUserById(params.id)
    if (!user) {
      return NextResponse.json({ success: false, message: "المستخدم غير موجود" }, { status: 404 })
    }

    // إنشاء طلب السحب
    const result = await createWithdrawalRequest({
      userId: params.id,
      amount: body.amount,
      coins: body.coins,
      method: body.method,
      details: body.details,
    })

    if ("error" in result) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, withdrawal: result })
  } catch (error) {
    console.error("Error creating withdrawal request:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

