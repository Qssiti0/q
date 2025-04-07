"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VisibilityPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [offerwalls, setOfferwalls] = useState([
    { id: 1, name: "AdGateMedia", visible: true, homepage: true, priority: "high" },
    { id: 2, name: "Torox", visible: false, homepage: false, priority: "medium" },
    { id: 3, name: "Lootbly", visible: true, homepage: true, priority: "high" },
    { id: 4, name: "OfferToro", visible: true, homepage: false, priority: "low" },
    { id: 5, name: "AdscendMedia", visible: false, homepage: false, priority: "medium" },
    { id: 6, name: "Pollfish", visible: true, homepage: true, priority: "high" },
    { id: 7, name: "Wannads", visible: true, homepage: false, priority: "medium" },
    { id: 8, name: "CPX Research", visible: true, homepage: true, priority: "high" },
    { id: 9, name: "Admantium", visible: false, homepage: false, priority: "medium" },
    { id: 10, name: "Notik", visible: true, homepage: true, priority: "high" },
    { id: 11, name: "HangMyAds", visible: true, homepage: false, priority: "medium" },
  ])

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/admin/login")
    } else {
      // محاولة استرداد إعدادات الظهور من localStorage
      try {
        const savedOfferwalls = localStorage.getItem("offerwallVisibility")
        if (savedOfferwalls) {
          setOfferwalls(JSON.parse(savedOfferwalls))
        }
      } catch (err) {
        console.error("Error loading visibility settings:", err)
      }

      setIsLoading(false)
    }
  }, [router])

  const toggleVisibility = (id: number) => {
    setOfferwalls(
      offerwalls.map((offerwall) => (offerwall.id === id ? { ...offerwall, visible: !offerwall.visible } : offerwall)),
    )
  }

  const toggleHomepage = (id: number) => {
    setOfferwalls(
      offerwalls.map((offerwall) =>
        offerwall.id === id ? { ...offerwall, homepage: !offerwall.homepage } : offerwall,
      ),
    )
  }

  const updatePriority = (id: number, priority: string) => {
    setOfferwalls(offerwalls.map((offerwall) => (offerwall.id === id ? { ...offerwall, priority } : offerwall)))
  }

  const saveChanges = () => {
    try {
      // حفظ إعدادات الظهور في localStorage
      localStorage.setItem("offerwallVisibility", JSON.stringify(offerwalls))

      // تحديث الإعدادات في localStorage للصفحة الرئيسية
      localStorage.setItem("visibleProviders", JSON.stringify(offerwalls))

      setMessage({ type: "success", text: "تم حفظ التغييرات بنجاح" })

      // إخفاء الرسالة بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error saving visibility settings:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حفظ التغييرات" })
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
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة إلى لوحة التحكم
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">إدارة ظهور الشركات</h2>
          <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={saveChanges}>
            حفظ التغييرات
          </Button>
        </div>

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

        <Card>
          <CardHeader>
            <CardTitle>إعدادات الظهور العامة</CardTitle>
            <CardDescription>تحكم في ظهور العناصر المختلفة على المنصة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">الصفحة الرئيسية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>عرض قسم الشركات المميزة</Label>
                      <p className="text-xs text-muted-foreground">إظهار قسم الشركات المميزة على الصفحة الرئيسية</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>عرض قسم أفضل العروض</Label>
                      <p className="text-xs text-muted-foreground">إظهار قسم أفضل العروض على الصفحة الرئيسية</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>عرض قسم المتصدرين</Label>
                      <p className="text-xs text-muted-foreground">إظهار قسم المتصدرين على الصفحة الرئيسية</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">صفحة العروض</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>عرض تصنيفات العروض</Label>
                      <p className="text-xs text-muted-foreground">إظهار تصنيفات العروض المختلفة</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>عرض تفاصيل المكافآت</Label>
                      <p className="text-xs text-muted-foreground">إظهار تفاصيل المكافآت لكل عرض</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>عرض شعارات الشركات</Label>
                      <p className="text-xs text-muted-foreground">إظهار شعارات شركات العروض</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>إدارة ظهور شركات العروض</CardTitle>
            <CardDescription>تحكم في ظهور شركات العروض المختلفة على المنصة</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الشركة</TableHead>
                  <TableHead>الظهور</TableHead>
                  <TableHead>الظهور في الصفحة الرئيسية</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offerwalls.map((offerwall) => (
                  <TableRow key={offerwall.id}>
                    <TableCell className="font-medium">{offerwall.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch checked={offerwall.visible} onCheckedChange={() => toggleVisibility(offerwall.id)} />
                        <span className="mr-2">{offerwall.visible ? "ظاهر" : "مخفي"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={offerwall.homepage}
                          onCheckedChange={() => toggleHomepage(offerwall.id)}
                          disabled={!offerwall.visible}
                        />
                        <span className="mr-2">{offerwall.homepage ? "ظاهر" : "مخفي"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={offerwall.priority}
                        onValueChange={(value) => updatePriority(offerwall.id, value)}
                        disabled={!offerwall.visible}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="الأولوية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">عالية</SelectItem>
                          <SelectItem value="medium">متوسطة</SelectItem>
                          <SelectItem value="low">منخفضة</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            offerwall.visible
                              ? "bg-red-50 hover:bg-red-100 text-red-600"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                          }
                          onClick={() => toggleVisibility(offerwall.id)}
                        >
                          {offerwall.visible ? (
                            <>
                              <EyeOff className="h-4 w-4 ml-2" />
                              إخفاء
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 ml-2" />
                              إظهار
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

