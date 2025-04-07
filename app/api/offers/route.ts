import { NextResponse } from "next/server"
import { getAllOffers, createOffer } from "@/lib/models/offer"

// الحصول على جميع العروض
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    const offers = await getAllOffers(activeOnly)

    return NextResponse.json({ success: true, offers })
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// إنشاء عرض جديد (للمسؤولين فقط)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const newOffer = await createOffer({
      title: body.title,
      description: body.description,
      coins: body.coins,
      provider: body.provider,
      imageUrl: body.imageUrl,
      requirements: body.requirements,
      category: body.category,
      isActive: body.isActive ?? true,
    })

    return NextResponse.json({ success: true, offer: newOffer })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

