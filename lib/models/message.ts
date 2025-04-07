import { redis, generateId } from "@/lib/redis"

export interface Message {
  id: string
  userId: string
  userName: string
  userInitials: string
  text: string
  timestamp: string
  type: "private" | "group" // لتحديد نوع الرسالة (خاصة أو جماعية)
  recipientId?: string // معرف المستلم في حالة الرسائل الخاصة
}

// مفتاح Redis للرسائل الجماعية
const GROUP_MESSAGES_KEY = "chat:group:messages"

// مفتاح Redis للرسائل الخاصة (يتم إنشاؤه ديناميكيًا)
const getPrivateMessagesKey = (userId1: string, userId2: string) => {
  // ترتيب المعرفات لضمان استخدام نفس المفتاح بغض النظر عن ترتيب المستخدمين
  const sortedIds = [userId1, userId2].sort()
  return `chat:private:messages:${sortedIds[0]}:${sortedIds[1]}`
}

// إنشاء رسالة جديدة
export async function createMessage(messageData: Omit<Message, "id" | "timestamp">): Promise<Message> {
  const id = generateId()
  const timestamp = new Date().toISOString()

  const message: Message = {
    id,
    ...messageData,
    timestamp,
  }

  // تحديد المفتاح بناءً على نوع الرسالة
  const key =
    message.type === "group" ? GROUP_MESSAGES_KEY : getPrivateMessagesKey(message.userId, message.recipientId!)

  // إضافة الرسالة إلى القائمة في Redis
  await redis.lpush(key, JSON.stringify(message))

  // الاحتفاظ بآخر 500 رسالة فقط لكل محادثة
  await redis.ltrim(key, 0, 499)

  return message
}

// الحصول على الرسائل الجماعية
export async function getGroupMessages(limit = 50): Promise<Message[]> {
  const messagesData = await redis.lrange(GROUP_MESSAGES_KEY, 0, limit - 1)

  // تحويل البيانات المخزنة إلى كائنات رسائل
  const messages: Message[] = messagesData.map((msg) => JSON.parse(msg))

  // ترتيب الرسائل من الأقدم إلى الأحدث
  return messages.reverse()
}

// الحصول على الرسائل الخاصة بين مستخدمين
export async function getPrivateMessages(userId1: string, userId2: string, limit = 50): Promise<Message[]> {
  const key = getPrivateMessagesKey(userId1, userId2)
  const messagesData = await redis.lrange(key, 0, limit - 1)

  // تحويل البيانات المخزنة إلى كائنات رسائل
  const messages: Message[] = messagesData.map((msg) => JSON.parse(msg))

  // ترتيب الرسائل من الأقدم إلى الأحدث
  return messages.reverse()
}

// حذف رسالة محددة
export async function deleteMessage(
  messageId: string,
  type: "private" | "group",
  userId1?: string,
  userId2?: string,
): Promise<boolean> {
  try {
    // تحديد المفتاح بناءً على نوع الرسالة
    const key = type === "group" ? GROUP_MESSAGES_KEY : getPrivateMessagesKey(userId1!, userId2!)

    // الحصول على جميع الرسائل
    const messagesData = await redis.lrange(key, 0, -1)

    // البحث عن الرسالة المطلوبة وحذفها
    for (let i = 0; i < messagesData.length; i++) {
      const message = JSON.parse(messagesData[i])
      if (message.id === messageId) {
        // حذف الرسالة من القائمة
        await redis.lrem(key, 1, messagesData[i])
        return true
      }
    }

    return false
  } catch (error) {
    console.error("Error deleting message:", error)
    return false
  }
}

// حذف جميع الرسائل الجماعية
export async function deleteAllGroupMessages(): Promise<boolean> {
  try {
    await redis.del(GROUP_MESSAGES_KEY)
    return true
  } catch (error) {
    console.error("Error deleting all group messages:", error)
    return false
  }
}

