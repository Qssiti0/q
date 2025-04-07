import { NextResponse } from "next/server"
import { getOfferById, updateOffer, deleteOffer } from "@/lib/models/offer"

// الحصول على عرض محدد
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const offer = await getOfferById(params.id)

    if (!offer) {
      return NextResponse.json({ success: false, message: "العرض غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, offer })
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// تحديث عرض (للمسؤولين فقط)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const updatedOffer = await updateOffer(params.id, body)

    if (!updatedOffer) {
      return NextResponse.json({ success: false, message: "العرض غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true, offer: updatedOffer })
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// حذف عرض (للمسؤولين فقط)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const success = await deleteOffer(params.id)

    if (!success) {
      return NextResponse.json({ success: false, message: "العرض غير موجود" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

