import { NextResponse } from "next/server"
import { createTransaction, getUserTransactions } from "@/lib/models/transaction"

// إنشاء معاملة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const transaction = await createTransaction({
      userId: body.userId,
      type: body.type,
      amount: body.amount,
      status: body.status,
      details: body.details,
      relatedId: body.relatedId,
    })

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// الحصول على جميع المعاملات (للمسؤولين فقط)
export async function GET(request: Request) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const transactions = await getUserTransactions(userId)
      return NextResponse.json({ success: true, transactions })
    }

    // في تطبيق حقيقي، هنا ستقوم بجلب جميع المعاملات للمسؤولين
    return NextResponse.json({ success: false, message: "يجب تحديد معرف المستخدم" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

