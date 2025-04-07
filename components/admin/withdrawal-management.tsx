"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, ArrowUpRight, Bitcoin, DollarSign, Gift } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WithdrawalRequest {
  id: number
  userId: number
  userEmail: string
  amount: number
  coins: number
  method: string
  details: string
  status: string
  requestDate: string
  processedDate?: string
}

export function WithdrawalManagement() {
  const [activeTab, setActiveTab] = useState("pending")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // جلب طلبات السحب
  useEffect(() => {
    loadWithdrawals()
  }, [])

  const loadWithdrawals = () => {
    try {
      const storedWithdrawals = localStorage.getItem("withdrawalRequests")
      if (storedWithdrawals) {
        setWithdrawals(JSON.parse(storedWithdrawals))
      }
    } catch (err) {
      console.error("Error loading withdrawals:", err)
    }
  }

  const handleViewWithdrawal = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal)
    setOpenDialog(true)
  }

  const handleApproveWithdrawal = (id: number) => {
    updateWithdrawalStatus(id, "completed")
  }

  const handleRejectWithdrawal = (id: number) => {
    updateWithdrawalStatus(id, "rejected")
  }

  const updateWithdrawalStatus = (id: number, status: string) => {
    try {
      // تحديث القائمة الرئيسية
      const updatedWithdrawals = withdrawals.map((withdrawal) =>
        withdrawal.id === id
          ? {
              ...withdrawal,
              status,
              processedDate: new Date().toISOString(),
            }
          : withdrawal,
      )

      setWithdrawals(updatedWithdrawals)
      localStorage.setItem("withdrawalRequests", JSON.stringify(updatedWithdrawals))

      // تحديث سجل المستخدم
      const targetWithdrawal = withdrawals.find((w) => w.id === id)
      if (targetWithdrawal) {
        const userId = targetWithdrawal.userId
        const userHistoryKey = `withdrawalHistory_${userId}`

        const userHistory = localStorage.getItem(userHistoryKey)
        if (userHistory) {
          const history = JSON.parse(userHistory)
          const updatedHistory = history.map((item: WithdrawalRequest) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  processedDate: new Date().toISOString(),
                }
              : item,
          )
          localStorage.setItem(userHistoryKey, JSON.stringify(updatedHistory))
        }

        // إذا تم رفض الطلب، أعد العملات للمستخدم
        if (status === "rejected") {
          const userDataStr = localStorage.getItem("registeredUsers")
          if (userDataStr) {
            const userData = JSON.parse(userDataStr)
            const updatedUsers = userData.map((user: any) => {
              if (user.id === userId) {
                return {
                  ...user,
                  coins: (user.coins || 0) + targetWithdrawal.coins,
                }
              }
              return user
            })
            localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

            // تحديث بيانات المستخدم الحالي إذا كان هو المستخدم المعني
            const currentUserStr = localStorage.getItem("currentUser")
            if (currentUserStr) {
              const currentUser = JSON.parse(currentUserStr)
              if (currentUser.id === userId) {
                currentUser.coins = (currentUser.coins || 0) + targetWithdrawal.coins
                localStorage.setItem("currentUser", JSON.stringify(currentUser))
              }
            }
          }
        }
      }

      setOpenDialog(false)
      setMessage({
        type: "success",
        text: status === "completed" ? "تمت الموافقة على طلب السحب بنجاح" : "تم رفض طلب السحب وإعادة العملات للمستخدم",
      })

      // إخفاء الرسالة بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error updating withdrawal status:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء تحديث حالة طلب السحب" })
    }
  }

  // تصفية طلبات السحب حسب الحالة
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (activeTab === "all") return true
    return withdrawal.status === activeTab
  })

  // الحصول على أيقونة وسيلة السحب
  const getMethodIcon = (method: string) => {
    switch (method) {
      case "paypal":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "crypto":
        return <Bitcoin className="h-4 w-4 text-orange-500" />
      case "giftcard":
        return <Gift className="h-4 w-4 text-purple-500" />
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>إدارة طلبات السحب</CardTitle>
              <CardDescription>إدارة طلبات سحب الأموال من المستخدمين</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="بحث..." className="w-full sm:w-64 pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="تصفية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطرق</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">العملات الرقمية</SelectItem>
                  <SelectItem value="giftcard">بطاقات الهدايا</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                <Clock className="mr-2 h-4 w-4" />
                قيد الانتظار
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="mr-2 h-4 w-4" />
                مكتملة
              </TabsTrigger>
              <TabsTrigger value="rejected">
                <XCircle className="mr-2 h-4 w-4" />
                مرفوضة
              </TabsTrigger>
              <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {filteredWithdrawals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد طلبات سحب{" "}
                  {activeTab === "pending"
                    ? "منتظرة"
                    : activeTab === "completed"
                      ? "مكتملة"
                      : activeTab === "rejected"
                        ? "مرفوضة"
                        : ""}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>طريقة السحب</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>العملات</TableHead>
                      <TableHead>التفاصيل</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals
                      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                      .map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="font-medium">{withdrawal.userEmail}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getMethodIcon(withdrawal.method)}
                              <span className="mr-2">
                                {withdrawal.method === "paypal"
                                  ? "PayPal"
                                  : withdrawal.method === "crypto"
                                    ? "عملات رقمية"
                                    : withdrawal.method === "giftcard"
                                      ? "بطاقة هدية"
                                      : withdrawal.method}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>${withdrawal.amount}</TableCell>
                          <TableCell>{withdrawal.coins.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className="text-xs max-w-40 truncate block">{withdrawal.details}</span>
                          </TableCell>
                          <TableCell>{formatDate(withdrawal.requestDate)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {withdrawal.status === "pending" && (
                                <span className="flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  قيد الانتظار
                                </span>
                              )}
                              {withdrawal.status === "completed" && (
                                <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  مكتمل
                                </span>
                              )}
                              {withdrawal.status === "rejected" && (
                                <span className="flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  مرفوض
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewWithdrawal(withdrawal)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {withdrawal.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-50 hover:bg-green-100 text-green-600"
                                    onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-600"
                                    onClick={() => handleRejectWithdrawal(withdrawal.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب السحب</DialogTitle>
            <DialogDescription>عرض تفاصيل طلب السحب والمعلومات المرتبطة به</DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المستخدم</p>
                  <p className="font-medium">{selectedWithdrawal.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">طريقة السحب</p>
                  <p className="font-medium flex items-center">
                    {getMethodIcon(selectedWithdrawal.method)}
                    <span className="mr-2">
                      {selectedWithdrawal.method === "paypal"
                        ? "PayPal"
                        : selectedWithdrawal.method === "crypto"
                          ? "عملات رقمية"
                          : selectedWithdrawal.method === "giftcard"
                            ? "بطاقة هدية"
                            : selectedWithdrawal.method}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المبلغ</p>
                  <p className="font-medium">${selectedWithdrawal.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">العملات</p>
                  <p className="font-medium">{selectedWithdrawal.coins.toLocaleString()} عملة</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الحالة</p>
                  <div className="mt-1">
                    {selectedWithdrawal.status === "pending" && (
                      <span className="flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        قيد الانتظار
                      </span>
                    )}
                    {selectedWithdrawal.status === "completed" && (
                      <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        مكتمل
                      </span>
                    )}
                    {selectedWithdrawal.status === "rejected" && (
                      <span className="flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        مرفوض
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">تاريخ الطلب</p>
                  <p className="font-medium">{formatDate(selectedWithdrawal.requestDate)}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">معلومات الدفع</p>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap break-words">{selectedWithdrawal.details}</p>
                </div>
              </div>

              {selectedWithdrawal.status === "pending" && (
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 text-red-600"
                    onClick={() => handleRejectWithdrawal(selectedWithdrawal.id)}
                  >
                    <XCircle className="h-4 w-4 ml-2" />
                    رفض
                  </Button>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => handleApproveWithdrawal(selectedWithdrawal.id)}
                  >
                    <CheckCircle className="h-4 w-4 ml-2" />
                    موافقة
                  </Button>
                </div>
              )}

              {selectedWithdrawal.status === "completed" && (
                <div className="flex justify-center">
                  <Button variant="outline">
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                    عرض تفاصيل المعاملة
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

