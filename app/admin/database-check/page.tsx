import { DatabaseCheck } from "@/components/database-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server } from "lucide-react"

export default function DatabaseCheckPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">التحقق من قاعدة البيانات</h1>
        <p className="text-muted-foreground">تحقق من أن البيانات مخزنة في Redis وليس فقط في التخزين المحلي</p>
      </div>

      <div className="grid gap-6">
        <DatabaseCheck />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              كيف تعمل الدردشة مع Redis؟
            </CardTitle>
            <CardDescription>شرح لكيفية تخزين بيانات الدردشة في قاعدة بيانات Redis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. تخزين الرسائل</h3>
                <p className="text-sm text-muted-foreground">
                  عندما يرسل المستخدم رسالة، يتم إرسالها إلى الخادم عبر API، ثم يتم تخزينها في Redis باستخدام مفتاح
                  <code className="bg-muted px-1 rounded">chat:group:messages</code>
                  كقائمة. هذا يضمن أن الرسائل متاحة لجميع المستخدمين وعبر جميع الأجهزة.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">2. استرجاع الرسائل</h3>
                <p className="text-sm text-muted-foreground">
                  عند تحميل صفحة الدردشة، يتم جلب الرسائل من Redis عبر API. هذا يعني أن المستخدمين سيرون نفس الرسائل بغض
                  النظر عن الجهاز الذي يستخدمونه.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">3. حذف الرسائل</h3>
                <p className="text-sm text-muted-foreground">
                  عندما يقوم المشرف بحذف رسالة، يتم إرسال طلب حذف إلى API، الذي يقوم بدوره بحذف الرسالة من Redis. هذا
                  يضمن أن الرسالة تُحذف للجميع.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">4. الفرق بين Redis والتخزين المحلي</h3>
                <p className="text-sm text-muted-foreground">
                  التخزين المحلي (localStorage) يخزن البيانات فقط في متصفح المستخدم الحالي، بينما Redis يخزن البيانات
                  على الخادم، مما يجعلها متاحة لجميع المستخدمين وعبر جميع الأجهزة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

