"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit, Plus, Trash, Search, Calendar, BarChart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CampaignManagement() {
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [campaignName, setCampaignName] = useState("")
  const [campaignType, setCampaignType] = useState("مكافآت مضاعفة")
  const [campaignTarget, setCampaignTarget] = useState("جميع المستخدمين")
  const [campaignStartDate, setCampaignStartDate] = useState("")
  const [campaignEndDate, setCampaignEndDate] = useState("")
  const [campaignBudget, setCampaignBudget] = useState("")
  const [campaignStatus, setCampaignStatus] = useState(true)
  const [campaignDescription, setCampaignDescription] = useState("")

  const campaigns = [
    {
      id: 1,
      name: "حملة العودة إلى المدرسة",
      type: "مكافآت مضاعفة",
      status: true,
      startDate: "2023-09-01",
      endDate: "2023-09-30",
      target: "جميع المستخدمين",
      budget: "$5,000",
      spent: "$3,245",
      conversions: 1245,
    },
    {
      id: 2,
      name: "حملة العيد",
      type: "عروض خاصة",
      status: false,
      startDate: "2023-10-15",
      endDate: "2023-11-15",
      target: "مستخدمين جدد",
      budget: "$10,000",
      spent: "$0",
      conversions: 0,
    },
    {
      id: 3,
      name: "حملة نهاية العام",
      type: "مكافآت إضافية",
      status: true,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      target: "مستخدمين نشطين",
      budget: "$8,000",
      spent: "$2,100",
      conversions: 890,
    },
  ]

  const handleAddEdit = (campaign?: any) => {
    if (campaign) {
      setIsEditing(true)
      setSelectedCampaign(campaign)
      setCampaignName(campaign.name)
      setCampaignType(campaign.type)
      setCampaignTarget(campaign.target)
      setCampaignStartDate(campaign.startDate)
      setCampaignEndDate(campaign.endDate)
      setCampaignBudget(campaign.budget.replace("$", ""))
      setCampaignStatus(campaign.status)
    } else {
      setIsEditing(false)
      setSelectedCampaign(null)
      setCampaignName("")
      setCampaignType("مكافآت مضاعفة")
      setCampaignTarget("جميع المستخدمين")
      setCampaignStartDate("")
      setCampaignEndDate("")
      setCampaignBudget("")
      setCampaignStatus(true)
    }
    setOpenDialog(true)
  }

  const handleSave = () => {
    // هنا ستقوم بتنفيذ منطق الحفظ الفعلي
    console.log("Saving campaign:", selectedCampaign || "new campaign")
    setOpenDialog(false)
  }

  return (
    <>
      <Tabs defaultValue="active" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="active">الحملات النشطة</TabsTrigger>
            <TabsTrigger value="upcoming">الحملات القادمة</TabsTrigger>
            <TabsTrigger value="past">الحملات السابقة</TabsTrigger>
          </TabsList>
          <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة حملة جديدة
          </Button>
        </div>

        <TabsContent value="active" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>الحملات الإعلانية النشطة</CardTitle>
                  <CardDescription>إدارة الحملات الإعلانية النشطة حالياً</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="بحث في الحملات..." className="w-full bg-background pl-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الحملة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ البدء</TableHead>
                    <TableHead>تاريخ الانتهاء</TableHead>
                    <TableHead>الميزانية</TableHead>
                    <TableHead>الإنفاق</TableHead>
                    <TableHead>التحويلات</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns
                    .filter((c) => c.status)
                    .map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.type}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">نشطة</span>
                        </TableCell>
                        <TableCell>{campaign.startDate}</TableCell>
                        <TableCell>{campaign.endDate}</TableCell>
                        <TableCell>{campaign.budget}</TableCell>
                        <TableCell>{campaign.spent}</TableCell>
                        <TableCell>{campaign.conversions}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAddEdit(campaign)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <BarChart className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>الحملات الإعلانية القادمة</CardTitle>
              <CardDescription>الحملات المجدولة للمستقبل</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الحملة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>تاريخ البدء</TableHead>
                    <TableHead>تاريخ الانتهاء</TableHead>
                    <TableHead>الميزانية</TableHead>
                    <TableHead>الجمهور المستهدف</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns
                    .filter((c) => !c.status && new Date(c.startDate) > new Date())
                    .map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.type}</TableCell>
                        <TableCell>{campaign.startDate}</TableCell>
                        <TableCell>{campaign.endDate}</TableCell>
                        <TableCell>{campaign.budget}</TableCell>
                        <TableCell>{campaign.target}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleAddEdit(campaign)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>الحملات الإعلانية السابقة</CardTitle>
              <CardDescription>الحملات التي انتهت</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الحملة</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>تاريخ البدء</TableHead>
                    <TableHead>تاريخ الانتهاء</TableHead>
                    <TableHead>الميزانية</TableHead>
                    <TableHead>الإنفاق الفعلي</TableHead>
                    <TableHead>التحويلات</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{/* هنا ستعرض الحملات السابقة */}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "تعديل الحملة" : "إضافة حملة جديدة"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "قم بتعديل تفاصيل الحملة الإعلانية." : "أضف حملة إعلانية جديدة إلى المنصة."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم الحملة</Label>
              <Input
                id="name"
                value={campaignName}
                placeholder="أدخل اسم الحملة"
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">نوع الحملة</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع الحملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مكافآت مضاعفة">مكافآت مضاعفة</SelectItem>
                    <SelectItem value="عروض خاصة">عروض خاصة</SelectItem>
                    <SelectItem value="مكافآت إضافية">مكافآت إضافية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target">الجمهور المستهدف</Label>
                <Select value={campaignTarget} onValueChange={setCampaignTarget}>
                  <SelectTrigger id="target">
                    <SelectValue placeholder="اختر الجمهور المستهدف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جميع المستخدمين">جميع المستخدمين</SelectItem>
                    <SelectItem value="مستخدمين جدد">مستخدمين جدد</SelectItem>
                    <SelectItem value="مستخدمين نشطين">مستخدمين نشطين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={campaignStartDate}
                    onChange={(e) => setCampaignStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    value={campaignEndDate}
                    onChange={(e) => setCampaignEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="budget">الميزانية</Label>
                <div className="flex items-center">
                  <span className="absolute ml-3 text-muted-foreground">$</span>
                  <Input
                    id="budget"
                    type="number"
                    className="pl-6"
                    value={campaignBudget}
                    placeholder="0.00"
                    onChange={(e) => setCampaignBudget(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">الحالة</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={campaignStatus}
                    onCheckedChange={(checked) => setCampaignStatus(checked)}
                  />
                  <Label htmlFor="status" className="mr-2">
                    نشطة
                  </Label>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">وصف الحملة</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="أدخل وصفاً للحملة"
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
              {isEditing ? "تحديث" : "إضافة"} الحملة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

