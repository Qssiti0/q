"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash, Search, RefreshCw, MessageSquare, Settings } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

const fetchMessages = async () => {
  try {
    const response = await fetch("/api/messages?type=group&limit=100")
    if (!response.ok) {
      throw new Error("Failed to fetch messages")
    }
    const data = await response.json()
    if (data.success) {
      // تحويل التواريخ النصية إلى كائنات Date
      return data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    } else {
      throw new Error(data.message || "Failed to fetch messages")
    }
  } catch (e) {
    console.error("Error fetching messages:", e)
    return []
  }
}

const deleteMessageFromServer = async (messageId: string) => {
  try {
    const response = await fetch(`/api/messages?id=${messageId}&type=group`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete message")
    }
    const data = await response.json()
    return data.success
  } catch (e) {
    console.error("Error deleting message:", e)
    return false
  }
}

const deleteAllMessagesFromServer = async () => {
  try {
    const response = await fetch(`/api/messages?id=all&type=group`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete all messages")
    }
    const data = await response.json()
    return data.success
  } catch (e) {
    console.error("Error deleting all messages:", e)
    return false
  }
}

export function ChatManagement() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [chatEnabled, setChatEnabled] = useState(true)
  const [coinRequirement, setCoinRequirement] = useState(500)
  const [isLoading, setIsLoading] = useState(true)

  // تحميل الرسائل من localStorage
  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const messagesData = await fetchMessages()
      setMessages(messagesData)

      // تحميل إعدادات الدردشة
      const chatSettings = localStorage.getItem("chatSettings")
      if (chatSettings) {
        const settings = JSON.parse(chatSettings)
        setChatEnabled(settings.enabled !== undefined ? settings.enabled : true)
        setCoinRequirement(settings.coinsRequired || 500)
      }
    } catch (err) {
      console.error("Error loading chat data:", err)
    }
    setIsLoading(false)
  }

  // حفظ إعدادات الدردشة
  const saveChatSettings = () => {
    try {
      const settings = {
        enabled: chatEnabled,
        coinsRequired: coinRequirement,
      }
      localStorage.setItem("chatSettings", JSON.stringify(settings))
      alert("تم حفظ الإعدادات بنجاح")
    } catch (err) {
      console.error("Error saving chat settings:", err)
      alert("حدث خطأ أثناء حفظ الإعدادات")
    }
  }

  // حذف رسالة محددة
  const handleDeleteMessage = (messageId: string) => {
    setDeleteMessageId(messageId)
    setShowDeleteDialog(true)
  }

  // تأكيد حذف الرسالة
  const confirmDeleteMessage = async () => {
    if (deleteMessageId) {
      const success = await deleteMessageFromServer(deleteMessageId)
      if (success) {
        const updatedMessages = messages.filter((msg) => msg.id !== deleteMessageId)
        setMessages(updatedMessages)
      }
      setShowDeleteDialog(false)
      setDeleteMessageId(null)
    }
  }

  // حذف جميع الرسائل
  const handleDeleteAllMessages = () => {
    setShowDeleteAllDialog(true)
  }

  // تأكيد حذف جميع الرسائل
  const confirmDeleteAllMessages = async () => {
    const success = await deleteAllMessagesFromServer()
    if (success) {
      setMessages([])
    }
    setShowDeleteAllDialog(false)
  }

  // تنسيق التاريخ والوقت
  const formatDateTime = (date: Date) => {
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // تصفية الرسائل حسب البحث
  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase()
    return message.userName.toLowerCase().includes(searchLower) || message.text.toLowerCase().includes(searchLower)
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="messages" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="messages">
          <MessageSquare className="h-4 w-4 mr-2" />
          الرسائل
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4 mr-2" />
          الإعدادات
        </TabsTrigger>
      </TabsList>

      <TabsContent value="messages" className="space-y-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="بحث في الرسائل..."
              className="w-full bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={loadMessages} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash className="h-4 w-4 mr-2" />
                  حذف الكل
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>حذف جميع الرسائل</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من رغبتك في حذف جميع رسائل الدردشة؟ لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDeleteAllMessages} className="bg-red-500 hover:bg-red-600">
                    حذف الكل
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* جدول الرسائل */}
        <Card className="border-dashed">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">رسائل الدردشة</CardTitle>
              <Badge variant="outline" className="bg-muted/30">
                {messages.length} رسالة
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <ScrollArea className="h-[400px]">
              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                  {messages.length === 0 ? <p>لا توجد رسائل في الدردشة</p> : <p>لا توجد رسائل تطابق بحثك</p>}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>الرسالة</TableHead>
                      <TableHead className="hidden md:table-cell">التاريخ والوقت</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.userName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{message.text}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {formatDateTime(message.timestamp)}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف الرسالة</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من رغبتك في حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الدردشة</CardTitle>
            <CardDescription>تحكم في إعدادات الدردشة الجماعية وشروط المشاركة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="chat-enabled">تفعيل الدردشة</Label>
                <p className="text-sm text-muted-foreground">
                  عند إيقاف الدردشة، لن يتمكن المستخدمون من إرسال رسائل جديدة
                </p>
              </div>
              <Switch id="chat-enabled" checked={chatEnabled} onCheckedChange={setChatEnabled} />
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="coins-required">الحد الأدنى من العملات للمشاركة</Label>
                <p className="text-sm text-muted-foreground">
                  عدد العملات المطلوبة للمستخدم للمشاركة في الدردشة (المشرفون معفون من هذا الشرط)
                </p>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Slider
                  id="coins-required"
                  value={[coinRequirement]}
                  min={0}
                  max={2000}
                  step={50}
                  onValueChange={(value) => setCoinRequirement(value[0])}
                  className="flex-1"
                />
                <div className="w-16 text-center font-medium">{coinRequirement}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveChatSettings}>حفظ الإعدادات</Button>
          </CardFooter>
        </Card>
      </TabsContent>

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

      {/* مربع حوار تأكيد حذف جميع الرسائل */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف جميع الرسائل</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من رغبتك في حذف جميع رسائل الدردشة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAllMessages} className="bg-red-500 hover:bg-red-600">
              حذف الكل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}

