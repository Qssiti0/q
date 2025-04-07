import { redis, generateId } from "../redis"
import { getUserById, updateUser } from "./user"
import { createTransaction } from "./transaction"

export interface WithdrawalRequest {
  id: string
  userId: string
  amount: number
  coins: number
  method: string
  details: string
  status: "pending" | "completed" | "rejected"
  requestDate: string
  processedDate?: string
}

export async function createWithdrawalRequest(
  withdrawalData: Omit<WithdrawalRequest, "id" | "requestDate" | "status">,
): Promise<WithdrawalRequest | { error: string }> {
  // التحقق من أن المستخدم لديه عملات كافية
  const user = await getUserById(withdrawalData.userId)
  if (!user) return { error: "المستخدم غير موجود" }

  if (user.coins < withdrawalData.coins) {
    return { error: "رصيد العملات غير كافٍ" }
  }

  const id = generateId()
  const now = new Date().toISOString()

  const withdrawal: WithdrawalRequest = {
    id,
    ...withdrawalData,
    status: "pending",
    requestDate: now,
  }

  // تخزين طلب السحب في Redis
  await redis.hset(`withdrawal:${id}`, withdrawal)

  // إضافة طلب السحب إلى قائمة طلبات المستخدم
  await redis.sadd(`user:${withdrawalData.userId}:withdrawals`, id)

  // إضافة طلب السحب إلى قائمة الطلبات المعلقة
  await redis.sadd("pending_withdrawals", id)

  // خصم العملات من رصيد المستخدم
  await updateUser(user.id, { coins: user.coins - withdrawalData.coins })

  // إنشاء معاملة للسحب
  await createTransaction({
    userId: withdrawalData.userId,
    type: "withdrawal",
    amount: -withdrawalData.coins, // قيمة سالبة لأنها سحب
    status: "pending",
    details: `طلب سحب: ${withdrawalData.method} - ${withdrawalData.amount}$`,
    relatedId: id,
  })

  return withdrawal
}

export async function getWithdrawalById(id: string): Promise<WithdrawalRequest | null> {
  const withdrawal = await redis.hgetall(`withdrawal:${id}`)
  return Object.keys(withdrawal).length > 0 ? (withdrawal as unknown as WithdrawalRequest) : null
}

export async function updateWithdrawalStatus(
  id: string,
  status: "completed" | "rejected",
  adminId: string,
): Promise<WithdrawalRequest | null> {
  const withdrawal = await getWithdrawalById(id)
  if (!withdrawal || withdrawal.status !== "pending") return null

  const now = new Date().toISOString()
  const updatedWithdrawal = {
    ...withdrawal,
    status,
    processedDate: now,
  }

  await redis.hset(`withdrawal:${id}`, updatedWithdrawal)

  // إزالة الطلب من قائمة الطلبات المعلقة
  await redis.srem("pending_withdrawals", id)

  // إذا تم رفض الطلب، أعد العملات إلى رصيد المستخدم
  if (status === "rejected") {
    const user = await getUserById(withdrawal.userId)
    if (user) {
      await updateUser(user.id, { coins: user.coins + withdrawal.coins })

      // إنشاء معاملة لإعادة العملات
      await createTransaction({
        userId: withdrawal.userId,
        type: "admin_adjustment",
        amount: withdrawal.coins,
        status: "completed",
        details: `إعادة عملات من طلب سحب مرفوض: ${id}`,
        relatedId: id,
      })
    }
  }

  // تحديث حالة معاملة السحب
  const transactionIds = await redis.smembers(`user:${withdrawal.userId}:transactions`)
  for (const transId of transactionIds) {
    const transaction = await redis.hgetall(`transaction:${transId}`)
    if (transaction && transaction.relatedId === id) {
      await redis.hset(`transaction:${transId}`, {
        ...transaction,
        status: status === "completed" ? "completed" : "rejected",
      })
      break
    }
  }

  return updatedWithdrawal
}

export async function getUserWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
  const withdrawalIds = await redis.smembers(`user:${userId}:withdrawals`)

  const withdrawals: WithdrawalRequest[] = []
  for (const id of withdrawalIds) {
    const withdrawal = await getWithdrawalById(id)
    if (withdrawal) {
      withdrawals.push(withdrawal)
    }
  }

  return withdrawals
}

export async function getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
  const withdrawalIds = await redis.smembers("pending_withdrawals")

  const withdrawals: WithdrawalRequest[] = []
  for (const id of withdrawalIds) {
    const withdrawal = await getWithdrawalById(id)
    if (withdrawal) {
      withdrawals.push(withdrawal)
    }
  }

  return withdrawals
}

