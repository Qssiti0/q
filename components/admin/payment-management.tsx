"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, CheckCircle, XCircle, Clock, CreditCard, Wallet, Eye, Edit, Trash, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PaymentManagement() {
  const [activeTab, setActiveTab] = useState("methods")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // أنواع بطاقات الهدايا المتاحة
  const giftCardTypes = ["Amazon", "Google Play", "iTunes", "Steam", "PlayStation", "Xbox", "Netflix", "Spotify"]

  // طرق الدفع المتاحة
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: "PayPal",
      type: "digital",
      icon: "paypal",
      fee: "2%",
      processingTime: "1-2 أيام عمل",
      min: 5,
      max: 1000,
      status: true,
      verificationRequired: true,
      conversionRate: 1000, // 1000 عملة = 1 دولار
      availableCountries: "جميع الدول",
      description: "استلم الأموال مباشرة في حساب PayPal الخاص بك",
    },
    {
      id: 2,
      name: "بطاقة هدايا Amazon",
      type: "giftcard",
      icon: "gift",
      fee: "0%",
      processingTime: "24 ساعة",
      min: 10,
      max: 100,
      status: true,
      verificationRequired: false,
      conversionRate: 1000,
      availableCountries: "الولايات المتحدة، المملكة المتحدة، ألمانيا",
      description: "استبدل عملاتك ببطاقات هدايا Amazon",
    },
    {
      id: 3,
      name: "Bitcoin",
      type: "crypto",
      icon: "bitcoin",
      fee: "1%",
      processingTime: "1-3 أيام عمل",
      min: 20,
      max: 5000,
      status: true,
      verificationRequired: true,
      conversionRate: 1000,
      availableCountries: "جميع الدول",
      description: "استلم أرباحك على شكل Bitcoin",
    },
    {
      id: 4,
      name: "Ethereum",
      type: "crypto",
      icon: "ethereum",
      fee: "1.5%",
      processingTime: "1-3 أيام عمل",
      min: 25,
      max: 3000,
      status: false,
      verificationRequired: true,
      conversionRate: 1000,
      availableCountries: "جميع الدول",
      description: "استلم أرباحك على شكل Ethereum",
    },
    {
      id: 5,
      name: "بطاقة هدايا Google Play",
      type: "giftcard",
      icon: "gift",
      fee: "0%",
      processingTime: "24 ساعة",
      min: 5,
      max: 50,
      status: true,
      verificationRequired: false,
      conversionRate: 1000,
      availableCountries: "معظم الدول",
      description: "استبدل عملاتك ببطاقات هدايا Google Play",
    },
  ])

  // نموذج الإضافة/التعديل
  const [formData, setFormData] = useState({
    name: "",
    type: "digital",
    icon: "paypal",
    fee: "0%",
    processingTime: "24 ساعة",
    min: 5,
    max: 100,
    status: true,
    verificationRequired: false,
    conversionRate: 1000,
    availableCountries: "",
    description: "",
  })

  // البيانات المزيفة لطلبات السحب
  const paymentRequests = [
    {
      id: 1,
      user: "ahmed@example.com",
      method: "PayPal",
      amount: 25,
      coins: 25000,
      status: "pending",
      date: "2023-09-15 14:30",
    },
    {
      id: 2,
      user: "sara@example.com",
      method: "بطاقة هدايا Amazon",
      amount: 10,
      coins: 10000,
      status: "approved",
      date: "2023-09-14 10:15",
    },
    {
      id: 3,
      user: "mohammed@example.com",
      method: "Bitcoin",
      amount: 50,
      coins: 50000,
      status: "rejected",
      date: "2023-09-13 18:45",
    },
    {
      id: 4,
      user: "fatima@example.com",
      method: "بطاقة هدايا iTunes",
      amount: 15,
      coins: 15000,
      status: "pending",
      date: "2023-09-12 09:20",
    },
    {
      id: 5,
      user: "omar@example.com",
      method: "PayPal",
      amount: 30,
      coins: 30000,
      status: "approved",
      date: "2023-09-11 16:10",
    },
  ]

  const handleAddEditMethod = (method?: any) => {
    if (method) {
      setSelectedPayment(method)
      setFormData({
        name: method.name,
        type: method.type,
        icon: method.icon,
        fee: method.fee,
        processingTime: method.processingTime,
        min: method.min,
        max: method.max,
        status: method.status,
        verificationRequired: method.verificationRequired,
        conversionRate: method.conversionRate,
        availableCountries: method.availableCountries,
        description: method.description,
      })
    } else {
      setSelectedPayment(null)
      setFormData({
        name: "",
        type: "digital",
        icon: "paypal",
        fee: "0%",
        processingTime: "24 ساعة",
        min: 5,
        max: 100,
        status: true,
        verificationRequired: false,
        conversionRate: 1000,
        availableCountries: "",
        description: "",
      })
    }
    setOpenDialog(true)
  }

  // تعديل دالة handleSaveMethod لتحديث localStorage بشكل صحيح

  const handleSaveMethod = () => {
    try {
      if (!formData.name) {
        setMessage({ type: "error", text: "اسم طريقة الدفع مطلوب" })
        return
      }

      let updatedMethods = [...paymentMethods]

      if (selectedPayment) {
        // تحديث طريقة الدفع الموجودة
        updatedMethods = paymentMethods.map((method) =>
          method.id === selectedPayment.id ? { ...method, ...formData } : method,
        )
        setMessage({ type: "success", text: "تم تحديث طريقة الدفع بنجاح" })
      } else {
        // إضافة طريقة دفع جديدة
        const newId = Math.max(0, ...paymentMethods.map((method) => method.id)) + 1
        const newMethod = {
          id: newId,
          ...formData,
        }
        updatedMethods = [...paymentMethods, newMethod]
        setMessage({ type: "success", text: "تمت إضافة طريقة الدفع بنجاح" })
      }

      // تحديث حالة المكون
      setPaymentMethods(updatedMethods)

      // حفظ البيانات في localStorage
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods))

      // إغلاق النافذة
      setOpenDialog(false)

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error saving payment method:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حفظ البيانات" })
    }
  }

  // تعديل دالة handleDeleteMethod لتحديث localStorage بشكل صحيح

  const handleDeleteMethod = (id: number) => {
    try {
      const updatedMethods = paymentMethods.filter((method) => method.id !== id)
      setPaymentMethods(updatedMethods)

      // حفظ البيانات المحدثة في localStorage
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods))

      setMessage({ type: "success", text: "تم حذف طريقة الدفع بنجاح" })

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error deleting payment method:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف طريقة الدفع" })
    }
  }

  // تعديل دالة toggleMethodStatus لتحديث localStorage بشكل صحيح

  const toggleMethodStatus = (id: number) => {
    try {
      const updatedMethods = paymentMethods.map((method) =>
        method.id === id ? { ...method, status: !method.status } : method,
      )

      setPaymentMethods(updatedMethods)

      // حفظ البيانات المحدثة في localStorage
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods))

      setMessage({ type: "success", text: "تم تحديث حالة طريقة الدفع بنجاح" })

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error toggling method status:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء تحديث حالة طريقة الدفع" })
    }
  }

  // إضافة useEffect لتحميل طرق الدفع من localStorage عند تحميل المكون

  useEffect(() => {
    try {
      const storedMethods = localStorage.getItem("paymentMethods")
      if (storedMethods) {
        setPaymentMethods(JSON.parse(storedMethods))
      } else {
        // إذا لم تكن هناك طرق دفع مخزنة، احفظ الطرق الافتراضية
        localStorage.setItem("paymentMethods", JSON.stringify(paymentMethods))
      }
    } catch (err) {
      console.error("Error loading payment methods:", err)
    }
  }, [])

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "digital":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "crypto":
        return <Wallet className="h-4 w-4 text-orange-500" />
      case "giftcard":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />
    }
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="methods">طرق الدفع</TabsTrigger>
          <TabsTrigger value="requests">طلبات السحب</TabsTrigger>
          <TabsTrigger value="settings">إعدادات الدفع</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>طرق الدفع</CardTitle>
                  <CardDescription>إدارة طرق الدفع المتاحة للمستخدمين</CardDescription>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleAddEditMethod()}>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة طريقة دفع جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>طريقة الدفع</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الرسوم</TableHead>
                    <TableHead>الحد الأدنى</TableHead>
                    <TableHead>الحد الأقصى</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(method.type)}
                          {method.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {method.type === "digital"
                          ? "دفع رقمي"
                          : method.type === "crypto"
                            ? "عملة رقمية"
                            : "بطاقة هدايا"}
                      </TableCell>
                      <TableCell>{method.fee}</TableCell>
                      <TableCell>${method.min}</TableCell>
                      <TableCell>${method.max}</TableCell>
                      <TableCell>
                        <Switch checked={method.status} onCheckedChange={() => toggleMethodStatus(method.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleAddEditMethod(method)}>
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 hover:bg-red-100 text-red-600"
                            onClick={() => handleDeleteMethod(method.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>طلبات السحب</CardTitle>
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
                      <SelectItem value="all">جميع الطلبات</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="approved">تمت الموافقة</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>طريقة الدفع</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>العملات</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRequests.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.user}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.coins.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {payment.status === "pending" && (
                            <span className="flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 ml-1" />
                              قيد الانتظار
                            </span>
                          )}
                          {payment.status === "approved" && (
                            <span className="flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 ml-1" />
                              تمت الموافقة
                            </span>
                          )}
                          {payment.status === "rejected" && (
                            <span className="flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 ml-1" />
                              مرفوض
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 ml-2" />
                            عرض
                          </Button>
                          {payment.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 hover:bg-green-100 text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 ml-2" />
                                موافقة
                              </Button>
                              <Button variant="outline" size="sm" className="bg-red-50 hover:bg-red-100 text-red-600">
                                <XCircle className="h-4 w-4 ml-2" />
                                رفض
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الدفع</CardTitle>
              <CardDescription>تكوين إعدادات الدفع العامة للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">معدل تحويل العملات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>قيمة 1000 عملة بالدولار</Label>
                      <div className="flex items-center">
                        <span className="absolute ml-3 text-muted-foreground">$</span>
                        <Input type="number" defaultValue="1" className="pl-6" />
                      </div>
                      <p className="text-xs text-muted-foreground">تحديد قيمة كل 1000 عملة بالدولار الأمريكي</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">الحد الأدنى للسحب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>الحد الأدنى للسحب (بالعملات)</Label>
                      <Input type="number" defaultValue="5000" />
                      <p className="text-xs text-muted-foreground">الحد الأدنى لعدد العملات المطلوبة لطلب السحب</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPayment ? "تعديل طريقة الدفع" : "إضافة طريقة دفع"}</DialogTitle>
            <DialogDescription>
              {selectedPayment ? "تحديث تفاصيل طريقة الدفع" : "إضافة طريقة دفع جديدة إلى المنصة"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم طريقة الدفع</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: PayPal"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">نوع الدفع</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">دفع رقمي</SelectItem>
                    <SelectItem value="crypto">عملة رقمية</SelectItem>
                    <SelectItem value="giftcard">بطاقة هدايا</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">الأيقونة</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="اختر الأيقونة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="gift">بطاقة هدايا</SelectItem>
                    <SelectItem value="credit-card">بطاقة ائتمان</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fee">الرسوم</Label>
                <Input
                  id="fee"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  placeholder="مثال: 2%"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="processingTime">وقت المعالجة</Label>
                <Input
                  id="processingTime"
                  value={formData.processingTime}
                  onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                  placeholder="مثال: 24 ساعة"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min">الحد الأدنى (بالدولار)</Label>
                <Input
                  id="min"
                  type="number"
                  value={formData.min}
                  onChange={(e) => setFormData({ ...formData, min: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="max">الحد الأقصى (بالدولار)</Label>
                <Input
                  id="max"
                  type="number"
                  value={formData.max}
                  onChange={(e) => setFormData({ ...formData, max: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="conversionRate">معدل التحويل (عدد العملات لكل $1)</Label>
                <Input
                  id="conversionRate"
                  type="number"
                  value={formData.conversionRate}
                  onChange={(e) => setFormData({ ...formData, conversionRate: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="availableCountries">البلدان المتاحة</Label>
                <Input
                  id="availableCountries"
                  value={formData.availableCountries}
                  onChange={(e) => setFormData({ ...formData, availableCountries: e.target.value })}
                  placeholder="مثال: جميع الدول"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">الحالة</Label>
                <div className="flex items-center">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                  />
                  <Label htmlFor="status" className="mr-2">
                    نشط
                  </Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="verificationRequired">يتطلب التحقق</Label>
                <div className="flex items-center">
                  <Switch
                    id="verificationRequired"
                    checked={formData.verificationRequired}
                    onCheckedChange={(checked) => setFormData({ ...formData, verificationRequired: checked })}
                  />
                  <Label htmlFor="verificationRequired" className="mr-2">
                    مطلوب التحقق من الهوية
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف طريقة الدفع"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveMethod} className="bg-emerald-500 hover:bg-emerald-600">
              {selectedPayment ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

