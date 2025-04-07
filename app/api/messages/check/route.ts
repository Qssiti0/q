import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

// هذا المسار API يقوم بجلب البيانات مباشرة من Redis للتحقق
export async function GET() {
  try {
    // جلب الرسائل الجماعية من Redis
    const GROUP_MESSAGES_KEY = "chat:group:messages"
    const messagesData = await redis.lrange(GROUP_MESSAGES_KEY, 0, -1)

    // عدد الرسائل في Redis
    const messageCount = messagesData.length

    // عينة من الرسائل (أحدث 5 رسائل)
    const recentMessages = messagesData.slice(0, 5).map((msg) => JSON.parse(msg))

    // إرجاع البيانات للتحقق
    return NextResponse.json({
      success: true,
      source: "Redis Database",
      messageCount,
      recentMessages,
    })
  } catch (error) {
    console.error("Error checking Redis data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء التحقق من بيانات Redis",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

