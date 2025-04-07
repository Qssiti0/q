"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, MessageSquare, Clock, CheckCircle, XCircle, Eye, Send, Trash, Edit } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UserMessaging() {
  const [activeTab, setActiveTab] = useState("send")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // محاكاة بيانات المستخدمين
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // سجل الرسائل
  const [messageHistory, setMessageHistory] = useState<any[]>([])

  // رسالة جديدة
  const [newMessage, setNewMessage] = useState({
    recipient: "",
    subject: "",
    content: "",
    sendEmail: true,
    sendNotification: true,
    scheduledDate: "",
  })

  // نص البحث للتصفية
  const [searchText, setSearchText] = useState("")

  // جلب قائمة المستخدمين
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("registeredUsers")
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        setUsers(parsedUsers)
      }
    } catch (err) {
      console.error("Error loading users:", err)
      setUsers([])
    }
  }, [])

  // جلب سجل الرسائل من localStorage
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem("messageHistory")
      if (storedMessages) {
        setMessageHistory(JSON.parse(storedMessages))
      }
    } catch (err) {
      console.error("Error loading message history:", err)
      setMessageHistory([])
    }
  }, [])

  // تصفية تاريخ الرسائل حسب البحث
  const filteredMessages = messageHistory.filter(
    (msg) =>
      msg.recipient.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchText.toLowerCase()),
  )

  // إرسال رسالة جديدة
  const handleSendMessage = () => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      // التحقق من صحة البيانات
      if (!newMessage.recipient) {
        setMessage({ type: "error", text: "يرجى تحديد المستلم" })
        setIsLoading(false)
        return
      }

      if (!newMessage.subject) {
        setMessage({ type: "error", text: "يرجى إدخال عنوان الرسالة" })
        setIsLoading(false)
        return
      }

      if (!newMessage.content) {
        setMessage({ type: "error", text: "يرجى إدخال محتوى الرسالة" })
        setIsLoading(false)
        return
      }

      // محاكاة إرسال الرسالة
      setTimeout(() => {
        const recipient =
          newMessage.recipient === "specific_user"
            ? selectedUser
            : newMessage.recipient === "specific_users"
              ? selectedUsers.join(", ")
              : newMessage.recipient

        // إنشاء رسالة جديدة
        const newMessageObj = {
          id: Math.max(0, ...messageHistory.map((m) => m.id), 0) + 1,
          recipient: recipient,
          subject: newMessage.subject,
          content: newMessage.content,
          status: "delivered",
          timestamp: new Date().toISOString(),
          read: false,
        }

        // إضافة الرسالة إلى السجل
        const updatedMessages = [newMessageObj, ...messageHistory]
        setMessageHistory(updatedMessages)

        // حفظ الرسائل المحدثة في localStorage
        localStorage.setItem("messageHistory", JSON.stringify(updatedMessages))

        // إعادة تعيين نموذج الرسالة
        setNewMessage({
          recipient: "",
          subject: "",
          content: "",
          sendEmail: true,
          sendNotification: true,
          scheduledDate: "",
        })

        setSelectedUsers([])

        // عرض رسالة نجاح
        setMessage({ type: "success", text: "تم إرسال الرسالة بنجاح" })

        // إعادة تعيين حالة التحميل
        setIsLoading(false)

        // إخفاء رسالة النجاح بعد 3 ثوانٍ
        setTimeout(() => setMessage(null), 3000)
      }, 1500)
    } catch (err) {
      console.error("Error sending message:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء إرسال الرسالة" })
      setIsLoading(false)
    }
  }

  // حذف رسالة من السجل
  const handleDeleteMessage = (id: number) => {
    try {
      const updatedMessages = messageHistory.filter((m) => m.id !== id)
      setMessageHistory(updatedMessages)

      // تحديث localStorage
      localStorage.setItem("messageHistory", JSON.stringify(updatedMessages))

      setMessage({ type: "success", text: "تم حذف الرسالة بنجاح" })

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error deleting message:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف الرسالة" })
    }
  }

  // نسخة أكثر أمانًا من setError للاستخدام داخل المكون
  const setError = (text: string) => {
    setMessage({ type: "error", text })
  }

  // نسخة أكثر أمانًا من setSuccess للاستخدام داخل المكون
  const setSuccess = (text: string) => {
    setMessage({ type: "success", text })
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          className={`${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          variant={message.type === "success" ? "default" : "destructive"}
        >
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">
            <Send className="ml-2 h-4 w-4" />
            إرسال رسالة
          </TabsTrigger>
          <TabsTrigger value="history">
            <MessageSquare className="ml-2 h-4 w-4" />
            سجل الرسائل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إرسال رسالة للمستخدمين</CardTitle>
              <CardDescription>إرسال رسائل مخصصة لمستخدم واحد أو مجموعة من المستخدمين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">المستلم</Label>
                <Select
                  value={newMessage.recipient}
                  onValueChange={(value) => setNewMessage({ ...newMessage, recipient: value })}
                >
                  <SelectTrigger id="recipient">
                    <SelectValue placeholder="اختر المستلم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">جميع المستخدمين</SelectItem>
                    <SelectItem value="active_users">المستخدمين النشطين</SelectItem>
                    <SelectItem value="new_users">المستخدمين الجدد</SelectItem>
                    <SelectItem value="specific_user">مستخدم محدد</SelectItem>
                    <SelectItem value="specific_users">مستخدمين محددين</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newMessage.recipient === "specific_user" && (
                <div className="space-y-2">
                  <Label htmlFor="user">اختر المستخدم</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger id="user">
                      <SelectValue placeholder="اختر مستخدم" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.email}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newMessage.recipient === "specific_users" && (
                <div className="space-y-2">
                  <Label>اختر المستخدمين</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          className="ml-2"
                          checked={selectedUsers.includes(user.email)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.email])
                            } else {
                              setSelectedUsers(selectedUsers.filter((email) => email !== user.email))
                            }
                          }}
                        />
                        <Label htmlFor={`user-${user.id}`}>
                          {user.firstName} {user.lastName} ({user.email})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">عنوان الرسالة</Label>
                <Input
                  id="subject"
                  placeholder="أدخل عنوان الرسالة"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">محتوى الرسالة</Label>
                <Textarea
                  id="content"
                  placeholder="أدخل محتوى الرسالة"
                  rows={6}
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                />
              </div>

              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="send-email"
                    checked={newMessage.sendEmail}
                    onCheckedChange={(checked) => setNewMessage({ ...newMessage, sendEmail: checked })}
                  />
                  <Label htmlFor="send-email" className="mr-2">
                    إرسال بريد إلكتروني
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="send-notification"
                    checked={newMessage.sendNotification}
                    onCheckedChange={(checked) => setNewMessage({ ...newMessage, sendNotification: checked })}
                  />
                  <Label htmlFor="send-notification" className="mr-2">
                    إرسال إشعار داخل التطبيق
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled-date">جدولة الإرسال (اختياري)</Label>
                <Input
                  id="scheduled-date"
                  type="datetime-local"
                  value={newMessage.scheduledDate}
                  onChange={(e) => setNewMessage({ ...newMessage, scheduledDate: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">اترك الحقل فارغاً للإرسال الفوري</p>
              </div>
            </CardContent>
            <CardHeader className="flex flex-row items-center justify-end">
              <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">جاري الإرسال...</span>
                    <svg
                      className="animate-spin -mr-1 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    إرسال الرسالة
                  </>
                )}
              </Button>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>سجل الرسائل</CardTitle>
                  <CardDescription>سجل الرسائل المرسلة للمستخدمين</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="بحث..."
                      className="w-full sm:w-64 pl-8"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="تصفية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الرسائل</SelectItem>
                      <SelectItem value="delivered">تم التوصيل</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="failed">فشل الإرسال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستلم</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        لا توجد رسائل مطابقة لبحثك
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell className="font-medium">
                          {msg.recipient === "all_users"
                            ? "جميع المستخدمين"
                            : msg.recipient === "active_users"
                              ? "المستخدمين النشطين"
                              : msg.recipient === "new_users"
                                ? "المستخدمين الجدد"
                                : msg.recipient}
                        </TableCell>
                        <TableCell>{msg.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {msg.status === "pending" && (
                              <span className="flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 ml-1" />
                                قيد الانتظار
                              </span>
                            )}
                            {msg.status === "delivered" && (
                              <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 ml-1" />
                                تم التوصيل
                              </span>
                            )}
                            {msg.status === "failed" && (
                              <span className="flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 ml-1" />
                                فشل الإرسال
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(msg.timestamp).toLocaleString("ar-SA")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setNewMessage({
                                  recipient: "specific_user",
                                  subject: `رد: ${msg.subject}`,
                                  content: "",
                                  sendEmail: true,
                                  sendNotification: true,
                                  scheduledDate: "",
                                })
                                setActiveTab("send")
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 hover:bg-red-100 text-red-600"
                              onClick={() => handleDeleteMessage(msg.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

