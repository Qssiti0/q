"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Coins, Bell, Shield, LogOut, Copy, Wallet, History, Gift, Share2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  // جلب بيانات المستخدم
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"

    if (!userLoggedIn) {
      router.push("/login?redirect=/profile")
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

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn")
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  // تحديث بيانات المستخدم
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // محاكاة تحديث البيانات
    setTimeout(() => {
      try {
        // تحديث البيانات في localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser))

        // تحديث البيانات في قائمة المستخدمين
        const usersData = localStorage.getItem("registeredUsers")
        if (usersData) {
          const users = JSON.parse(usersData)
          const updatedUsers = users.map((user: any) => {
            if (user.id === currentUser.id) {
              return {
                ...user,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
              }
            }
            return user
          })
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        }

        setSuccess("تم تحديث بياناتك بنجاح")
        // إخفاء رسالة النجاح بعد 3 ثوانٍ
        setTimeout(() => setSuccess(""), 3000)
      } catch (err) {
        console.error("Error updating profile:", err)
        setError("حدث خطأ أثناء تحديث البيانات. يرجى المحاولة مرة أخرى.")
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  // الحصول على رابط الإحالة
  const getReferralLink = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/?ref=${currentUser?.id || "unknown"}`
  }

  // نسخ رابط الإحالة
  const copyReferralLink = () => {
    const referralLink = getReferralLink()
    navigator.clipboard.writeText(referralLink)
    setSuccess("تم نسخ رابط الإحالة إلى الحافظة")
    setTimeout(() => setSuccess(""), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>لم يتم العثور على بيانات المستخدم</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">الملف الشخصي</CardTitle>
              <CardDescription>إدارة معلومات حسابك وإعداداتك</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">
                    <User className="h-4 w-4 mr-2" />
                    الملف الشخصي
                  </TabsTrigger>
                  <TabsTrigger value="earnings">
                    <Coins className="h-4 w-4 mr-2" />
                    الأرباح
                  </TabsTrigger>
                  <TabsTrigger value="referrals">
                    <Share2 className="h-4 w-4 mr-2" />
                    الإحالات
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield className="h-4 w-4 mr-2" />
                    الأمان
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 mt-6">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="userId">معرف المستخدم</Label>
                      <Input
                        id="userId"
                        value={currentUser.id || "غير متوفر"}
                        readOnly={true}
                        className="bg-muted/50 text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">هذا هو المعرف الفريد الخاص بك في النظام</p>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">الاسم الأول</Label>
                          <Input
                            id="firstName"
                            value={currentUser.firstName || ""}
                            onChange={(e) => setCurrentUser({ ...currentUser, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">الاسم الأخير</Label>
                          <Input
                            id="lastName"
                            value={currentUser.lastName || ""}
                            onChange={(e) => setCurrentUser({ ...currentUser, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          value={currentUser.email || ""}
                          onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="pt-4 border-t flex justify-end">
                        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="earnings" className="space-y-6 mt-6">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
                              <p className="text-2xl font-bold">{currentUser.coins?.toLocaleString() || 0}</p>
                            </div>
                            <Coins className="h-8 w-8 text-emerald-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">ما يعادل بالدولار</p>
                              <p className="text-2xl font-bold">${((currentUser.coins || 0) / 1000).toFixed(2)}</p>
                            </div>
                            <Wallet className="h-8 w-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">عمليات السحب</p>
                              <p className="text-2xl font-bold">
                                {/* عدد عمليات السحب */}
                                {(() => {
                                  try {
                                    const history = localStorage.getItem(`withdrawalHistory_${currentUser.id}`)
                                    return history ? JSON.parse(history).length : 0
                                  } catch (err) {
                                    return 0
                                  }
                                })()}
                              </p>
                            </div>
                            <History className="h-8 w-8 text-purple-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">أرباح العروض</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                            <p className="text-muted-foreground">مخطط بياني لأرباح العروض (سيتم تنفيذه لاحقاً)</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">السحب السريع</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <Button variant="outline" className="flex-1 mr-2" onClick={() => router.push("/withdraw")}>
                              <Wallet className="h-4 w-4 mr-2" />
                              PayPal
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 mr-2"
                              onClick={() => router.push("/withdraw?method=crypto")}
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              عملات رقمية
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => router.push("/withdraw?method=giftcard")}
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              بطاقات هدايا
                            </Button>
                          </div>
                          <Button
                            className="w-full bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => router.push("/withdraw")}
                          >
                            سحب الأرباح
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="referrals" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">دعوة الأصدقاء</CardTitle>
                      <CardDescription>أرسل رابط الدعوة واربح 10% من أرباح أصدقائك</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input value={getReferralLink()} readOnly className="pr-10" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                            onClick={copyReferralLink}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          className="bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => router.push("/referrals")}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          الإحالات
                        </Button>
                      </div>

                      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 flex items-start">
                        <Share2 className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
                        <div>
                          <p>
                            اربح 10% من أرباح أصدقائك المحالين! قم بزيارة صفحة الإحالات للاطلاع على التفاصيل
                            والإحصائيات.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button className="w-full" variant="outline" onClick={() => router.push("/referrals")}>
                    <Share2 className="h-4 w-4 mr-2" />
                    إدارة الإحالات
                  </Button>
                </TabsContent>

                <TabsContent value="security" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                      <Input id="currentPassword" type="password" placeholder="أدخل كلمة المرور الحالية" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <Input id="newPassword" type="password" placeholder="أدخل كلمة المرور الجديدة" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <Input id="confirmPassword" type="password" placeholder="أعد إدخال كلمة المرور الجديدة" />
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button className="bg-emerald-500 hover:bg-emerald-600">تغيير كلمة المرور</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle>{`${currentUser.firstName} ${currentUser.lastName}`}</CardTitle>
                  <CardDescription>{currentUser.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">الرصيد</span>
                  <span className="text-sm font-medium">{currentUser.coins?.toLocaleString() || 0} عملة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ما يعادل</span>
                  <span className="text-sm font-medium">${((currentUser.coins || 0) / 1000).toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/withdraw")}>
                  <Wallet className="h-4 w-4 mr-2" />
                  سحب الأرباح
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/referrals")}>
                  <Share2 className="h-4 w-4 mr-2" />
                  الإحالات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  الإشعارات
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  تسجيل الخروج
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>الأنشطة الأخيرة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-4 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">سيتم عرض أنشطتك الأخيرة هنا</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

