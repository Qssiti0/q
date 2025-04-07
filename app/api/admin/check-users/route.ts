import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    // الحصول على جميع مفاتيح المستخدمين
    const keys = await redis.keys("user:*")
    const userKeys = keys.filter((key) => key.startsWith("user:") && !key.includes("email:"))

    const users = []
    for (const key of userKeys) {
      const user = await redis.hgetall(key)
      if (Object.keys(user).length > 0) {
        users.push(user)
      }
    }

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        success: false,
        message: "فشل في جلب المستخدمين",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

