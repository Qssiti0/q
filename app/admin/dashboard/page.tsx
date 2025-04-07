"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Coins,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Shield,
  Eye,
  Globe,
  Bell,
  Lock,
  Zap,
  DollarSign,
  Share2,
  Wallet,
  Menu,
  MessageSquare,
} from "lucide-react"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentActivities } from "@/components/admin/recent-activities"
import { UserManagement } from "@/components/admin/user-management"
import { OfferWallManagement } from "@/components/admin/offerwall-management"
import { VpnDetection } from "@/components/admin/vpn-detection"
import { CampaignManagement } from "@/components/admin/campaign-management"
import { FraudDetection } from "@/components/admin/fraud-detection"
import { ApiSettings } from "@/components/admin/api-settings"
import { ActivityLogs } from "@/components/admin/activity-logs"
import { VisibilitySettings } from "@/components/admin/visibility-settings"
import { PaymentManagement } from "@/components/admin/payment-management"
import { PlatformSettings } from "@/components/admin/platform-settings"
import { WithdrawalManagement } from "@/components/admin/withdrawal-management"
import { ReferralManagement } from "@/components/admin/referral-management"
import { UserMessaging } from "@/components/admin/user-messaging"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    checkAdminStatus()

    // إضافة مستمع للتخزين المحلي لمراقبة تغييرات تسجيل الدخول
    const handleStorageChange = () => {
      checkAdminStatus()
    }

    window.addEventListener("storage", handleStorageChange)

    // تنظيف المستمع عند إزالة المكون
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // استخراج القسم من هاش URL عند تحميل الصفحة
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || "overview"
      setActiveSection(hash)
    }

    // استدعاء الوظيفة عند التحميل وإضافة مستمع للتغييرات
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const checkAdminStatus = () => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }

    try {
      // محاولة استرداد بيانات المسؤول
      const adminData = localStorage.getItem("adminUser")
      if (adminData) {
        const admin = JSON.parse(adminData)
        setAdminEmail(admin.email || "qssitiabdo@gmail.com")
        setIsAdmin(true)
      } else {
        // إذا لم تكن هناك بيانات مسؤول، قم بتسجيل الخروج
        handleLogout()
        return
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
      handleLogout()
      return
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUser")
    setIsAdmin(false)
    router.push("/admin/login")
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    window.location.hash = section
    setMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري التحميل...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      {/* القائمة الجانبية للشاشات المتوسطة والكبيرة */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <Coins className="h-6 w-6 text-emerald-500" />
              <span>لوحة تحكم المسؤول</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "overview"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("overview")}
              >
                <LayoutDashboard className="h-4 w-4" />
                نظرة عامة
              </button>

              <div className="mt-6 px-3 text-xs font-semibold text-muted-foreground">إدارة المنصة</div>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "users"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("users")}
              >
                <Users className="h-4 w-4" />
                إدارة المستخدمين
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "messaging"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("messaging")}
              >
                <MessageSquare className="h-4 w-4" />
                الرسائل
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "offerwalls"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("offerwalls")}
              >
                <Coins className="h-4 w-4" />
                شركات العروض
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "campaigns"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("campaigns")}
              >
                <Zap className="h-4 w-4" />
                الحملات الإعلانية
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "payments"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("payments")}
              >
                <DollarSign className="h-4 w-4" />
                المدفوعات
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "withdrawals"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("withdrawals")}
              >
                <Wallet className="h-4 w-4" />
                طلبات السحب
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "referrals"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("referrals")}
              >
                <Share2 className="h-4 w-4" />
                نظام الإحالة
              </button>

              <div className="mt-6 px-3 text-xs font-semibold text-muted-foreground">الأمان والحماية</div>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "security"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("security")}
              >
                <Shield className="h-4 w-4" />
                الأمان وحظر VPN
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "fraud"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("fraud")}
              >
                <Lock className="h-4 w-4" />
                كشف الاحتيال
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "logs"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("logs")}
              >
                <Bell className="h-4 w-4" />
                سجلات النشاط
              </button>

              <div className="mt-6 px-3 text-xs font-semibold text-muted-foreground">الإعدادات</div>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "visibility"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("visibility")}
              >
                <Eye className="h-4 w-4" />
                إدارة الظهور
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "settings"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("settings")}
              >
                <Settings className="h-4 w-4" />
                إعدادات المنصة
              </button>

              <button
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                  activeSection === "api"
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => handleSectionChange("api")}
              >
                <Globe className="h-4 w-4" />
                إعدادات API
              </button>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          {/* زر القائمة للهواتف */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px] md:hidden">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center border-b px-4">
                  <div className="flex items-center gap-2 font-semibold">
                    <Coins className="h-6 w-6 text-emerald-500" />
                    <span>لوحة تحكم المسؤول</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-2 text-sm font-medium">
                    <button
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                        activeSection === "overview"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleSectionChange("overview")}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      نظرة عامة
                    </button>

                    <div className="mt-6 px-3 text-xs font-semibold text-muted-foreground">إدارة المنصة</div>

                    <button
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                        activeSection === "users"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleSectionChange("users")}
                    >
                      <Users className="h-4 w-4" />
                      إدارة المستخدمين
                    </button>

                    <button
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                        activeSection === "messaging"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleSectionChange("messaging")}
                    >
                      <MessageSquare className="h-4 w-4" />
                      الرسائل
                    </button>

                    <button
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                        activeSection === "offerwalls"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleSectionChange("offerwalls")}
                    >
                      <Coins className="h-4 w-4" />
                      شركات العروض
                    </button>

                    <button
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                        activeSection === "payments"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleSectionChange("payments")}
                    >
                      <DollarSign className="h-4 w-4" />
                      المدفوعات
                    </button>

                    <button
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-right transition-colors ${
                        activeSection === "visibility"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => handleSectionChange("visibility")}
                    >
                      <Eye className="h-4 w-4" />
                      إدارة الظهور
                    </button>
                  </nav>
                </div>
                <div className="mt-auto p-4">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            <h1 className="text-xl font-bold tracking-tight">لوحة تحكم المسؤول</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:inline-block">مرحباً، {adminEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 sm:ml-2" />
              <span className="hidden sm:inline-block">تسجيل الخروج</span>
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-8 p-4 md:gap-12 md:p-6 overflow-auto">
          {/* نظرة عامة */}
          {activeSection === "overview" && (
            <section id="overview" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">نظرة عامة على المنصة</h2>
              <AdminStats />

              <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <Card className="md:col-span-5">
                  <CardHeader>
                    <CardTitle>إحصائيات المنصة</CardTitle>
                    <CardDescription>إحصائيات وبيانات المنصة خلال الشهر الحالي</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                      <p className="text-muted-foreground">مخطط بياني للإحصائيات (سيتم تنفيذه لاحقاً)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>النشاطات الأخيرة</CardTitle>
                    <CardDescription>آخر الأنشطة على المنصة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivities />
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* إدارة المستخدمين */}
          {activeSection === "users" && (
            <section id="users" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة المستخدمين</h2>
              <UserManagement />
            </section>
          )}

          {/* الرسائل */}
          {activeSection === "messaging" && (
            <section id="messaging" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة الرسائل</h2>
              <UserMessaging />
            </section>
          )}

          {/* إدارة شركات العروض */}
          {activeSection === "offerwalls" && (
            <section id="offerwalls" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة شركات العروض</h2>
              <OfferWallManagement />
            </section>
          )}

          {/* الحملات الإعلانية */}
          {activeSection === "campaigns" && (
            <section id="campaigns" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة الحملات الإعلانية</h2>
              <CampaignManagement />
            </section>
          )}

          {/* إدارة المدفوعات */}
          {activeSection === "payments" && (
            <section id="payments" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة المدفوعات</h2>
              <PaymentManagement />
            </section>
          )}

          {/* طلبات السحب */}
          {activeSection === "withdrawals" && (
            <section id="withdrawals" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة طلبات السحب</h2>
              <WithdrawalManagement />
            </section>
          )}

          {/* نظام الإحالة */}
          {activeSection === "referrals" && (
            <section id="referrals" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة نظام الإحالة</h2>
              <ReferralManagement />
            </section>
          )}

          {/* الأمان وحظر VPN */}
          {activeSection === "security" && (
            <section id="security" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">الأمان وحظر VPN</h2>
              <VpnDetection />
            </section>
          )}

          {/* كشف الاحتيال */}
          {activeSection === "fraud" && (
            <section id="fraud" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">نظام كشف الاحتيال</h2>
              <FraudDetection />
            </section>
          )}

          {/* سجلات النشاط */}
          {activeSection === "logs" && (
            <section id="logs" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">سجلات النشاط</h2>
              <ActivityLogs />
            </section>
          )}

          {/* إدارة الظهور */}
          {activeSection === "visibility" && (
            <section id="visibility" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إدارة الظهور</h2>
              <VisibilitySettings />
            </section>
          )}

          {/* إعدادات المنصة */}
          {activeSection === "settings" && (
            <section id="settings" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إعدادات المنصة</h2>
              <PlatformSettings />
            </section>
          )}

          {/* إعدادات API */}
          {activeSection === "api" && (
            <section id="api" className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">إعدادات API</h2>
              <ApiSettings />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

