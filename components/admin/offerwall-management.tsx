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
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Edit, Plus, Trash, ExternalLink, Copy, Check, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function OfferWallManagement() {
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedOfferwall, setSelectedOfferwall] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("active")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [offerwalls, setOfferwalls] = useState([
    {
      id: 1,
      name: "AdGateMedia",
      apiKey: "agm_12345",
      apiSecret: "secret_12345",
      postbackUrl: "https://yoursite.com/api/callback/adgatemedia",
      callbackParams: "{user_id}={user_id}&amount={amount}&offer_id={offer_id}",
      status: true,
      visible: true,
      offers: 245,
      earnings: "$1,245.50",
      logo: "/images/adgatemedia.png",
      priority: "high",
    },
    {
      id: 2,
      name: "Torox",
      apiKey: "trx_67890",
      apiSecret: "secret_67890",
      postbackUrl: "https://yoursite.com/api/callback/torox",
      callbackParams: "user_id={user_id}&amount={amount}&transaction_id={transaction_id}",
      status: true,
      visible: true,
      offers: 178,
      earnings: "$987.25",
      logo: "/images/torox.png",
      priority: "medium",
    },
    {
      id: 3,
      name: "Lootbly",
      apiKey: "ltb_54321",
      apiSecret: "secret_54321",
      postbackUrl: "https://yoursite.com/api/callback/lootbly",
      callbackParams: "userid={user_id}&reward={amount}&offerid={offer_id}",
      status: true,
      visible: false,
      offers: 92,
      earnings: "$432.75",
      logo: "/images/lootbly.png",
      priority: "low",
    },
    {
      id: 4,
      name: "Pollfish",
      apiKey: "pol_98765",
      apiSecret: "secret_98765",
      postbackUrl: "https://yoursite.com/api/callback/pollfish",
      callbackParams: "user={user_id}&amount={amount}&survey_id={offer_id}",
      status: true,
      visible: true,
      offers: 150,
      earnings: "$876.30",
      logo: "/images/pollfish.png",
      priority: "high",
    },
    {
      id: 5,
      name: "CPX Research",
      apiKey: "cpx_24680",
      apiSecret: "secret_24680",
      postbackUrl: "https://yoursite.com/api/callback/cpx",
      callbackParams: "uid={user_id}&reward={amount}&survey={offer_id}",
      status: true,
      visible: true,
      offers: 120,
      earnings: "$654.20",
      logo: "/images/cpx.png",
      priority: "medium",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    apiSecret: "",
    postbackUrl: "",
    callbackParams: "",
    status: true,
    visible: true,
    priority: "medium",
    logo: "",
  })

  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [urlCopied, setUrlCopied] = useState(false)

  const handleAddEdit = (offerwall?: any) => {
    if (offerwall) {
      setIsEditing(true)
      setSelectedOfferwall(offerwall)
      setFormData({
        name: offerwall.name,
        apiKey: offerwall.apiKey,
        apiSecret: offerwall.apiSecret,
        postbackUrl: offerwall.postbackUrl,
        callbackParams: offerwall.callbackParams,
        status: offerwall.status,
        visible: offerwall.visible,
        priority: offerwall.priority,
        logo: offerwall.logo || "",
      })
    } else {
      setIsEditing(false)
      setSelectedOfferwall(null)
      setFormData({
        name: "",
        apiKey: "",
        apiSecret: "",
        postbackUrl: "https://yoursite.com/api/callback/",
        callbackParams: "",
        status: true,
        visible: true,
        priority: "medium",
        logo: "",
      })
    }
    setOpenDialog(true)
  }

  const handleSave = () => {
    try {
      if (!formData.name) {
        setMessage({ type: "error", text: "اسم الشركة مطلوب" })
        return
      }

      if (!formData.apiKey) {
        setMessage({ type: "error", text: "مفتاح API مطلوب" })
        return
      }

      if (isEditing && selectedOfferwall) {
        // تحديث الشركة الموجودة
        setOfferwalls(offerwalls.map((ow) => (ow.id === selectedOfferwall.id ? { ...ow, ...formData } : ow)))
        setMessage({ type: "success", text: "تم تحديث الشركة بنجاح" })
      } else {
        // إضافة شركة جديدة
        const newId = Math.max(0, ...offerwalls.map((ow) => ow.id)) + 1
        const newOfferwall = {
          id: newId,
          ...formData,
          offers: 0,
          earnings: "$0.00",
        }
        setOfferwalls([...offerwalls, newOfferwall])
        setMessage({ type: "success", text: "تمت إضافة الشركة بنجاح" })
      }

      // حفظ البيانات في localStorage
      localStorage.setItem("offerwallProviders", JSON.stringify(offerwalls))

      // إغلاق النافذة
      setOpenDialog(false)

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error saving offerwall:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حفظ البيانات" })
    }
  }

  const handleDelete = (id: number) => {
    try {
      setOfferwalls(offerwalls.filter((ow) => ow.id !== id))
      setMessage({ type: "success", text: "تم حذف الشركة بنجاح" })

      // حفظ البيانات في localStorage
      localStorage.setItem("offerwallProviders", JSON.stringify(offerwalls.filter((ow) => ow.id !== id)))

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error deleting offerwall:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف الشركة" })
    }
  }

  const toggleVisibility = (id: number) => {
    try {
      setOfferwalls(offerwalls.map((ow) => (ow.id === id ? { ...ow, visible: !ow.visible } : ow)))
      setMessage({ type: "success", text: "تم تحديث حالة الظهور بنجاح" })

      // حفظ البيانات في localStorage
      localStorage.setItem(
        "offerwallProviders",
        JSON.stringify(offerwalls.map((ow) => (ow.id === id ? { ...ow, visible: !ow.visible } : ow))),
      )

      // إخفاء رسالة النجاح بعد 3 ثوانٍ
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      console.error("Error toggling visibility:", err)
      setMessage({ type: "error", text: "حدث خطأ أثناء تحديث حالة الظهور" })
    }
  }

  const copyToClipboard = (text: string, type: "api" | "url") => {
    navigator.clipboard.writeText(text)
    if (type === "api") {
      setApiKeyCopied(true)
      setTimeout(() => setApiKeyCopied(false), 2000)
    } else {
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    }
  }

  const generateNewApiKey = () => {
    const newKey = `api_${Math.random().toString(36).substring(2, 15)}`
    setFormData({ ...formData, apiKey: newKey })
  }

  // تصفية حسب الحالة النشطة
  const filteredOfferwalls =
    activeTab === "all"
      ? offerwalls
      : activeTab === "active"
        ? offerwalls.filter((ow) => ow.visible)
        : offerwalls.filter((ow) => !ow.visible)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>إدارة شركات العروض</CardTitle>
            <CardDescription>إضافة وإدارة شركات العروض المتكاملة مع المنصة</CardDescription>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة شركة جديدة
          </Button>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert
              className={`mb-4 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              variant={message.type === "success" ? "default" : "destructive"}
            >
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="active">الشركات النشطة</TabsTrigger>
              <TabsTrigger value="hidden">الشركات المخفية</TabsTrigger>
              <TabsTrigger value="all">جميع الشركات</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشركة</TableHead>
                <TableHead>مفتاح API</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الظهور</TableHead>
                <TableHead>العروض</TableHead>
                <TableHead>الأرباح</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOfferwalls.map((offerwall) => (
                <TableRow key={offerwall.id}>
                  <TableCell className="font-medium">{offerwall.name}</TableCell>
                  <TableCell>
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                      {offerwall.apiKey}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={offerwall.status}
                      onCheckedChange={(checked) => {
                        setOfferwalls(
                          offerwalls.map((ow) => (ow.id === offerwall.id ? { ...ow, status: checked } : ow)),
                        )
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch checked={offerwall.visible} onCheckedChange={() => toggleVisibility(offerwall.id)} />
                  </TableCell>
                  <TableCell>{offerwall.offers}</TableCell>
                  <TableCell>{offerwall.earnings}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        offerwall.priority === "high"
                          ? "bg-green-100 text-green-800"
                          : offerwall.priority === "medium"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {offerwall.priority === "high" ? "مرتفعة" : offerwall.priority === "medium" ? "متوسطة" : "منخفضة"}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={
                          offerwall.visible
                            ? "bg-red-50 hover:bg-red-100 text-red-600"
                            : "bg-green-50 hover:bg-green-100 text-green-600"
                        }
                        onClick={() => toggleVisibility(offerwall.id)}
                      >
                        {offerwall.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleAddEdit(offerwall)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-red-50 hover:bg-red-100 text-red-600"
                        onClick={() => handleDelete(offerwall.id)}
                      >
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "تعديل شركة العروض" : "إضافة شركة عروض جديدة"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "تحديث بيانات شركة العروض." : "إضافة شركة عروض جديدة إلى المنصة."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">اسم الشركة</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: AdGateMedia"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="api-key">مفتاح API</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Input
                      id="api-key"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      placeholder="أدخل مفتاح API"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-2"
                      onClick={() => copyToClipboard(formData.apiKey, "api")}
                    >
                      {apiKeyCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button type="button" variant="outline" className="ml-2" onClick={generateNewApiKey}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-secret">API السري</Label>
                <Input
                  id="api-secret"
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                  placeholder="أدخل API السري"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="callback-url">عنوان Callback URL</Label>
              <div className="flex">
                <div className="relative flex-1">
                  <Input
                    id="callback-url"
                    value={formData.postbackUrl}
                    onChange={(e) => setFormData({ ...formData, postbackUrl: e.target.value })}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2"
                    onClick={() => copyToClipboard(formData.postbackUrl, "url")}
                  >
                    {urlCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2"
                  onClick={() => window.open("https://example.com", "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">قم بتوفير هذا العنوان لشركة العروض لتلقي إشعارات postback</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="callback-params">معلمات Callback</Label>
              <Textarea
                id="callback-params"
                value={formData.callbackParams}
                onChange={(e) => setFormData({ ...formData, callbackParams: e.target.value })}
                placeholder="user_id={user_id}&amount={amount}&offer_id={offer_id}"
              />
              <p className="text-xs text-muted-foreground">
                معلمات URL التي تتوقعها الشركة، استخدم {"{user_id}"} و {"{amount}"} و {"{offer_id}"} كمتغيرات
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">الحالة</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                  />
                  <Label htmlFor="status" className="mr-2">
                    نشط
                  </Label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="visible">الظهور</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visible"
                    checked={formData.visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                  />
                  <Label htmlFor="visible" className="mr-2">
                    ظاهر
                  </Label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">مرتفعة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="low">منخفضة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">رابط شعار الشركة</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">رابط URL لشعار الشركة (اختياري)</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
              {isEditing ? "تحديث" : "إضافة"} الشركة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

