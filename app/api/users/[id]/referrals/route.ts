import { NextResponse } from "next/server"
import { getUserReferrals } from "@/lib/models/referral"

// الحصول على إحالات مستخدم محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const referrals = await getUserReferrals(params.id)

    return NextResponse.json({ success: true, referrals })
  } catch (error) {
    console.error("Error fetching referrals:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

