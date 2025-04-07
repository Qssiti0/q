"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Ban, Eye, Search, Shield, UserX, Clock, RefreshCw } from "lucide-react"

export function FraudDetection() {
  const [activeTab, setActiveTab] = useState("settings")

  const suspiciousActivities = [
    {
      id: 1,
      user: "ahmed@example.com",
      activity: "تسجيلات متعددة",
      date: "2023-09-15 14:30",
      risk: "عالي",
      details: "5 حسابات من نفس عنوان IP",
      status: "قيد المراجعة",
    },
    {
      id: 2,
      user: "sara@example.com",
      activity: "محاولات تلاعب",
      date: "2023-09-14 10:15",
      risk: "متوسط",
      details: "محاولات متكررة لإكمال نفس العرض",
      status: "تم الحظر",
    },
    {
      id: 3,
      user: "mohammed@example.com",
      activity: "استخدام VPN",
      date: "2023-09-13 18:45",
      risk: "عالي",
      details: "تغيير متكرر للموقع الجغرافي",
      status: "تم الحظر",
    },
    {
      id: 4,
      user: "fatima@example.com",
      activity: "نشاط غير طبيعي",
      date: "2023-09-12 09:20",
      risk: "منخفض",
      details: "إكمال عدد كبير من العروض في وقت قصير",
      status: "قيد المراجعة",
    },
    {
      id: 5,
      user: "omar@example.com",
      activity: "تلاعب بالنقرات",
      date: "2023-09-11 16:10",
      risk: "عالي",
      details: "نقرات متكررة على نفس الإعلانات",
      status: "تم التجاهل",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">إعدادات كشف الاحتيال</TabsTrigger>
          <TabsTrigger value="activities">الأنشطة المشبوهة</TabsTrigger>
          <TabsTrigger value="logs">سجلات الكشف</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات نظام كشف الاحتيال</CardTitle>
              <CardDescription>تكوين قواعد وإعدادات كشف الاحتيال على المنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">الكشف عن الحسابات المتعددة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل الكشف عن الحسابات المتعددة</Label>
                        <p className="text-xs text-muted-foreground">
                          كشف المستخدمين الذين يقومون بإنشاء حسابات متعددة
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>مستوى الحساسية</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الحساسية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض - فقط الحالات المؤكدة</SelectItem>
                          <SelectItem value="medium">متوسط - توازن بين الدقة والحساسية</SelectItem>
                          <SelectItem value="high">عالي - كشف جميع الحالات المشبوهة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">كشف التلاعب بالنقرات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل كشف التلاعب بالنقرات</Label>
                        <p className="text-xs text-muted-foreground">كشف النقرات المتكررة والمتلاعب بها</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>الحد الأقصى للنقرات في الدقيقة</Label>
                      <Input type="number" defaultValue="30" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">كشف النشاط غير الطبيعي</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل كشف النشاط غير الطبيعي</Label>
                        <p className="text-xs text-muted-foreground">كشف أنماط النشاط غير الطبيعية</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>الحد الأقصى للعروض في الساعة</Label>
                      <Input type="number" defaultValue="15" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">تكامل Proxycheck.io</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تفعيل تكامل Proxycheck.io</Label>
                        <p className="text-xs text-muted-foreground">استخدام Proxycheck.io للكشف عن VPN والبروكسي</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>مفتاح API</Label>
                      <Input type="password" value="••••••••••••••••" readOnly={true} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">الإجراءات التلقائية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>حظر تلقائي للنشاط المشبوه</Label>
                      <p className="text-xs text-muted-foreground">حظر المستخدمين تلقائياً عند اكتشاف نشاط مشبوه</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تعليق المدفوعات للحسابات المشبوهة</Label>
                      <p className="text-xs text-muted-foreground">
                        تعليق المدفوعات للحسابات التي تم اكتشاف نشاط مشبوه فيها
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات البريد الإلكتروني للمسؤولين</Label>
                      <p className="text-xs text-muted-foreground">
                        إرسال إشعارات بالبريد الإلكتروني للمسؤولين عند اكتشاف نشاط مشبوه
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>الأنشطة المشبوهة</CardTitle>
                  <CardDescription>قائمة بالأنشطة المشبوهة التي تم اكتشافها</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="بحث..." className="w-full bg-background pl-8" />
                  </div>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>النشاط المشبوه</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>مستوى الخطورة</TableHead>
                    <TableHead>التفاصيل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.activity}</TableCell>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            activity.risk === "عالي"
                              ? "bg-red-100 text-red-800"
                              : activity.risk === "متوسط"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {activity.risk}
                        </span>
                      </TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            activity.status === "تم الحظر"
                              ? "bg-red-100 text-red-800"
                              : activity.status === "قيد المراجعة"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 ml-2" />
                            عرض
                          </Button>
                          {activity.status !== "تم الحظر" && (
                            <Button variant="outline" size="sm" className="bg-red-50 hover:bg-red-100 text-red-600">
                              <Ban className="h-4 w-4 ml-2" />
                              حظر
                            </Button>
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

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>سجلات كشف الاحتيال</CardTitle>
              <CardDescription>سجلات تفصيلية لعمليات كشف الاحتيال</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div
                      className={`p-2 rounded-full ${
                        i % 3 === 0 ? "bg-red-100" : i % 3 === 1 ? "bg-yellow-100" : "bg-blue-100"
                      }`}
                    >
                      {i % 3 === 0 ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : i % 3 === 1 ? (
                        <UserX className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {i % 3 === 0
                              ? "تم اكتشاف استخدام VPN"
                              : i % 3 === 1
                                ? "تم اكتشاف حسابات متعددة"
                                : "تم اكتشاف نشاط غير طبيعي"}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {i % 3 === 0
                              ? "تم اكتشاف استخدام VPN من قبل المستخدم user123@example.com"
                              : i % 3 === 1
                                ? "تم اكتشاف 3 حسابات مرتبطة بنفس عنوان IP"
                                : "تم اكتشاف إكمال 20 عرضاً في أقل من ساعة"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground ml-1" />
                          <span className="text-xs text-muted-foreground">
                            {`2023-09-${15 - i} ${10 + i}:${30 - i * 5}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              i % 3 === 0
                                ? "bg-red-100 text-red-800"
                                : i % 3 === 1
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {i % 3 === 0 ? "عالي" : i % 3 === 1 ? "متوسط" : "منخفض"}
                          </span>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 ml-2" />
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

