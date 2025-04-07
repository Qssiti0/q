"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Ban, Coins, Search, Trash, Edit, Eye, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email: string
  coins: number
  status: string
  registeredAt: string
  role: string
  password?: string
}

export function UserManagement() {
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"ban" | "coins" | "delete" | "edit" | "view" | "add" | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [coinAmount, setCoinAmount] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    coins: 0,
    status: "Active",
    role: "user",
  })

  // جلب المستخدمين من Redis عند تحميل المكون
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      // محاولة جلب المستخدمين من API
      const response = await fetch("/api/users")

      if (!response.ok) {
        throw new Error(`فشل في جلب المستخدمين: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
      } else {
        throw new Error(data.message || "فشل في جلب المستخدمين")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب المستخدمين")

      // في حالة فشل الاتصال بالـ API، استخدم البيانات المخزنة محلياً
      loadLocalUsers()
    } finally {
      setLoading(false)
    }
  }

  const loadLocalUsers = () => {
    try {
      const storedUsers = localStorage.getItem("registeredUsers")
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      } else {
        // إذا لم يكن هناك مستخدمين، استخدم البيانات الافتراضية
        const defaultUsers = [
          {
            id: "1",
            firstName: "أحمد",
            lastName: "علي",
            username: "ahmed",
            email: "ahmed@example.com",
            coins: 12500,
            status: "Active",
            registeredAt: "2023-05-12",
            role: "user",
          },
          {
            id: "2",
            firstName: "سارة",
            lastName: "خان",
            username: "sara",
            email: "sara@example.com",
            coins: 8750,
            status: "Active",
            registeredAt: "2023-06-18",
            role: "user",
          },
          {
            id: "3",
            firstName: "محمد",
            lastName: "حسن",
            username: "mohammed",
            email: "mohammed@example.com",
            coins: 5200,
            status: "Banned",
            registeredAt: "2023-04-22",
            role: "user",
          },
          {
            id: "4",
            firstName: "فاطمة",
            lastName: "أحمد",
            username: "fatima",
            email: "fatima@example.com",
            coins: 9300,
            status: "Active",
            registeredAt: "2023-07-05",
            role: "user",
          },
          {
            id: "5",
            firstName: "عمر",
            lastName: "خالد",
            username: "omar",
            email: "omar@example.com",
            coins: 3100,
            status: "Active",
            registeredAt: "2023-08-14",
            role: "user",
          },
        ]
        setUsers(defaultUsers)
        localStorage.setItem("registeredUsers", JSON.stringify(defaultUsers))
      }
    } catch (err) {
      console.error("Error loading local users:", err)
      setError("فشل في تحميل المستخدمين المحليين")
    }
  }

  const handleAction = (type: "ban" | "coins" | "delete" | "edit" | "view", user: User) => {
    setDialogType(type)
    setSelectedUser(user)
    setOpenDialog(true)
    setCoinAmount(0) // إعادة تعيين قيمة العملات عند فتح النافذة

    if (type === "edit") {
      // نسخ بيانات المستخدم للتعديل
      setNewUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        password: "",
        coins: user.coins || 0,
        status: user.status || "Active",
        role: user.role || "user",
      })
    }
  }

  const handleAddUser = () => {
    setDialogType("add")
    setSelectedUser(null)
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      coins: 0,
      status: "Active",
      role: "user",
    })
    setOpenDialog(true)
  }

  const handleConfirm = () => {
    if (dialogType === "ban" || dialogType === "delete") {
      handleUserAction()
    } else if (dialogType === "coins") {
      handleUpdateCoins()
    } else if (dialogType === "edit") {
      handleUpdateUser()
    } else if (dialogType === "add") {
      handleCreateUser()
    }
  }

  const handleUserAction = async () => {
    if (!selectedUser) return

    try {
      if (dialogType === "ban") {
        // تحديث حالة المستخدم (حظر/إلغاء حظر)
        const newStatus = selectedUser.status === "Banned" ? "Active" : "Banned"

        // محاولة تحديث المستخدم عبر API
        const response = await fetch(`/api/users/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) {
          throw new Error(`فشل في تحديث حالة المستخدم: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          // تحديث قائمة المستخدمين محلياً
          setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, status: newStatus } : user)))

          setMessage({
            type: "success",
            text: `تم ${newStatus === "Banned" ? "حظر" : "إلغاء حظر"} المستخدم بنجاح`,
          })
        } else {
          throw new Error(data.message || "فشل في تحديث حالة المستخدم")
        }
      } else if (dialogType === "delete") {
        // محاولة حذف المستخدم عبر API
        const response = await fetch(`/api/users/${selectedUser.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error(`فشل في حذف المستخدم: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          // حذف المستخدم من القائمة المحلية
          setUsers(users.filter((user) => user.id !== selectedUser.id))
          setMessage({ type: "success", text: "تم حذف المستخدم بنجاح" })
        } else {
          throw new Error(data.message || "فشل في حذف المستخدم")
        }
      }
    } catch (err) {
      console.error("Error updating user:", err)
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء تحديث بيانات المستخدم",
      })

      // في حالة فشل الاتصال بالـ API، قم بالتحديث محلياً
      if (dialogType === "ban") {
        const updatedUsers = [...users]
        const userIndex = updatedUsers.findIndex((u) => u.id === selectedUser.id)

        if (userIndex !== -1) {
          updatedUsers[userIndex].status = updatedUsers[userIndex].status === "Banned" ? "Active" : "Banned"
          setUsers(updatedUsers)
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        }
      } else if (dialogType === "delete") {
        const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
        setUsers(updatedUsers)
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
      }
    } finally {
      setOpenDialog(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleUpdateCoins = async () => {
    if (!selectedUser) return

    try {
      // محاولة تحديث عملات المستخدم عبر API
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coins: selectedUser.coins + coinAmount,
        }),
      })

      if (!response.ok) {
        throw new Error(`فشل في تحديث عملات المستخدم: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // تحديث قائمة المستخدمين محلياً
        setUsers(
          users.map((user) => (user.id === selectedUser.id ? { ...user, coins: user.coins + coinAmount } : user)),
        )

        setMessage({ type: "success", text: `تم تعديل عملات المستخدم بنجاح` })
      } else {
        throw new Error(data.message || "فشل في تحديث عملات المستخدم")
      }
    } catch (err) {
      console.error("Error updating coins:", err)
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء تحديث عملات المستخدم",
      })

      // في حالة فشل الاتصال بالـ API، قم بالتحديث محلياً
      const updatedUsers = [...users]
      const userIndex = updatedUsers.findIndex((u) => u.id === selectedUser.id)

      if (userIndex !== -1) {
        updatedUsers[userIndex].coins += coinAmount
        if (updatedUsers[userIndex].coins < 0) updatedUsers[userIndex].coins = 0
        setUsers(updatedUsers)
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
      }
    } finally {
      setOpenDialog(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      // إعداد بيانات التحديث
      const updateData: any = {
        email: newUser.email,
        coins: Number.parseInt(newUser.coins.toString()),
        status: newUser.status,
        role: newUser.role,
      }

      // إضافة الاسم الأول والأخير إذا كانا موجودين
      if (newUser.firstName) updateData.firstName = newUser.firstName
      if (newUser.lastName) updateData.lastName = newUser.lastName

      // إضافة كلمة المرور إذا تم تغييرها
      if (newUser.password) updateData.password = newUser.password

      // محاولة تحديث المستخدم عبر API
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error(`فشل في تحديث بيانات المستخدم: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // تحديث قائمة المستخدمين محلياً
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id
              ? {
                  ...user,
                  email: newUser.email,
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                  coins: Number.parseInt(newUser.coins.toString()),
                  status: newUser.status,
                  role: newUser.role,
                }
              : user,
          ),
        )

        setMessage({ type: "success", text: "تم تحديث بيانات المستخدم بنجاح" })
      } else {
        throw new Error(data.message || "فشل في تحديث بيانات المستخدم")
      }
    } catch (err) {
      console.error("Error updating user:", err)
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء تحديث بيانات المستخدم",
      })

      // في حالة فشل الاتصال بالـ API، قم بالتحديث محلياً
      const updatedUsers = [...users]
      const userIndex = updatedUsers.findIndex((u) => u.id === selectedUser.id)

      if (userIndex !== -1) {
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          coins: Number.parseInt(newUser.coins.toString()),
          status: newUser.status,
          role: newUser.role,
        }

        if (newUser.password) {
          updatedUsers[userIndex].password = newUser.password
        }

        setUsers(updatedUsers)
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
      }
    } finally {
      setOpenDialog(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleCreateUser = async () => {
    try {
      // التحقق من صحة البيانات
      if (!newUser.email || !newUser.password) {
        setMessage({ type: "error", text: "البريد الإلكتروني وكلمة المرور مطلوبة" })
        return
      }

      // إعداد بيانات المستخدم الجديد
      const userData = {
        username: newUser.email.split("@")[0], // استخدام جزء من البريد الإلكتروني كاسم مستخدم افتراضي
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        coins: Number.parseInt(newUser.coins.toString()) || 0,
        status: newUser.status || "Active",
        role: newUser.role || "user",
      }

      // محاولة إنشاء مستخدم جديد عبر API
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error(`فشل في إنشاء المستخدم: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // إضافة المستخدم الجديد إلى القائمة المحلية
        setUsers([...users, data.user])
        setMessage({ type: "success", text: "تم إنشاء المستخدم بنجاح" })
      } else {
        throw new Error(data.message || "فشل في إنشاء المستخدم")
      }
    } catch (err) {
      console.error("Error creating user:", err)
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء المستخدم",
      })

      // في حالة فشل الاتصال بالـ API، قم بالإنشاء محلياً
      try {
        // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
        const existingUser = users.find((u) => u.email === newUser.email)
        if (existingUser) {
          setMessage({ type: "error", text: "البريد الإلكتروني مستخدم بالفعل" })
          return
        }

        // إيجاد أعلى معرف موجود وإضافة 1 للمستخدم الجديد
        const maxId = users.reduce((max, user) => Math.max(max, Number.parseInt(user.id) || 0), 0)
        const nextId = (maxId + 1).toString()

        // إنشاء مستخدم جديد
        const newUserObj: User = {
          id: nextId,
          username: newUser.email.split("@")[0],
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          coins: Number.parseInt(newUser.coins.toString()) || 0,
          status: newUser.status || "Active",
          role: newUser.role || "user",
          registeredAt: new Date().toISOString(),
        }

        // إضافة المستخدم الجديد إلى القائمة
        const updatedUsers = [...users, newUserObj]
        setUsers(updatedUsers)
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

        setMessage({ type: "success", text: "تم إنشاء المستخدم بنجاح (محلياً)" })
      } catch (localError) {
        console.error("Error creating user locally:", localError)
        setMessage({ type: "error", text: "حدث خطأ أثناء إنشاء المستخدم محلياً" })
      }
    } finally {
      setOpenDialog(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // تصفية المستخدمين حسب البحث
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()
    const username = user.username?.toLowerCase() || ""
    const email = user.email.toLowerCase()
    const id = user.id?.toString() || ""
    const searchLower = searchTerm.toLowerCase()

    return (
      fullName.includes(searchLower) ||
      username.includes(searchLower) ||
      email.includes(searchLower) ||
      id.includes(searchLower)
    )
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة المستخدمين</CardTitle>
          <CardDescription>إدارة المستخدمين، تعديل العملات، والتحكم في الحظر</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              className={`mb-4 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              variant={message.type === "success" ? "default" : "destructive"}
            >
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 bg-red-50 border-red-200" variant="destructive">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث عن مستخدم..."
                className="w-full bg-background pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto" onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              إضافة مستخدم
            </Button>
          </div>

          <div className="overflow-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">جاري تحميل المستخدمين...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">لا يوجد مستخدمين مطابقين لبحثك</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المعرف</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                    <TableHead>العملات</TableHead>
                    <TableHead className="hidden md:table-cell">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{`${user.firstName || ""} ${user.lastName || ""}`}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>{user.coins?.toLocaleString() || 0}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "Active" ? "نشط" : "محظور"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="icon" onClick={() => handleAction("view", user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleAction("edit", user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleAction("coins", user)}>
                            <Coins className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAction("ban", user)}
                            className={user.status === "Banned" ? "bg-red-100" : ""}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleAction("delete", user)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "ban" && (selectedUser?.status === "Banned" ? "إلغاء حظر المستخدم" : "حظر المستخدم")}
              {dialogType === "coins" && "تعديل العملات"}
              {dialogType === "delete" && "حذف المستخدم"}
              {dialogType === "edit" && "تعديل بيانات المستخدم"}
              {dialogType === "view" && "عرض بيانات المستخدم"}
              {dialogType === "add" && "إضافة مستخدم جديد"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "ban" &&
                (selectedUser?.status === "Banned"
                  ? "هذا سيسمح للمستخدم بالوصول إلى المنصة مرة أخرى."
                  : "هذا سيمنع المستخدم من الوصول إلى المنصة.")}
              {dialogType === "coins" && "إضافة أو إزالة عملات من حساب هذا المستخدم."}
              {dialogType === "delete" && "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم نهائيًا."}
              {dialogType === "edit" && "تعديل بيانات المستخدم."}
              {dialogType === "view" && "عرض تفاصيل حساب المستخدم."}
              {dialogType === "add" && "إضافة مستخدم جديد إلى المنصة."}
            </DialogDescription>
          </DialogHeader>

          {dialogType === "coins" && selectedUser && (
            <div className="grid gap-4 py-4">
              <div>
                <div className="mb-2">
                  الرصيد الحالي:
                  {selectedUser?.coins?.toLocaleString() || 0} عملة
                </div>
                <div>
                  <label htmlFor="coins" className="text-sm font-medium">
                    المبلغ
                  </label>
                  <div className="flex mt-1">
                    <Button
                      variant="outline"
                      className="rounded-r-none"
                      onClick={() => setCoinAmount((prev) => (prev <= 0 ? -100 : prev - 100))}
                    >
                      -
                    </Button>
                    <Input
                      id="coins"
                      type="number"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(Number.parseInt(e.target.value) || 0)}
                      className="rounded-none text-center"
                    />
                    <Button
                      variant="outline"
                      className="rounded-l-none"
                      onClick={() => setCoinAmount((prev) => (prev >= 0 ? 100 : prev + 100))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">الرصيد الجديد</label>
                  <div className="flex items-center h-10 mt-1 px-3 border rounded-md">
                    <p>{((selectedUser?.coins || 0) + coinAmount).toLocaleString()} عملة</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(dialogType === "edit" || dialogType === "add") && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">الاسم الأخير</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  كلمة المرور
                  {dialogType === "edit" && " (اتركها فارغة إذا لم ترغب في تغييرها)"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required={dialogType === "add"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coins">العملات</Label>
                  <Input
                    id="coins"
                    type="number"
                    value={newUser.coins}
                    onChange={(e) => setNewUser({ ...newUser, coins: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">نشط</SelectItem>
                      <SelectItem value="Banned">محظور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">الدور</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم</SelectItem>
                    <SelectItem value="admin">مسؤول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {dialogType === "view" && selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المعرف</p>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الاسم الكامل</p>
                  <p className="font-medium">{`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">العملات</p>
                  <p className="font-medium">{selectedUser.coins?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الحالة</p>
                  <p className="font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.status === "Active" ? "نشط" : "محظور"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">تاريخ التسجيل</p>
                  <p className="font-medium">{selectedUser.registeredAt?.split("T")[0] || "غير معروف"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الدور</p>
                  <p className="font-medium">{selectedUser.role === "admin" ? "مسؤول" : "مستخدم"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
              إلغاء
            </Button>
            {dialogType !== "view" && (
              <Button
                type="submit"
                onClick={handleConfirm}
                className={
                  dialogType === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                }
              >
                {dialogType === "ban" && (selectedUser?.status === "Banned" ? "إلغاء الحظر" : "حظر")}
                {dialogType === "coins" && "تحديث العملات"}
                {dialogType === "delete" && "حذف"}
                {dialogType === "edit" && "تحديث"}
                {dialogType === "add" && "إضافة"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserManagement

