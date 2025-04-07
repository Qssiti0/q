import { NextResponse } from "next/server"
import { checkRedisConnection } from "@/lib/redis"

export async function GET() {
  try {
    const isConnected = await checkRedisConnection()

    return NextResponse.json({
      status: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

