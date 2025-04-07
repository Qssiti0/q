"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Bell, Shield, Upload } from "lucide-react"

export function PlatformSettings() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="authentication">المصادقة</TabsTrigger>
          <TabsTrigger value="integrations">التكاملات</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>إعدادات عامة للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>اسم المنصة</Label>
                  <Input defaultValue="CoinRewards" />
                </div>

                <div className="space-y-2">
                  <Label>وصف المنصة</Label>
                  <Input defaultValue="أكمل العروض، واربح العملات، واستبدلها بمكافآت" />
                </div>

                <div className="space-y-2">
                  <Label>البريد الإلكتروني للدعم</Label>
                  <Input defaultValue="support@coinrewards.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اللغة الافتراضية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">الإنجليزية</SelectItem>
                        <SelectItem value="fr">الفرنسية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>المنطقة الزمنية</Label>
                    <Select defaultValue="asia_riyadh">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المنطقة الزمنية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia_riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="europe_london">لندن (GMT+0)</SelectItem>
                        <SelectItem value="america_new_york">نيويورك (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>وضع الصيانة</Label>
                    <p className="text-xs text-muted-foreground">تفعيل وضع الصيانة للمنصة</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تسجيل المستخدمين الجدد</Label>
                    <p className="text-xs text-muted-foreground">السماح بتسجيل مستخدمين جدد</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المظهر</CardTitle>
              <CardDescription>تخصيص مظهر المنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>شعار المنصة</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <Button variant="outline">تحميل شعار جديد</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>أيقونة المنصة (Favicon)</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-md border flex items-center justify-center bg-muted">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button variant="outline">تحميل أيقونة جديدة</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>اللون الرئيسي</Label>
                  <div className="flex items-center gap-4">
                    <Input type="color" defaultValue="#10b981" className="w-16 h-10 p-1" />
                    <Input defaultValue="#10b981" className="w-32" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>اللون الثانوي</Label>
                  <div className="flex items-center gap-4">
                    <Input type="color" defaultValue="#6366f1" className="w-16 h-10 p-1" />
                    <Input defaultValue="#6366f1" className="w-32" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الوضع المظلم</Label>
                    <p className="text-xs text-muted-foreground">تفعيل الوضع المظلم للمنصة</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تبديل الوضع المظلم تلقائياً</Label>
                    <p className="text-xs text-muted-foreground">تبديل الوضع المظلم تلقائياً حسب إعدادات المستخدم</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>تكوين إعدادات الإشعارات للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">إشعارات المستخدمين</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>إشعارات البريد الإلكتروني</Label>
                    <p className="text-xs text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني للمستخدمين</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>إشعارات داخل الموقع</Label>
                    <p className="text-xs text-muted-foreground">عرض إشعارات داخل الموقع للمستخدمين</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>أحداث إشعارات المستخدمين</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="event-offer-complete" defaultChecked />
                      <Label htmlFor="event-offer-complete" className="mr-2">
                        إكمال عرض
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-payment-status" defaultChecked />
                      <Label htmlFor="event-payment-status" className="mr-2">
                        تغيير حالة طلب السحب
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-account-status" defaultChecked />
                      <Label htmlFor="event-account-status" className="mr-2">
                        تغيير حالة الحساب
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="event-new-offers" defaultChecked />
                      <Label htmlFor="event-new-offers" className="mr-2">
                        عروض جديدة
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium">إشعارات المسؤولين</h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-new-user" defaultChecked />
                      <Label htmlFor="admin-new-user" className="mr-2">
                        تسجيل مستخدم جديد
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-payment-request" defaultChecked />
                      <Label htmlFor="admin-payment-request" className="mr-2">
                        طلب سحب جديد
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-fraud-detection" defaultChecked />
                      <Label htmlFor="admin-fraud-detection" className="mr-2">
                        اكتشاف احتيال
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-system-error" defaultChecked />
                      <Label htmlFor="admin-system-error" className="mr-2">
                        أخطاء النظام
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المصادقة</CardTitle>
              <CardDescription>تكوين إعدادات المصادقة وأمان الحسابات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>المصادقة الثنائية (2FA)</Label>
                    <p className="text-xs text-muted-foreground">تفعيل المصادقة الثنائية للمستخدمين</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>إلزام المصادقة الثنائية للمسؤولين</Label>
                    <p className="text-xs text-muted-foreground">إلزام المسؤولين باستخدام المصادقة الثنائية</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تكامل Google Authenticator</Label>
                    <p className="text-xs text-muted-foreground">استخدام Google Authenticator للمصادقة الثنائية</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>مدة صلاحية الجلسة (بالدقائق)</Label>
                  <Input type="number" defaultValue="60" />
                  <p className="text-xs text-muted-foreground">
                    مدة صلاحية جلسة المستخدم قبل الحاجة لإعادة تسجيل الدخول
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>سياسة كلمة المرور</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="password-min-length" defaultChecked />
                      <Label htmlFor="password-min-length" className="mr-2">
                        الحد الأدنى 8 أحرف
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="password-uppercase" defaultChecked />
                      <Label htmlFor="password-uppercase" className="mr-2">
                        حرف كبير واحد على الأقل
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="password-number" defaultChecked />
                      <Label htmlFor="password-number" className="mr-2">
                        رقم واحد على الأقل
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="password-special" defaultChecked />
                      <Label htmlFor="password-special" className="mr-2">
                        حرف خاص واحد على الأقل
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التكاملات</CardTitle>
              <CardDescription>إدارة تكاملات المنصة مع خدمات خارجية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        خدمة البريد الإلكتروني
                      </CardTitle>
                      <Switch defaultChecked />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مزود خدمة البريد</Label>
                      <Select defaultValue="smtp">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مزود خدمة البريد" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>مفتاح API</Label>
                      <Input type="password" value="••••••••••••••••" readOnly />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-500" />
                        Proxycheck.io
                      </CardTitle>
                      <Switch defaultChecked />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مفتاح API</Label>
                      <Input type="password" value="••••••••••••••••" readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>مستوى الكشف</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الكشف" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">منخفض</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="high">عالي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-500" />
                        الدردشة المباشرة
                      </CardTitle>
                      <Switch />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مزود خدمة الدردشة</Label>
                      <Select defaultValue="intercom">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مزود خدمة الدردشة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="intercom">Intercom</SelectItem>
                          <SelectItem value="crisp">Crisp</SelectItem>
                          <SelectItem value="tawk">Tawk.to</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>معرف الدردشة</Label>
                      <Input placeholder="أدخل معرف الدردشة" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="h-5 w-5 text-yellow-500" />
                        إشعارات الجوال
                      </CardTitle>
                      <Switch />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>مزود خدمة الإشعارات</Label>
                      <Select defaultValue="firebase">
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مزود خدمة الإشعارات" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="firebase">Firebase</SelectItem>
                          <SelectItem value="onesignal">OneSignal</SelectItem>
                          <SelectItem value="pusher">Pusher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>مفتاح API</Label>
                      <Input placeholder="أدخل مفتاح API" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600">حفظ الإعدادات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

