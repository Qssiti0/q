"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, ExternalLink, Gift, Trophy, Users, Wallet, Share2 } from "lucide-react"
import { OfferCard } from "@/components/offer-card"
import { TopEarners } from "@/components/top-earners"
import { UserNavigation } from "@/components/user-navigation"

export default function Home() {
  // حالة لتخزين الشركات المرئية
  const [visibleProviders, setVisibleProviders] = useState([
    { id: 1, name: "AdGateMedia", visible: true },
    { id: 2, name: "Torox", visible: true },
    { id: 3, name: "Lootbly", visible: true },
  ])

  // حالة لتخزين معلومات المستخدم الحالي
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // محاكاة جلب البيانات من الخادم
  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"
    setIsLoggedIn(userLoggedIn)

    if (userLoggedIn) {
      try {
        const userData = localStorage.getItem("currentUser")
        if (userData) {
          setCurrentUser(JSON.parse(userData))
        }
      } catch (err) {
        console.error("Error loading user data:", err)
      }
    }

    // جلب إعدادات ظهور الشركات
    try {
      const storedVisibility = localStorage.getItem("offerwallVisibility")
      if (storedVisibility) {
        setVisibleProviders(JSON.parse(storedVisibility))
      }
    } catch (err) {
      console.error("Error loading visibility settings:", err)
    }

    // إضافة مستمع للتغييرات في localStorage
    const handleStorageChange = () => {
      const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"
      setIsLoggedIn(userLoggedIn)

      if (userLoggedIn) {
        try {
          const userData = localStorage.getItem("currentUser")
          if (userData) {
            setCurrentUser(JSON.parse(userData))
          }
        } catch (err) {
          console.error("Error loading user data:", err)
        }
      } else {
        setCurrentUser(null)
      }
    }

    // تحديث البيانات كل 5 ثوانٍ
    const interval = setInterval(handleStorageChange, 5000)

    // تنظيف المستمع عند إزالة المكون
    return () => {
      clearInterval(interval)
    }
  }, [])

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn")
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    setCurrentUser(null)
    window.location.reload()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Coins className="w-6 h-6 text-emerald-500" />
            <span>CoinRewards</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#offers" className="font-medium transition-colors hover:text-emerald-500">
              العروض
            </Link>
            <Link href="/withdraw" className="font-medium transition-colors hover:text-emerald-500">
              سحب الأرباح
            </Link>
            <Link href="/referrals" className="font-medium transition-colors hover:text-emerald-500">
              الإحالات
            </Link>
            <Link href="#leaderboard" className="font-medium transition-colors hover:text-emerald-500">
              المتصدرون
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <UserNavigation user={currentUser} onLogout={handleLogout} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                    التسجيل
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    اربح العملات، واحصل على المكافآت
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    أكمل العروض، واربح العملات، واستبدلها ببطاقات الهدايا والعملات المشفرة والمزيد. انضم إلى آلاف
                    المستخدمين الذين يكسبون المكافآت يومياً.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href={isLoggedIn ? "#offers" : "/register"}>
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                      {isLoggedIn ? "استعرض العروض" : "ابدأ الربح الآن"}
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      كيف يعمل
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>+10,000 مستخدم</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gift className="w-4 h-4 text-emerald-500" />
                    <span>+500 مكافأة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <span>+1 مليون $ مدفوعات</span>
                  </div>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 lg:ml-auto">
                <Card className="w-full max-w-md border-2 border-emerald-100 dark:border-emerald-900/50">
                  <CardHeader>
                    <CardTitle className="text-center">العرض المميز</CardTitle>
                    <CardDescription className="text-center">لفترة محدودة: ضعف العملات!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <Gift className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">أكمل الاستطلاعات</h3>
                        <p className="text-sm text-muted-foreground">شارك برأيك واربح حتى 5,000 عملة لكل استطلاع</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">اربح 5,000 عملة</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {isLoggedIn && (
          <section className="w-full py-8 md:py-12">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-blue-50/50">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">رصيدك الحالي</p>
                        <p className="text-2xl font-bold">{currentUser?.coins?.toLocaleString() || 0} عملة</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${((currentUser?.coins || 0) / 1000).toFixed(2)}
                        </p>
                      </div>
                      <Coins className="h-10 w-10 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>

                <Link href="/withdraw" className="block">
                  <Card className="bg-green-50/50 h-full hover:border-emerald-500 transition-colors">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex justify-between items-center h-full">
                        <div>
                          <p className="text-sm text-muted-foreground">سحب الأرباح</p>
                          <p className="text-lg font-medium mt-1">حول عملاتك إلى أموال حقيقية</p>
                          <p className="text-sm text-muted-foreground mt-1">PayPal، عملات رقمية، بطاقات هدايا</p>
                        </div>
                        <Wallet className="h-10 w-10 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/referrals" className="block">
                  <Card className="bg-yellow-50/50 h-full hover:border-emerald-500 transition-colors">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex justify-between items-center h-full">
                        <div>
                          <p className="text-sm text-muted-foreground">دعوة الأصدقاء</p>
                          <p className="text-lg font-medium mt-1">اربح 10% من أرباح أصدقائك</p>
                          <p className="text-sm text-muted-foreground mt-1">شارك رابط الإحالة الخاص بك</p>
                        </div>
                        <Share2 className="h-10 w-10 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </section>
        )}

        <section id="offers" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">شركات العروض الشهيرة</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  اختر من شركائنا الموثوقين لكسب العملات من خلال الاستطلاعات والألعاب والمزيد
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* عرض الشركات المرئية فقط */}
              {visibleProviders
                .filter((provider) => provider.visible)
                .map((provider) => (
                  <Card
                    key={provider.id}
                    className="border-2 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-500 transition-colors"
                  >
                    <CardHeader>
                      <CardTitle>{provider.name}</CardTitle>
                      <CardDescription>
                        {provider.name === "AdGateMedia" && "استطلاعات وعروض وأكثر"}
                        {provider.name === "Torox" && "تثبيت تطبيقات الجوال والمشاركة"}
                        {provider.name === "Lootbly" && "ألعاب وعروض ترفيهية"}
                        {provider.name === "Pollfish" && "استطلاعات رأي مدفوعة"}
                        {provider.name === "Wannads" && "عروض وإعلانات متنوعة"}
                        {provider.name === "CPX Research" && "أبحاث واستطلاعات"}
                        {provider.name === "Notik" && "مشاهدة فيديوهات وإعلانات"}
                        {provider.name === "HangMyAds" && "تثبيت تطبيقات وألعاب"}
                        {provider.name === "Offertoro" && "عروض متنوعة ومكافآت"}
                        {provider.name === "OfferToro" && "عروض متنوعة ومكافآت"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {provider.name === "AdGateMedia" && "أكمل العروض واربح حتى 10,000 عملة"}
                            {provider.name === "Torox" && "ثبت التطبيقات واربح حتى 8,000 عملة"}
                            {provider.name === "Lootbly" && "العب الألعاب واربح حتى 15,000 عملة"}
                            {provider.name === "Pollfish" && "شارك في الاستطلاعات واربح حتى 12,000 عملة"}
                            {provider.name === "Wannads" && "أكمل العروض واربح حتى 7,000 عملة"}
                            {provider.name === "CPX Research" && "شارك في الأبحاث واربح حتى 9,000 عملة"}
                            {provider.name === "Notik" && "شاهد الفيديوهات واربح حتى 5,000 عملة"}
                            {provider.name === "HangMyAds" && "ثبت التطبيقات واربح حتى 8,500 عملة"}
                            {provider.name === "Offertoro" && "أكمل العروض واربح حتى 11,000 عملة"}
                            {provider.name === "OfferToro" && "أكمل العروض واربح حتى 11,000 عملة"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600">عرض العروض</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <OfferCard
                  title="أكمل الاستطلاعات"
                  description="شارك برأيك في مواضيع متنوعة"
                  coins={2500}
                  provider="AdGateMedia"
                />
                <OfferCard
                  title="ثبت تطبيقات الجوال"
                  description="جرب تطبيقات وألعاب جديدة"
                  coins={5000}
                  provider="Torox"
                />
                <OfferCard
                  title="شاهد الفيديوهات"
                  description="اربح أثناء مشاهدة المحتوى"
                  coins={1000}
                  provider="Lootbly"
                />
                <OfferCard
                  title="العب الألعاب"
                  description="صل إلى مستويات محددة في الألعاب الشهيرة"
                  coins={7500}
                  provider="Lootbly"
                />
                <OfferCard
                  title="اشترك في الإصدارات التجريبية"
                  description="جرب الخدمات المميزة مع الإصدارات التجريبية المجانية"
                  coins={10000}
                  provider="AdGateMedia"
                />
                <OfferCard
                  title="تسوق عبر الإنترنت"
                  description="اربح استرداد نقدي على مشترياتك"
                  coins={3000}
                  provider="Torox"
                />
              </div>
            </div>
          </div>
        </section>
        <section id="leaderboard" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">المتصدرون</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  شاهد من يكسب أكثر وتنافس على المركز الأول
                </p>
              </div>
            </div>
            <div className="mt-8">
              <TopEarners />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Coins className="w-5 h-5 text-emerald-500" />
              <span>CoinRewards</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              أكمل العروض، واربح العملات، واحصل على المكافآت. بهذه البساطة.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">المنصة</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#offers" className="transition-colors hover:text-emerald-500">
                    العروض
                  </Link>
                </li>
                <li>
                  <Link href="/withdraw" className="transition-colors hover:text-emerald-500">
                    سحب الأرباح
                  </Link>
                </li>
                <li>
                  <Link href="/referrals" className="transition-colors hover:text-emerald-500">
                    الإحالات
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">الدعم</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    الأسئلة الشائعة
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">قانوني</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    الشروط
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    الخصوصية
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    ملفات تعريف الارتباط
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">التواصل الاجتماعي</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    تويتر
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    ديسكورد
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-emerald-500">
                    انستغرام
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">© 2023 CoinRewards. جميع الحقوق محفوظة.</p>
            <p className="text-xs text-muted-foreground">صنع بـ ❤️ لمستخدمينا</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

