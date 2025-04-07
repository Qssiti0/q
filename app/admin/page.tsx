import { AdminLayout } from "@/components/admin/layout"
import { AdminStats } from "@/components/admin/admin-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { OfferWallManagement } from "@/components/admin/offerwall-management"
import { VpnDetection } from "@/components/admin/vpn-detection"
import { RecentActivities } from "@/components/admin/recent-activities"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">لوحة التحكم</h2>
        <AdminStats />

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>نظرة عامة</CardTitle>
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

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="offerwalls">شركات العروض</TabsTrigger>
            <TabsTrigger value="vpn">حماية المنصة</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="offerwalls" className="mt-4">
            <OfferWallManagement />
          </TabsContent>
          <TabsContent value="vpn" className="mt-4">
            <VpnDetection />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

