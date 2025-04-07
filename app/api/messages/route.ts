import { NextResponse } from "next/server"
import { createMessage, getGroupMessages, deleteMessage, deleteAllGroupMessages } from "@/lib/models/message"

// إنشاء رسالة جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    const message = await createMessage({
      userId: body.userId,
      userName: body.userName,
      userInitials: body.userInitials,
      text: body.text,
      type: body.type || "group",
      recipientId: body.recipientId,
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// الحصول على الرسائل
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "group"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا

    if (type === "group") {
      const messages = await getGroupMessages(limit)
      return NextResponse.json({ success: true, messages })
    } else if (type === "private") {
      const userId1 = searchParams.get("userId1")
      const userId2 = searchParams.get("userId2")

      if (!userId1 || !userId2) {
        return NextResponse.json(
          { success: false, message: "يجب تحديد معرفات المستخدمين للرسائل الخاصة" },
          { status: 400 },
        )
      }

      // في تطبيق حقيقي، هنا ستقوم بجلب الرسائل الخاصة
      return NextResponse.json({ success: true, messages: [] })
    }

    return NextResponse.json({ success: false, message: "نوع الرسائل غير صالح" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

// حذف رسالة
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get("id")
    const type = searchParams.get("type") || "group"

    // في تطبيق حقيقي، تحقق من صلاحيات المستخدم هنا (يجب أن يكون مسؤولاً)

    if (!messageId) {
      return NextResponse.json({ success: false, message: "يجب تحديد معرف الرسالة" }, { status: 400 })
    }

    if (messageId === "all" && type === "group") {
      const success = await deleteAllGroupMessages()
      return NextResponse.json({ success })
    }

    const userId1 = searchParams.get("userId1")
    const userId2 = searchParams.get("userId2")

    const success = await deleteMessage(
      messageId,
      type as "private" | "group",
      userId1 || undefined,
      userId2 || undefined,
    )

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ success: false, message: "حدث خطأ في المخدم" }, { status: 500 })
  }
}

