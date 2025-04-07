"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, RefreshCw, Key, Globe, AlertTriangle, CheckCircle, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ApiSettings() {
  const [activeTab, setActiveTab] = useState("keys")
  const [apiKeyCopied, setApiKeyCopied] = useState(false)

  const handleCopyApiKey = () => {
    // محاكاة نسخ مفتاح API
    navigator.clipboard.writeText("sk_live_51NzQjKLkjHGfDgBhJkHGfDgBhJkHGfDgBh")
    setApiKeyCopied(true)
    setTimeout(() => setApiKeyCopied(false), 2000)
  }

  const handleGenerateNewKey = () => {
    // محاكاة إنشاء مفتاح API جديد
    alert("تم إنشاء مفتاح API جديد")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">مفاتيح API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="providers">مزودي الخدمة</TabsTrigger>
          <TabsTrigger value="logs">سجلات API</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>مفاتيح API</CardTitle>
              <CardDescription>إدارة مفاتيح API للوصول إلى واجهة برمجة التطبيقات الخاصة بالمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  مفاتيح API حساسة للغاية. لا تشاركها مع أي شخص ولا تقم بتضمينها في كود مفتوح المصدر.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>مفتاح API الحي (Live)</Label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <Input
                        type="password"
                        value="sk_live_51NzQjKLkjHGfDgBhJkHGfDgBhJkHGfDgBh"
                        readOnly={true}
                        className="pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={handleCopyApiKey}
                      >
                        {apiKeyCopied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button variant="outline" size="icon" className="ml-2" onClick={handleGenerateNewKey}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    استخدم هذا المفتاح في بيئة الإنتاج. سيتم محاسبتك على جميع الطلبات التي تتم باستخدام هذا المفتاح.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>مفتاح API التجريبي (Test)</Label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <Input
                        type="password"
                        value="sk_test_51NzQjKLkjHGfDgBhJkHGfDgBhJkHGfDgBh"
                        readOnly={true}
                        className="pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={() => navigator.clipboard.writeText("sk_test_51NzQjKLkjHGfDgBhJkHGfDgBhJkHGfDgBh")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="icon" className="ml-2" onClick={handleGenerateNewKey}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    استخدم هذا المفتاح في بيئة التطوير والاختبار. لن يتم محاسبتك على الطلبات التي تتم باستخدام هذا
                    المفتاح.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">إعدادات الأمان</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تقييد الوصول حسب عنوان IP</Label>
                    <p className="text-xs text-muted-foreground">تقييد الوصول إلى API من عناوين IP محددة فقط</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>عناوين IP المسموح بها</Label>
                  <Input placeholder="أدخل عناوين IP مفصولة بفواصل (مثال: 192.168.1.1, 10.0.0.1)" />
                  <p className="text-xs text-muted-foreground">اترك هذا الحقل فارغاً للسماح بالوصول من أي عنوان IP</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تسجيل جميع طلبات API</Label>
                    <p className="text-xs text-muted-foreground">الاحتفاظ بسجل لجميع طلبات API</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>حد الطلبات (Rate Limiting)</Label>
                    <p className="text-xs text-muted-foreground">تقييد عدد الطلبات لكل دقيقة</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>الحد الأقصى للطلبات في الدقيقة</Label>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات Webhooks</CardTitle>
              <CardDescription>إعداد وإدارة webhooks لتلقي الإشعارات في الوقت الفعلي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>عنوان URL للـ Webhook</Label>
                  <Input placeholder="https://example.com/webhook" />
                  <p className="text-xs text-muted-foreground">عنوان URL الذي سيتم إرسال الإشعارات إليه</p>
                </div>

                <div className="space-y-2">
                  <Label>سر Webhook</Label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <Input
                        type="password"
                        value="whsec_1234567890abcdefghijklmnopqrstuvwxyz"
                        readOnly={true}
                        className="pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={() => navigator.clipboard.writeText("whsec_1234567890abcdefghijklmnopqrstuvwxyz")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="icon" className="ml-2">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    يستخدم هذا السر للتحقق من صحة الإشعارات المرسلة إلى webhook الخاص بك
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>أحداث Webhook</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="event-user-register" defaultChecked />
                      <Label htmlFor="event-user-register" className="mr-2">
                        تسجيل مستخدم جديد
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-offer-complete" defaultChecked />
                      <Label htmlFor="event-offer-complete" className="mr-2">
                        إكمال عرض
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-payment" defaultChecked />
                      <Label htmlFor="event-payment" className="mr-2">
                        معاملة دفع
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-fraud" defaultChecked />
                      <Label htmlFor="event-fraud" className="mr-2">
                        اكتشاف احتيال
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ إعدادات Webhook</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>مزودي الخدمة</CardTitle>
              <CardDescription>إعداد وإدارة مزودي الخدمة المتكاملين مع المنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Pollfish", icon: <Globe className="h-5 w-5" /> },
                  { name: "Wannads", icon: <Globe className="h-5 w-5" /> },
                  { name: "CPX Research", icon: <Globe className="h-5 w-5" /> },
                  { name: "Lootably", icon: <Globe className="h-5 w-5" /> },
                  { name: "Admantium", icon: <Globe className="h-5 w-5" /> },
                  { name: "Notik", icon: <Globe className="h-5 w-5" /> },
                  { name: "HangMyAds", icon: <Globe className="h-5 w-5" /> },
                  { name: "AdGem", icon: <Globe className="h-5 w-5" /> },
                  { name: "Offertoro", icon: <Globe className="h-5 w-5" /> },
                  { name: "Adgate Media", icon: <Globe className="h-5 w-5" /> },
                  { name: "OGads", icon: <Globe className="h-5 w-5" /> },
                  { name: "Proxycheck.io", icon: <Shield className="h-5 w-5" /> },
                ].map((provider) => (
                  <Card key={provider.name} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">{provider.icon}</div>
                          <div>
                            <h4 className="font-medium">{provider.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {provider.name === "Proxycheck.io" ? "خدمة كشف VPN" : "مزود عروض"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          defaultChecked={
                            provider.name !== "Admantium" && provider.name !== "AdGem" && provider.name !== "OGads"
                          }
                        />
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label>مفتاح API</Label>
                          <div className="flex items-center">
                            <Input id="api-key" type="password" defaultValue="••••••••••••••••" className="flex-1" />
                            <Button variant="outline" size="icon" className="ml-2">
                              <Key className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ إعدادات المزودين</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>سجلات API</CardTitle>
              <CardDescription>عرض سجلات طلبات API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div
                      className={`p-2 rounded-full ${
                        i % 3 === 0 ? "bg-green-100" : i % 3 === 1 ? "bg-blue-100" : "bg-red-100"
                      }`}
                    >
                      {i % 3 === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : i % 3 === 1 ? (
                        <Globe className="h-5 w-5 text-blue-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {i % 3 === 0 ? "طلب ناجح" : i % 3 === 1 ? "طلب webhook" : "طلب فاشل"}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {i % 3 === 0
                              ? "GET /api/users"
                              : i % 3 === 1
                                ? "POST /webhook/offer-complete"
                                : "POST /api/payments"}
                          </p>
                        </div>
                        <div className="flex items-center">
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
                                ? "bg-green-100 text-green-800"
                                : i % 3 === 1
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {i % 3 === 0 ? "200 OK" : i % 3 === 1 ? "202 Accepted" : "400 Bad Request"}
                          </span>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
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

