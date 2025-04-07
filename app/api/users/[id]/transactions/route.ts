import { NextResponse } from "next/server"
import { getUserTransactions } from "@/lib/models/transaction"

// الحصول على معاملات مستخدم محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const transactions = await getUserTransactions(params.id)

    return NextResponse.json({ success: true, transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

