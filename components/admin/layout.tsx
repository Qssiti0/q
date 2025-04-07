"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Gift,
  CreditCard,
  Shield,
  Globe,
  MessageSquare,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

// تصدير مسمى للتوافق مع الاستيرادات الحالية
export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // التحقق من تسجيل دخول المستخدم
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsLoggedIn(adminLoggedIn)

    // إذا لم يكن المستخدم مسجل دخول، قم بتوجيهه إلى صفحة تسجيل الدخول
    if (!adminLoggedIn && pathname !== "/admin/login") {
      window.location.href = "/admin/login"
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    window.location.href = "/admin/login"
  }

  const navItems = [
    { name: "لوحة التحكم", href: "/admin/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "إدارة المستخدمين", href: "/admin", icon: <Users className="h-5 w-5" /> },
    { name: "إدارة الدردشة", href: "/admin/chat", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "إدارة العروض", href: "/admin/visibility", icon: <Gift className="h-5 w-5" /> },
    { name: "إدارة السحوبات", href: "/admin/withdrawals", icon: <CreditCard className="h-5 w-5" /> },
    { name: "إعدادات API", href: "/admin/api", icon: <Globe className="h-5 w-5" /> },
    { name: "إعدادات المنصة", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
    { name: "الحماية والأمان", href: "/admin/security", icon: <Shield className="h-5 w-5" /> },
  ]

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* شريط التنقل العلوي للجوال */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex-1">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            لوحة الإدارة
          </Link>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* القائمة الجانبية للجوال */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-20 bg-background md:hidden">
          <nav className="grid gap-2 p-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              العودة للموقع
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  pathname === item.href
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Button variant="outline" className="mt-4" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              تسجيل الخروج
            </Button>
          </nav>
        </div>
      )}

      <div className="flex-1 md:grid md:grid-cols-[220px_1fr]">
        {/* القائمة الجانبية للحاسوب */}
        <aside className="fixed top-0 z-20 hidden h-screen w-full shrink-0 border-r md:sticky md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex h-14 items-center border-b px-4 font-semibold">لوحة الإدارة</div>
            <nav className="grid gap-2 px-2">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                العودة للموقع
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    pathname === item.href
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

// تصدير افتراضي أيضاً للتوافق مع الاستيرادات الجديدة
export default AdminLayout

