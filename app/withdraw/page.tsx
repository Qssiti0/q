"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Wallet, Coins, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WithdrawHistory } from "@/components/withdraw-history"

interface PaymentMethod {
  id: string
  name: string
  type: string
  icon: string
  minAmount: number
  processingTime: string
  fee: number
  color: string
  fields: {
    [key: string]: {
      label: string
      placeholder: string
      required: boolean
      type: string
    }
  }
}

export default function WithdrawPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<{ [key: string]: string }>({})
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"

    if (!userLoggedIn) {
      router.push("/login?redirect=/withdraw")
      return
    }

    try {
      // جلب بيانات المستخدم
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setCurrentUser(JSON.parse(userData))
      }

      // جلب طرق الدفع من localStorage
      const storedPaymentMethods = localStorage.getItem("paymentMethods")
      if (storedPaymentMethods) {
        const methods = JSON.parse(storedPaymentMethods)
        setPaymentMethods(methods)

        // تعيين الطريقة الافتراضية إذا كانت متوفرة
        const defaultMethod = localStorage.getItem("defaultPaymentMethod")
        if (defaultMethod && methods.some((m) => m.id === defaultMethod)) {
          setSelectedMethod(defaultMethod)
        } else if (methods.length > 0) {
          setSelectedMethod(methods[0].id)
        }
      } else {
        // طرق الدفع الافتراضية إذا لم تكن موجودة
        const defaultMethods = [
          {
            id: "paypal",
            name: "PayPal",
            type: "digital",
            icon: "paypal",
            minAmount: 5,
            processingTime: "1-3 أيام عمل",
            fee: 2,
            color: "#0070ba",
            fields: {
              email: {
                label: "البريد الإلكتروني لحساب PayPal",
                placeholder: "example@example.com",
                required: true,
                type: "email",
              },
            },
          },
          {
            id: "bank",
            name: "تحويل بنكي",
            type: "bank",
            icon: "bank",
            minAmount: 20,
            processingTime: "3-5 أيام عمل",
            fee: 5,
            color: "#2e7d32",
            fields: {
              accountName: {
                label: "اسم صاحب الحساب",
                placeholder: "الاسم الكامل",
                required: true,
                type: "text",
              },
              accountNumber: {
                label: "رقم الحساب / IBAN",
                placeholder: "رقم الحساب البنكي",
                required: true,
                type: "text",
              },
              bankName: {
                label: "اسم البنك",
                placeholder: "اسم البنك",
                required: true,
                type: "text",
              },
            },
          },
          {
            id: "crypto",
            name: "العملات الرقمية",
            type: "crypto",
            icon: "bitcoin",
            minAmount: 10,
            processingTime: "1-24 ساعة",
            fee: 1,
            color: "#f7931a",
            fields: {
              walletAddress: {
                label: "عنوان المحفظة",
                placeholder: "عنوان محفظة البيتكوين",
                required: true,
                type: "text",
              },
              network: {
                label: "الشبكة",
                placeholder: "BTC, ETH, BNB, etc.",
                required: true,
                type: "text",
              },
            },
          },
        ]
        setPaymentMethods(defaultMethods)
        setSelectedMethod(defaultMethods[0].id)
        localStorage.setItem("paymentMethods", JSON.stringify(defaultMethods))
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error loading user data:", err)
      setIsLoading(false)
    }
  }, [router])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // التحقق من أن القيمة رقمية فقط
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value)
      setError("")
    }
  }

  const handlePaymentDetailChange = (field: string, value: string) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMethod) {
      setError("يرجى اختيار طريقة دفع")
      return
    }

    const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedMethod)
    if (!selectedPaymentMethod) {
      setError("طريقة الدفع غير صالحة")
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("يرجى إدخال مبلغ صالح")
      return
    }

    if (amountValue < selectedPaymentMethod.minAmount) {
      setError(`الحد الأدنى للسحب هو ${selectedPaymentMethod.minAmount} كوينز`)
      return
    }

    if (currentUser && amountValue > currentUser.coins) {
      setError("رصيدك غير كافٍ")
      return
    }

    // التحقق من تعبئة جميع الحقول المطلوبة
    const requiredFields = Object.entries(selectedPaymentMethod.fields)
      .filter(([_, field]) => field.required)
      .map(([key]) => key)

    const missingFields = requiredFields.filter((field) => !paymentDetails[field])
    if (missingFields.length > 0) {
      setError(`يرجى تعبئة جميع الحقول المطلوبة: ${missingFields.join(", ")}`)
      return
    }

    // محاكاة عملية السحب
    setIsLoading(true)
    setTimeout(() => {
      // تحديث رصيد المستخدم
      if (currentUser) {
        const newCoins = currentUser.coins - amountValue
        const updatedUser = { ...currentUser, coins: newCoins }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
      }

      // إضافة السحب إلى سجل السحوبات
      const withdrawHistory = JSON.parse(localStorage.getItem("withdrawHistory") || "[]")
      const newWithdrawal = {
        id: Date.now().toString(),
        userId: currentUser?.id,
        amount: amountValue,
        method: selectedPaymentMethod.name,
        details: paymentDetails,
        status: "pending",
        date: new Date().toISOString(),
      }
      withdrawHistory.push(newWithdrawal)
      localStorage.setItem("withdrawHistory", JSON.stringify(withdrawHistory))

      // إعادة تعيين النموذج
      setAmount("")
      setPaymentDetails({})
      setSuccess(`تم تقديم طلب السحب بنجاح! سيتم معالجته خلال ${selectedPaymentMethod.processingTime}.`)
      setError("")
      setIsLoading(false)
    }, 1500)
  }

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case "paypal":
        return <CreditCard className="h-6 w-6 text-white" />
      case "bank":
        return <Wallet className="h-6 w-6 text-white" />
      case "bitcoin":
        return <Coins className="h-6 w-6 text-white" />
      default:
        return <Wallet className="h-6 w-6 text-white" />
    }
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
          <div className="text-xl font-semibold">سحب الأرباح</div>
          <div></div>
        </div>
      </header>

      <main className="flex-1 container py-6 px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">سحب الأرباح</h2>
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                <Coins className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">{currentUser?.coins?.toLocaleString() || 0}</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
                <Check className="h-4 w-4 text-emerald-500" />
                <AlertTitle>تم بنجاح</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="amount">المبلغ (بالكوينز)</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="أدخل المبلغ"
                  value={amount}
                  onChange={handleAmountChange}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">الحد الأدنى للسحب يعتمد على طريقة الدفع المختارة</p>
              </div>

              <div className="space-y-4">
                <Label>اختر طريقة الدفع</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <TooltipProvider key={method.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedMethod === method.id ? "ring-2 ring-emerald-500 ring-offset-2" : "border"
                            }`}
                            onClick={() => setSelectedMethod(method.id)}
                          >
                            <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
                              <div
                                className="h-10 w-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: method.color }}
                              >
                                {getMethodIcon(method.icon)}
                              </div>
                              <div>
                                <CardTitle className="text-base">{method.name}</CardTitle>
                                <CardDescription className="text-xs">
                                  الحد الأدنى: {method.minAmount} كوينز
                                </CardDescription>
                              </div>
                              {selectedMethod === method.id && <Check className="h-5 w-5 text-emerald-500 ml-auto" />}
                            </CardHeader>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-xs">رسوم المعالجة: {method.fee}%</p>
                            <p className="text-xs">وقت المعالجة: {method.processingTime}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              {selectedMethod && (
                <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
                  <h3 className="font-medium">تفاصيل الدفع</h3>
                  {paymentMethods.find((method) => method.id === selectedMethod)?.fields &&
                    Object.entries(paymentMethods.find((method) => method.id === selectedMethod)?.fields || {}).map(
                      ([fieldKey, field]) => (
                        <div key={fieldKey} className="space-y-2">
                          <Label htmlFor={fieldKey}>
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          <Input
                            id={fieldKey}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={paymentDetails[fieldKey] || ""}
                            onChange={(e) => handlePaymentDetailChange(fieldKey, e.target.value)}
                            required={field.required}
                          />
                        </div>
                      ),
                    )}
                </div>
              )}

              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-800">
                  سيتم معالجة طلبات السحب خلال فترة تتراوح من 1 إلى 5 أيام عمل حسب طريقة الدفع المختارة.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
                تأكيد السحب
              </Button>
            </form>
          </div>

          <div>
            <Tabs defaultValue="history">
              <TabsList className="w-full">
                <TabsTrigger value="history" className="flex-1">
                  سجل السحوبات
                </TabsTrigger>
                <TabsTrigger value="info" className="flex-1">
                  معلومات السحب
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <WithdrawHistory />
              </TabsContent>
              <TabsContent value="info" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات السحب</CardTitle>
                    <CardDescription>كل ما تحتاج معرفته عن سحب أرباحك</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">طرق الدفع المتاحة</h4>
                      <p className="text-sm text-muted-foreground">
                        نوفر العديد من طرق الدفع لتناسب احتياجاتك، بما في ذلك PayPal والتحويل البنكي والعملات الرقمية.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">وقت المعالجة</h4>
                      <p className="text-sm text-muted-foreground">
                        تختلف أوقات المعالجة حسب طريقة الدفع المختارة. عادةً ما تستغرق من 1 إلى 5 أيام عمل.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">الحد الأدنى للسحب</h4>
                      <p className="text-sm text-muted-foreground">
                        يختلف الحد الأدنى للسحب حسب طريقة الدفع. يرجى التحقق من متطلبات كل طريقة.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">الرسوم</h4>
                      <p className="text-sm text-muted-foreground">
                        قد تطبق رسوم معالجة صغيرة على بعض طرق الدفع. يتم عرض الرسوم بوضوح قبل تأكيد السحب.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      إذا كان لديك أي أسئلة حول عمليات السحب، يرجى التواصل مع فريق الدعم.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

