"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, CheckCircle, XCircle, Clock, Users, Settings, BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ReferralManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [allReferrals, setAllReferrals] = useState<any[]>([])
  const [referralSettings, setReferralSettings] = useState({
    enabled: true,
    commissionRate: 10,
    minWithdrawal: 5000,
    maxLevel: 1,
    allowMultipleTiers: false,
    payoutFrequency: "instant",
    requireVerification: true,
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // جلب جميع الإحالات
  useEffect(() => {
    try {
      // في تطبيق حقيقي، سيتم استدعاء API لجلب قائمة الإحالات
      // هنا نقوم بمحاكاة الإحالات من جميع المستخدمين

      // جلب قائمة المستخدمين
      const usersData = localStorage.getItem("registeredUsers")
      if (usersData) {
        const users = JSON.parse(usersData)

        // جمع الإحالات من جميع المستخدمين
        let allRefs: any[] = []

        users.forEach((user: any) => {
          const userReferrals = localStorage.getItem(`referrals_${user.id}`)
          if (userReferrals) {
            const refs = JSON.parse(userReferrals)
            allRefs = [...allRefs, ...refs]
          }
        })

        setAllReferrals(allRefs)
      }

      // جلب إعدادات نظام الإحالة
      const storedSettings = localStorage.getItem("referralSettings")
      if (storedSettings) {
        setReferralSettings(JSON.parse(storedSettings))
      } else {
        // إذا لم توجد إعدادات، احفظ الإعدادات الافتراضية
        localStorage.setItem("referralSettings", JSON.stringify(referralSettings))
      }
    } catch (err) {
      console.error("Error loading referrals:", err)
    }
  }, [])

  // حفظ إعدادات الإحالة
  const saveSettings = () => {
    try {
      localStorage.setItem("referralSettings", JSON.stringify(referralSettings))
      setMessage({ type: "success", text: "تم حفظ إعدادات نظام الإحالة بنجاح" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error saving referral settings:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حفظ الإعدادات" })
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">إدارة نظام الإحالة</h2>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="referrals">
            <Users className="mr-2 h-4 w-4" />
            الإحالات
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">إجمالي الإحالات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allReferrals.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500 inline-flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    نشطين: {allReferrals.filter((r) => r.status === "active").length}
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">متوسط الأرباح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allReferrals.length
                    ? (allReferrals.reduce((sum, r) => sum + (r.earnings || 0), 0) / allReferrals.length).toFixed(0)
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">لكل إحالة</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">معدل التحويل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allReferrals.length
                    ? `${Math.round((allReferrals.filter((r) => r.status === "active").length / allReferrals.length) * 100)}%`
                    : "0%"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">من معلق إلى نشط</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>أداء نظام الإحالة</CardTitle>
              <CardDescription>تحليل أداء برنامج الإحالة خلال الوقت</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">مخطط بياني لأداء نظام الإحالة (سيتم تنفيذه لاحقاً)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>جميع الإحالات</CardTitle>
                  <CardDescription>إدارة الإحالات بين المستخدمين</CardDescription>
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
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {allReferrals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">لا توجد إحالات مسجلة في النظام</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المحيل</TableHead>
                      <TableHead>المحال</TableHead>
                      <TableHead>تاريخ الانضمام</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>العروض المكتملة</TableHead>
                      <TableHead>الأرباح</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allReferrals
                      .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
                      .map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">{`مستخدم ${referral.referrerId}`}</TableCell>
                          <TableCell>{referral.referredUser.name}</TableCell>
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
                          <TableCell>{referral.earnings.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  referral.status === "active"
                                    ? "bg-red-50 hover:bg-red-100 text-red-600"
                                    : "bg-green-50 hover:bg-green-100 text-green-600"
                                }
                              >
                                {referral.status === "active" ? (
                                  <XCircle className="h-4 w-4" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات نظام الإحالة</CardTitle>
              <CardDescription>تكوين إعدادات برنامج الإحالة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تفعيل نظام الإحالة</Label>
                  <p className="text-xs text-muted-foreground">السماح للمستخدمين بإحالة أصدقائهم</p>
                </div>
                <Switch
                  checked={referralSettings.enabled}
                  onCheckedChange={(checked) => setReferralSettings({ ...referralSettings, enabled: checked })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>نسبة العمولة ({referralSettings.commissionRate}%)</Label>
                  <span className="text-sm font-medium">{referralSettings.commissionRate}%</span>
                </div>
                <Slider
                  defaultValue={[referralSettings.commissionRate]}
                  max={30}
                  step={1}
                  onValueChange={(value) => setReferralSettings({ ...referralSettings, commissionRate: value[0] })}
                />
                <p className="text-xs text-muted-foreground">النسبة المئوية من أرباح المحال التي سيحصل عليها المحيل</p>
              </div>

              <div className="space-y-2">
                <Label>الحد الأدنى للعملات للسحب</Label>
                <Input
                  type="number"
                  value={referralSettings.minWithdrawal}
                  onChange={(e) =>
                    setReferralSettings({ ...referralSettings, minWithdrawal: Number.parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  الحد الأدنى لعدد العملات المطلوبة للسحب من أرباح الإحالة
                </p>
              </div>

              <div className="space-y-2">
                <Label>تكرار الدفع</Label>
                <Select
                  value={referralSettings.payoutFrequency}
                  onValueChange={(value) => setReferralSettings({ ...referralSettings, payoutFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تكرار الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">فوري (عند كسب المحال للعملات)</SelectItem>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">متى يتم إضافة أرباح الإحالة إلى رصيد المحيل</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>طلب التحقق من الهوية للإحالة</Label>
                  <p className="text-xs text-muted-foreground">
                    يجب على المستخدم التحقق من هويته قبل المشاركة في برنامج الإحالة
                  </p>
                </div>
                <Switch
                  checked={referralSettings.requireVerification}
                  onCheckedChange={(checked) =>
                    setReferralSettings({ ...referralSettings, requireVerification: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>مستويات الإحالة المسموح بها</Label>
                <Select
                  value={referralSettings.maxLevel.toString()}
                  onValueChange={(value) =>
                    setReferralSettings({ ...referralSettings, maxLevel: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر عدد المستويات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">مستوى واحد فقط</SelectItem>
                    <SelectItem value="2">مستويان</SelectItem>
                    <SelectItem value="3">ثلاثة مستويات</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  عدد مستويات الإحالة المسموح بها (مثال: المستوى 2 يعني أنك تربح من الأشخاص الذين يحيلهم الأشخاص الذين
                  أحلتهم)
                </p>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={saveSettings}>
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

