import { NextResponse } from "next/server"
import { checkRedisConnection } from "@/lib/redis"

export async function GET() {
  try {
    const isConnected = await checkRedisConnection()

    return NextResponse.json({
      success: true,
      connected: isConnected,
      message: isConnected ? "Redis connection successful" : "Redis connection failed",
    })
  } catch (error) {
    console.error("Redis check error:", error)
    return NextResponse.json(
      {
        success: false,
        connected: false,
        message: "Error checking Redis connection",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

