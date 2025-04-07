import { redis, generateId } from "../redis"

export interface User {
  id: string
  username: string
  email: string
  password: string // في تطبيق حقيقي، يجب تشفير كلمات المرور
  role: "user" | "admin"
  coins: number
  createdAt: string
  referralCode: string
  referredBy?: string
}

export async function createUser(userData: Omit<User, "id" | "createdAt" | "referralCode">): Promise<User> {
  try {
    const id = generateId()
    const now = new Date().toISOString()
    const referralCode = generateId().substring(0, 8)

    const user: User = {
      id,
      ...userData,
      createdAt: now,
      referralCode,
      coins: 0,
    }

    // تخزين المستخدم في Redis
    await redis.hset(`user:${id}`, user)

    // إضافة المستخدم إلى فهرس البريد الإلكتروني للبحث السريع
    await redis.set(`user:email:${userData.email}`, id)

    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error(`فشل في إنشاء المستخدم: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const userId = await redis.get(`user:email:${email}`)
    if (!userId) return null

    return getUserById(userId as string)
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await redis.hgetall(`user:${id}`)
    return Object.keys(user).length > 0 ? (user as unknown as User) : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    const user = await getUserById(id)
    if (!user) return null

    const updatedUser = { ...user, ...data }
    await redis.hset(`user:${id}`, updatedUser)

    return updatedUser
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function getAllUsers(limit = 100, offset = 0): Promise<User[]> {
  try {
    // هذه طريقة مبسطة، في تطبيق حقيقي قد تحتاج إلى استراتيجية أكثر تعقيدًا
    const keys = await redis.keys("user:*")
    const userKeys = keys.filter((key) => key.startsWith("user:") && !key.includes("email:"))

    const paginatedKeys = userKeys.slice(offset, offset + limit)

    const users: User[] = []
    for (const key of paginatedKeys) {
      const user = await redis.hgetall(key)
      if (Object.keys(user).length > 0) {
        users.push(user as unknown as User)
      }
    }

    return users
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

