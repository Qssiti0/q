import { Redis } from "@upstash/redis"
import { v4 as uuidv4 } from "uuid"

// إنشاء اتصال Redis باستخدام متغيرات البيئة
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.REDIS_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// وظيفة لإنشاء معرف فريد
export function generateId(): string {
  return uuidv4()
}

// وظيفة للتحقق من اتصال Redis
export async function checkRedisConnection(): Promise<boolean> {
  try {
    // محاولة تنفيذ أمر بسيط للتحقق من الاتصال
    await redis.ping()
    return true
  } catch (error) {
    console.error("Redis connection error:", error)
    return false
  }
}

