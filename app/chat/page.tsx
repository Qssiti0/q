"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Smile, User, Paperclip, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Message {
  id: string
  senderId: number
  senderName: string
  text: string
  timestamp: string
}

interface ChatUser {
  id: number
  name: string
  avatar?: string
  status: "online" | "offline"
  lastSeen?: string
  unreadCount?: number
}

// Add these new functions for API interaction at the top of the file
const fetchMessages = async (userId: number) => {
  try {
    // For a real app, this would fetch private messages between users
    // For now, we'll just return the mock data
    return messages[userId] || []
  }
  \
}

const sendMessage = async (message: Omit<Message, "id" | "timestamp">) => {
  try {
    // For a real app, this would send the message to the server
    // For now, we'll just return a success status
    return true
  }
}

export default function ChatPage() {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // محاكاة المستخدمين للدردشة
  const [users, setUsers] = useState<ChatUser[]>([
    { id: 1, name: "أحمد علي", status: "online", unreadCount: 3 },
    { id: 2, name: "سارة محمد", status: "offline", lastSeen: "منذ 3 ساعات" },
    { id: 3, name: "محمد إبراهيم", status: "online" },
    { id: 4, name: "فاطمة أحمد", status: "offline", lastSeen: "منذ يوم" },
    { id: 5, name: "عمر خالد", status: "online" },
  ])

  // محاكاة رسائل الدردشة
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      {
        id: "1",
        senderId: 1,
        senderName: "أحمد علي",
        text: "مرحبا! كيف حالك؟",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "2",
        senderId: 0,
        senderName: "أنا",
        text: "مرحبا أحمد! أنا بخير، وأنت؟",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: "3",
        senderId: 1,
        senderName: "أحمد علي",
        text: "بخير الحمدلله. هل انتهيت من المشروع؟",
        timestamp: new Date(Date.now() - 3200000).toISOString(),
      },
    ],
    2: [
      {
        id: "1",
        senderId: 2,
        senderName: "سارة محمد",
        text: "هل يمكنك مساعدتي في شيء ما؟",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    3: [
      {
        id: "1",
        senderId: 3,
        senderName: "محمد إبراهيم",
        text: "مرحبا، شكرا على المساعدة بالأمس",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "2",
        senderId: 0,
        senderName: "أنا",
        text: "أهلا محمد، لا شكر على واجب",
        timestamp: new Date(Date.now() - 169200000).toISOString(),
      },
    ],
  })

  // التحقق من تسجيل الدخول وجلب بيانات المستخدم
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"

    if (!userLoggedIn) {
      router.push("/login?redirect=/chat")
      return
    }

    try {
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setCurrentUser(JSON.parse(userData))
      }
      setIsLoading(false)
    } catch (err) {
      console.error("Error loading user data:", err)
      setIsLoading(false)
    }
  }, [router])

  // تمرير الصفحة إلى آخر رسالة عند تغيير المحادثة النشطة أو إضافة رسائل جديدة
  useEffect(() => {
    scrollToBottom()
  }, [activeChat, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // إرسال رسالة جديدة
  // Update the handleSendMessage function to use the API
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    const newMessageObj: Message = {
      id: Date.now().toString(),
      senderId: 0, // المستخدم الحالي
      senderName: "أنا",
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    // إضافة الرسالة إلى المحادثة النشطة
    setMessages((prev) => {
      const updatedMessages = { ...prev }
      if (!updatedMessages[activeChat.id]) {
        updatedMessages[activeChat.id] = []
      }
      updatedMessages[activeChat.id] = [...updatedMessages[activeChat.id], newMessageObj]
      return updatedMessages
    })

    // إعادة تعيين حقل الرسالة الجديدة
    setNewMessage("")

    // في تطبيق حقيقي، هنا ستقوم بإرسال الرسالة إلى الخادم
    // sendMessage({
    //   senderId: currentUser.id,
    //   senderName: currentUser.name,
    //   text: newMessage,
    //   recipientId: activeChat.id.toString(),
    //   type: "private"
    // })
  }

  // إضافة إيموجي للرسالة
  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "الأمس"
    } else if (diffInDays < 7) {
      return new Intl.DateTimeFormat("ar-SA", { weekday: "long" }).format(date)
    } else {
      return date.toLocaleDateString("ar-SA")
    }
  }

  // استخراج الإنشيال (الحرف الأول) من اسم المستخدم
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
          <div className="text-xl font-semibold">الدردشة</div>
          <div></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* قائمة المستخدمين */}
        <div className="w-80 border-r bg-muted/10 hidden md:block">
          <div className="p-4 border-b">
            <Input placeholder="بحث عن مستخدم..." className="bg-background" />
          </div>
          <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="p-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat?.id === user.id ? "bg-muted/60" : "hover:bg-muted/30"
                  }`}
                  onClick={() => setActiveChat(user)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        user.status === "online" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{user.name}</span>
                      {messages[user.id]?.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(messages[user.id][messages[user.id].length - 1].timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground truncate">
                        {messages[user.id]?.length > 0
                          ? messages[user.id][messages[user.id].length - 1].text
                          : user.status === "online"
                            ? "متصل الآن"
                            : user.lastSeen}
                      </span>
                      {user.unreadCount && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                          {user.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* شريط المستخدمين للجوال */}
        <div className="md:hidden w-full border-b">
          <ScrollArea className="whitespace-nowrap py-2">
            <div className="flex gap-2 px-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-colors min-w-16 ${
                    activeChat?.id === user.id ? "bg-muted/60" : ""
                  }`}
                  onClick={() => setActiveChat(user)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        user.status === "online" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    {user.unreadCount && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs truncate max-w-16">{user.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* منطقة المحادثة */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* رأس المحادثة */}
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(activeChat.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{activeChat.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {activeChat.status === "online" ? "متصل الآن" : activeChat.lastSeen}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* رسائل المحادثة */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages[activeChat.id]?.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 0 ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.senderId === 0
                            ? "bg-emerald-500 text-white rounded-l-lg rounded-tr-lg"
                            : "bg-muted rounded-r-lg rounded-tl-lg"
                        } p-3`}
                      >
                        <div>
                          {message.senderId !== 0 && (
                            <div className="font-medium text-xs mb-1">{message.senderName}</div>
                          )}
                          <p>{message.text}</p>
                          <div className="text-xs opacity-70 mt-1 text-left">{formatDate(message.timestamp)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* مربع إدخال الرسالة */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none" align="end">
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" locale="ar" />
                    </PopoverContent>
                  </Popover>

                  <div className="flex-1">
                    <Input
                      placeholder="اكتب رسالتك هنا..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    className="bg-emerald-500 hover:bg-emerald-600 rounded-full h-10 w-10 p-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">اختر محادثة للبدء</h3>
              <p className="text-muted-foreground text-center max-w-xs">
                اختر أحد جهات الاتصال من القائمة الجانبية لبدء محادثة جديدة
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

