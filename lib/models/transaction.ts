import { redis, generateId } from "../redis"
import { getUserById, updateUser } from "./user"

export interface Transaction {
  id: string
  userId: string
  type: "offer_completion" | "referral_bonus" | "withdrawal" | "admin_adjustment"
  amount: number
  status: "pending" | "completed" | "rejected"
  details: string
  relatedId?: string // معرف العرض أو طلب السحب المرتبط
  createdAt: string
  updatedAt: string
}

export async function createTransaction(
  transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
): Promise<Transaction> {
  const id = generateId()
  const now = new Date().toISOString()

  const transaction: Transaction = {
    id,
    ...transactionData,
    createdAt: now,
    updatedAt: now,
  }

  // تخزين المعاملة في Redis
  await redis.hset(`transaction:${id}`, transaction)

  // إضافة المعاملة إلى قائمة معاملات المستخدم
  await redis.sadd(`user:${transactionData.userId}:transactions`, id)

  // إذا كانت المعاملة مكتملة، قم بتحديث رصيد المستخدم
  if (transaction.status === "completed") {
    const user = await getUserById(transaction.userId)
    if (user) {
      const newCoins = user.coins + transaction.amount
      await updateUser(user.id, { coins: newCoins })
    }
  }

  return transaction
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const transaction = await redis.hgetall(`transaction:${id}`)
  return Object.keys(transaction).length > 0 ? (transaction as unknown as Transaction) : null
}

export async function updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction | null> {
  const transaction = await getTransactionById(id)
  if (!transaction) return null

  const now = new Date().toISOString()
  const updatedTransaction = { ...transaction, ...data, updatedAt: now }

  await redis.hset(`transaction:${id}`, updatedTransaction)

  // إذا تم تغيير الحالة إلى مكتملة، قم بتحديث رصيد المستخدم
  if (data.status === "completed" && transaction.status !== "completed") {
    const user = await getUserById(transaction.userId)
    if (user) {
      const newCoins = user.coins + transaction.amount
      await updateUser(user.id, { coins: newCoins })
    }
  }

  return updatedTransaction
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const transactionIds = await redis.smembers(`user:${userId}:transactions`)

  const transactions: Transaction[] = []
  for (const id of transactionIds) {
    const transaction = await getTransactionById(id)
    if (transaction) {
      transactions.push(transaction)
    }
  }

  return transactions
}

