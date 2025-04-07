"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Smile, MessageCircle, Users, ChevronDown, ChevronUp, Lock, Trash, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useRouter } from "next/navigation"

interface ChatMessage {
  id: string
  userId: string
  userName: string
  userInitials: string
  text: string
  timestamp: string | Date
  type?: "private" | "group"
  recipientId?: string
}

export function ChatPopup() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [chatSettings, setChatSettings] = useState({ enabled: true, coinsRequired: 500 })

  // محاكاة رسائل الدردشة الجماعية
  const mockMessages: ChatMessage[] = [
    {
      id: "1",
      userId: "user1",
      userName: "أحمد علي",
      userInitials: "أع",
      text: "مرحباً بالجميع في غرفة الدردشة!",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      userId: "user2",
      userName: "سارة محمد",
      userInitials: "سم",
      text: "مرحباً أحمد، كيف حالك اليوم؟",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      userId: "user3",
      userName: "محمد إبراهيم",
      userInitials: "مإ",
      text: "هل شاهد أحد العرض الجديد على الموقع؟",
      timestamp: new Date(Date.now() - 3400000),
    },
    {
      id: "4",
      userId: "user1",
      userName: "أحمد علي",
      userInitials: "أع",
      text: "نعم، إنه رائع! حصلت على 200 كوينز من خلاله.",
      timestamp: new Date(Date.now() - 3300000),
    },
  ]

  // إضافة مستمع لتحديث حالة تسجيل الدخول
  useEffect(() => {
    // التحقق الأولي من حالة تسجيل الدخول
    checkLoginStatus()

    // إضافة مستمع للتخزين المحلي لمراقبة تغييرات تسجيل الدخول
    const handleStorageChange = () => {
      checkLoginStatus()
    }

    window.addEventListener("storage", handleStorageChange)

    // إضافة مستمع مخصص للتحديثات داخل نفس النافذة
    const checkLoginInterval = setInterval(checkLoginStatus, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(checkLoginInterval)
    }
  }, [])

  // التحقق من حالة تسجيل الدخول
  const checkLoginStatus = () => {
    try {
      // تحميل إعدادات الدردشة
      const storedChatSettings = localStorage.getItem("chatSettings")
      if (storedChatSettings) {
        const settings = JSON.parse(storedChatSettings)
        setChatSettings({
          enabled: settings.enabled !== false,
          coinsRequired: settings.coinsRequired || 500,
        })
      }

      // التحقق من بيانات المستخدم
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUser(user)
        setIsLoggedIn(true)

        // التحقق من دور المستخدم (أدمن أم لا)
        const userRole = user.role || "user"
        setIsAdmin(userRole === "admin")

        // التحقق من امتلاك العملات المطلوبة (للمستخدمين العاديين فقط)
        const userCoins = user.coins || 0
        setHasAccess(userRole === "admin" || userCoins >= chatSettings.coinsRequired)
      } else {
        setIsLoggedIn(false)
        setHasAccess(false)
        setIsAdmin(false)
        setCurrentUser(null)
      }
    } catch (err) {
      console.error("Error checking login status:", err)
      setIsLoggedIn(false)
    }
  }

  // تحميل الرسائل
  // Update the loadMessages function to fetch from the API
  const loadMessages = async () => {
    try {
      const response = await fetch("/api/messages?type=group&limit=50")
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      const data = await response.json()
      if (data.success) {
        // تحويل التواريخ النصية إلى كائنات Date
        const messagesWithDates = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        return messagesWithDates
      } else {
        throw new Error(data.message || "Failed to fetch messages")
      }
    } catch (e) {
      console.error("Error loading messages:", e)
      return []
    }
  }

  // Update the handleSendMessage function to use the API
  const handleSendMessage = async (message: Omit<ChatMessage, "id" | "timestamp">) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...message,
          type: "group",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      return data.success
    } catch (e) {
      console.error("Error sending message:", e)
      return false
    }
  }

  // Replace the loadMessages function in the component with this
  const loadMessagesFromServer = async () => {
    try {
      const messagesData = await loadMessages()
      if (messagesData && messagesData.length > 0) {
        setMessages(messagesData)
      } else {
        // If no messages are returned, use mock messages
        setMessages(mockMessages)
      }
    } catch (e) {
      console.error("Error loading messages:", e)
      setMessages(mockMessages)
    }
  }

  // Replace the useEffect for loading messages with this
  useEffect(() => {
    loadMessagesFromServer()

    // تحديث الرسائل كل 5 ثوانٍ
    const messageInterval = setInterval(loadMessagesFromServer, 5000)

    // محاكاة عدد المستخدمين المتصلين
    setOnlineUsers(Math.floor(Math.random() * 10) + 5)

    return () => {
      clearInterval(messageInterval)
    }
  }, [])

  // حفظ الرسائل في localStorage عند تغييرها
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("groupChatMessages", JSON.stringify(messages))
    }
  }, [messages])

  // تمرير للأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Replace the handleSendMessage function in the component with this
  const handleSendMessageClick = async () => {
    if (!newMessage.trim() || !currentUser || !hasAccess) return

    const userInitials = `${currentUser.firstName?.charAt(0) || ""}${
      currentUser.lastName?.charAt(0) || ""
    }`.toUpperCase()

    const messageData = {
      userId: currentUser.id || "current",
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userInitials,
      text: newMessage,
      type: "group" as const,
    }

    // Optimistically update UI
    const tempMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, tempMessage])
    setNewMessage("")

    // Send to server
    const success = await handleSendMessage(messageData)

    if (!success) {
      // If failed, you could show an error or retry
      console.error("Failed to send message to server")
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    setDeleteMessageId(messageId)
    setShowDeleteDialog(true)
  }

  const confirmDeleteMessage = () => {
    if (deleteMessageId) {
      setMessages((prev) => prev.filter((msg) => msg.id !== deleteMessageId))
      setShowDeleteDialog(false)
      setDeleteMessageId(null)
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prev) => prev + emoji.native)
    setShowEmojiPicker(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
  }

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
      // تحديث البيانات عند فتح الدردشة
      checkLoginStatus()
      loadMessagesFromServer()
    } else {
      if (isMinimized) {
        setIsMinimized(false)
      } else {
        setIsMinimized(true)
      }
    }
  }

  const closeChat = () => {
    setIsOpen(false)
  }

  const navigateToLogin = () => {
    router.push("/login")
    closeChat()
  }

  // التحقق من حالة تسجيل الدخول قبل عرض المحتوى
  console.log("Login Status:", { isLoggedIn, hasAccess, isAdmin, user: currentUser })

  return (
    <>
      {/* أيقونة الدردشة في الزاوية السفلية */}
      <div className="fixed bottom-4 left-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleChat}
                className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg"
              >
                <MessageCircle className="h-6 w-6" />
                {!isOpen && onlineUsers > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {onlineUsers}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>الدردشة الجماعية</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* نافذة الدردشة المنبثقة */}
      {isOpen && (
        <div
          className={`fixed bottom-20 left-4 z-50 w-80 md:w-96 rounded-lg shadow-xl bg-background border transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[500px]"
          }`}
        >
          {/* رأس نافذة الدردشة */}
          <div className="flex items-center justify-between p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-500" />
              <div>
                <span className="font-medium">الدردشة الجماعية</span>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                  <span>{onlineUsers} متصل الآن</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isAdmin && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 text-xs">
                  مشرف
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* محتوى نافذة الدردشة */}
          {!isMinimized && (
            <>
              {!isLoggedIn ? (
                // رسالة للمستخدمين غير المسجلين
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <LogIn className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">سجل دخولك لتتمكن من الدردشة</h3>
                  <p className="text-muted-foreground mb-6">يجب عليك تسجيل الدخول أولاً للمشاركة في الدردشة الجماعية</p>
                  <Button onClick={navigateToLogin} className="bg-emerald-500 hover:bg-emerald-600">
                    تسجيل الدخول
                  </Button>
                </div>
              ) : hasAccess ? (
                <>
                  {/* منطقة الرسائل */}
                  <ScrollArea className="h-[calc(100%-7rem)] p-3">
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-2 group">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-emerald-100 text-emerald-800">
                              {msg.userInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{msg.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(new Date(msg.timestamp))}
                                </span>
                              </div>
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                >
                                  <Trash className="h-3 w-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <div className="bg-muted/30 rounded-md p-2 mt-1 text-sm">{msg.text}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* منطقة إدخال الرسالة */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-background">
                    <div className="flex items-center gap-2">
                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none" align="start" side="top">
                          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" locale="ar" />
                        </PopoverContent>
                      </Popover>

                      <Input
                        placeholder="اكتب رسالتك هنا..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessageClick()
                          }
                        }}
                        className="flex-1"
                      />

                      <Button
                        onClick={handleSendMessageClick}
                        size="icon"
                        className="h-8 w-8 bg-emerald-500 hover:bg-emerald-600 rounded-full"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                // رسالة عدم الوصول للمستخدمين الذين لا يملكون العملات المطلوبة
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">الدردشة محدودة</h3>
                  <p className="text-muted-foreground mb-4">
                    يجب أن تمتلك {chatSettings.coinsRequired} كوينز على الأقل للمشاركة في الدردشة الجماعية
                  </p>
                  <Badge variant="outline" className="bg-muted/30">
                    رصيدك الحالي: {currentUser?.coins || 0} كوينز
                  </Badge>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* مربع حوار تأكيد حذف الرسالة */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الرسالة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage} className="bg-red-500 hover:bg-red-600">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

