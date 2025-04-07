import { redis, generateId } from "../redis"
import { createTransaction } from "./transaction"

export interface Referral {
  id: string
  referrerId: string
  referredUserId: string
  status: "pending" | "active"
  joinedDate: string
  earnings: number
}

export async function createReferral(referrerId: string, referredUserId: string): Promise<Referral> {
  const id = generateId()
  const now = new Date().toISOString()

  const referral: Referral = {
    id,
    referrerId,
    referredUserId,
    status: "pending",
    joinedDate: now,
    earnings: 0,
  }

  // تخزين الإحالة في Redis
  await redis.hset(`referral:${id}`, referral)

  // إضافة الإحالة إلى قائمة إحالات المستخدم
  await redis.sadd(`user:${referrerId}:referrals`, id)

  // تخزين معلومات من قام بالإحالة للمستخدم الجديد
  await redis.set(`user:${referredUserId}:referred_by`, referrerId)

  return referral
}

export async function getReferralById(id: string): Promise<Referral | null> {
  const referral = await redis.hgetall(`referral:${id}`)
  return Object.keys(referral).length > 0 ? (referral as unknown as Referral) : null
}

export async function updateReferralStatus(id: string, status: "pending" | "active"): Promise<Referral | null> {
  const referral = await getReferralById(id)
  if (!referral) return null

  const updatedReferral = { ...referral, status }
  await redis.hset(`referral:${id}`, updatedReferral)

  return updatedReferral
}

export async function getUserReferrals(userId: string): Promise<Referral[]> {
  const referralIds = await redis.smembers(`user:${userId}:referrals`)

  const referrals: Referral[] = []
  for (const id of referralIds) {
    const referral = await getReferralById(id)
    if (referral) {
      referrals.push(referral)
    }
  }

  return referrals
}

export async function addReferralEarnings(referralId: string, amount: number): Promise<Referral | null> {
  const referral = await getReferralById(referralId)
  if (!referral || referral.status !== "active") return null

  // تحديث أرباح الإحالة
  const newEarnings = referral.earnings + amount
  const updatedReferral = { ...referral, earnings: newEarnings }
  await redis.hset(`referral:${referralId}`, updatedReferral)

  // إنشاء معاملة لمكافأة الإحالة
  await createTransaction({
    userId: referral.referrerId,
    type: "referral_bonus",
    amount,
    status: "completed",
    details: `مكافأة إحالة من المستخدم ${referral.referredUserId}`,
    relatedId: referralId,
  })

  return updatedReferral
}

