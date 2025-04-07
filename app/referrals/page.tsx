"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Share2, Users, Coins, BarChart3, CheckCircle, Clock, Link2 } from "lucide-react"
import { ReferralStats } from "@/components/referral-stats"

export default function ReferralsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState<any[]>([])
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  })

  // الحصول على معلومات المستخدم الحالي والإحالات
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"

    if (!userLoggedIn) {
      router.push("/login?redirect=/referrals")
      return
    }

    try {
      // جلب معلومات المستخدم
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        const user = JSON.parse(userData)
        setCurrentUser(user)

        // جلب قائمة الإحالات
        fetchReferrals(user.id)
      }
    } catch (err) {
      console.error("Error loading user data:", err)
    }
  }, [router])

  // جلب قائمة الإحالات للمستخدم
  const fetchReferrals = (userId: number) => {
    try {
      // في تطبيق حقيقي، سيتم استدعاء API لجلب قائمة الإحالات
      // هنا نقوم بمحاكاة الإحالات

      // تحقق إذا كانت هناك إحالات مخزنة
      const storedReferrals = localStorage.getItem(`referrals_${userId}`)

      // إنشاء بيانات تجريبية للإحالات إذا لم تكن موجودة
      if (!storedReferrals) {
        const demoReferrals = generateDemoReferrals(userId)
        localStorage.setItem(`referrals_${userId}`, JSON.stringify(demoReferrals))
        setReferrals(demoReferrals)
        calculateStats(demoReferrals)
      } else {
        const loadedReferrals = JSON.parse(storedReferrals)
        setReferrals(loadedReferrals)
        calculateStats(loadedReferrals)
      }
    } catch (err) {
      console.error("Error fetching referrals:", err)
    }
  }

  // إنشاء بيانات تجريبية للإحالات
  const generateDemoReferrals = (userId: number) => {
    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000

    return [
      {
        id: 1,
        referrerId: userId,
        referredUser: {
          id: 101,
          name: "محمد أحمد",
          email: "mohammed@example.com",
        },
        status: "active",
        joinedDate: new Date(now.getTime() - 20 * oneDay).toISOString(),
        earnings: 3200,
        earnedCoins: 10000,
        completedOffers: 12,
      },
      {
        id: 2,
        referrerId: userId,
        referredUser: {
          id: 102,
          name: "سارة علي",
          email: "sara@example.com",
        },
        status: "active",
        joinedDate: new Date(now.getTime() - 15 * oneDay).toISOString(),
        earnings: 1800,
        earnedCoins: 7500,
        completedOffers: 8,
      },
      {
        id: 3,
        referrerId: userId,
        referredUser: {
          id: 103,
          name: "أحمد محمود",
          email: "ahmed@example.com",
        },
        status: "pending",
        joinedDate: new Date(now.getTime() - 5 * oneDay).toISOString(),
        earnings: 0,
        earnedCoins: 0,
        completedOffers: 0,
      },
      {
        id: 4,
        referrerId: userId,
        referredUser: {
          id: 104,
          name: "فاطمة حسن",
          email: "fatima@example.com",
        },
        status: "active",
        joinedDate: new Date(now.getTime() - 25 * oneDay).toISOString(),
        earnings: 5500,
        earnedCoins: 15000,
        completedOffers: 18,
      },
      {
        id: 5,
        referrerId: userId,
        referredUser: {
          id: 105,
          name: "خالد عمر",
          email: "khalid@example.com",
        },
        status: "pending",
        joinedDate: new Date(now.getTime() - 2 * oneDay).toISOString(),
        earnings: 0,
        earnedCoins: 0,
        completedOffers: 0,
      },
    ]
  }

  // حساب إحصائيات الإحالات
  const calculateStats = (referralsList: any[]) => {
    const stats = {
      totalReferrals: referralsList.length,
      activeReferrals: referralsList.filter((r) => r.status === "active").length,
      pendingReferrals: referralsList.filter((r) => r.status === "pending").length,
      totalEarnings: referralsList.reduce((sum, r) => sum + (r.earnings || 0), 0),
      pendingEarnings: 0, // عادةً يتم حساب الأرباح المعلقة من خلال طلبات السحب المعلقة
    }

    setReferralStats(stats)
  }

  // نسخ رابط الإحالة إلى الحافظة
  const copyReferralLink = () => {
    const referralLink = getReferralLink()
    navigator.clipboard.writeText(referralLink)
    setCopied(true)

    // إعادة تعيين حالة النسخ بعد 2 ثانية
    setTimeout(() => setCopied(false), 2000)
  }

  // الحصول على رابط الإحالة
  const getReferralLink = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/?ref=${currentUser?.id || "unknown"}`
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
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

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">نظام الإحالة</CardTitle>
              <CardDescription>ادعُ أصدقاءك واربح 10% من أرباحهم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">رابط الإحالة الخاص بك</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input value={getReferralLink()} readOnly={true} className="pr-10" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={copyReferralLink}
                    >
                      {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 flex-shrink-0" onClick={copyReferralLink}>
                    {copied ? "تم النسخ!" : "نسخ الرابط"}
                  </Button>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 flex items-start">
                <div className="mr-3 mt-0.5">
                  <Share2 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium mb-1">كيف يعمل نظام الإحالة؟</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>شارك رابط الإحالة الخاص بك مع أصدقائك.</li>
                    <li>عندما يسجلون باستخدام رابطك، سيتم إضافتهم كمحالين تحت حسابك.</li>
                    <li>تربح 10% من جميع العملات التي يكسبونها على المنصة!</li>
                    <li>كلما زاد نشاطهم على المنصة، زادت أرباحك!</li>
                  </ol>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-blue-50/50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي المُحالين</p>
                        <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50/50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي الأرباح</p>
                        <p className="text-2xl font-bold">{referralStats.totalEarnings.toLocaleString()} عملة</p>
                      </div>
                      <Coins className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50/50">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">المُحالين النشطين</p>
                        <p className="text-2xl font-bold">{referralStats.activeReferrals}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "اربح معي على CoinRewards!",
                      text: "انضم إلي واربح العملات مقابل إكمال العروض والمهام البسيطة.",
                      url: getReferralLink(),
                    })
                  } else {
                    copyReferralLink()
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة الرابط
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>المُحالين</CardTitle>
              <CardDescription>قائمة بالأشخاص الذين قمت بإحالتهم</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">الجميع ({referrals.length})</TabsTrigger>
                  <TabsTrigger value="active">نشطين ({referralStats.activeReferrals})</TabsTrigger>
                  <TabsTrigger value="pending">معلقين ({referralStats.pendingReferrals})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  {referrals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">لم تقم بإحالة أي شخص بعد</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>تاريخ الانضمام</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>العروض المكتملة</TableHead>
                          <TableHead>العملات المكتسبة</TableHead>
                          <TableHead>أرباحك</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell className="font-medium">{referral.referredUser.name}</TableCell>
                            <TableCell>{formatDate(referral.joinedDate)}</TableCell>
                            <TableCell>
                              {referral.status === "active" ? (
                                <span className="flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 w-fit">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  نشط
                                </span>
                              ) : (
                                <span className="flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 w-fit">
                                  <Clock className="h-3 w-3 mr-1" />
                                  معلق
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{referral.completedOffers}</TableCell>
                            <TableCell>{referral.earnedCoins.toLocaleString()}</TableCell>
                            <TableCell className="font-medium text-emerald-600">
                              {referral.earnings.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="active" className="mt-4">
                  {referrals.filter((r) => r.status === "active").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">لا يوجد محالين نشطين حالياً</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>تاريخ الانضمام</TableHead>
                          <TableHead>العروض المكتملة</TableHead>
                          <TableHead>العملات المكتسبة</TableHead>
                          <TableHead>أرباحك</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals
                          .filter((r) => r.status === "active")
                          .map((referral) => (
                            <TableRow key={referral.id}>
                              <TableCell className="font-medium">{referral.referredUser.name}</TableCell>
                              <TableCell>{formatDate(referral.joinedDate)}</TableCell>
                              <TableCell>{referral.completedOffers}</TableCell>
                              <TableCell>{referral.earnedCoins.toLocaleString()}</TableCell>
                              <TableCell className="font-medium text-emerald-600">
                                {referral.earnings.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  {referrals.filter((r) => r.status === "pending").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">لا يوجد محالين معلقين حالياً</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الاسم</TableHead>
                          <TableHead>تاريخ الانضمام</TableHead>
                          <TableHead>الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals
                          .filter((r) => r.status === "pending")
                          .map((referral) => (
                            <TableRow key={referral.id}>
                              <TableCell className="font-medium">{referral.referredUser.name}</TableCell>
                              <TableCell>{formatDate(referral.joinedDate)}</TableCell>
                              <TableCell>
                                <span className="flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 w-fit">
                                  <Clock className="h-3 w-3 mr-1" />
                                  معلق
                                </span>
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
        </div>

        <div>
          <ReferralStats referrals={referrals} />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>نصائح للإحالة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-emerald-500" />
                  شارك مع أصدقائك
                </h3>
                <p className="text-sm text-muted-foreground">
                  أرسل رابط الإحالة الخاص بك لأصدقائك وعائلتك وزملائك في العمل.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <Link2 className="h-4 w-4 mr-2 text-emerald-500" />
                  شارك على وسائل التواصل
                </h3>
                <p className="text-sm text-muted-foreground">
                  استخدم منصات التواصل الاجتماعي لمشاركة رابط الإحالة الخاص بك.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-emerald-500" />
                  تابع أداء المحالين
                </h3>
                <p className="text-sm text-muted-foreground">
                  راقب نشاط المحالين لديك وشجعهم على المشاركة أكثر لزيادة أرباحك.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

