"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, RefreshCw, User, Coins, Shield, Ban, Clock, Eye } from "lucide-react"

export function ActivityLogs() {
  const [filter, setFilter] = useState("all")

  const activities = [
    {
      id: 1,
      type: "user_login",
      user: "ahmed@example.com",
      details: "تسجيل دخول ناجح",
      ip: "192.168.1.1",
      date: "2023-09-15 14:30:22",
      userAgent: "Chrome/Windows",
    },
    {
      id: 2,
      type: "offer_complete",
      user: "sara@example.com",
      details: "إكمال عرض: استطلاع رأي",
      amount: 500,
      provider: "Pollfish",
      date: "2023-09-15 13:45:10",
      ip: "45.123.45.67",
    },
    {
      id: 3,
      type: "payment_request",
      user: "mohammed@example.com",
      details: "طلب سحب: PayPal",
      amount: 10,
      status: "معلق",
      date: "2023-09-15 12:20:05",
      ip: "78.90.123.45",
    },
    {
      id: 4,
      type: "user_banned",
      user: "omar@example.com",
      details: "تم حظر المستخدم: استخدام VPN",
      admin: "admin@example.com",
      date: "2023-09-15 11:15:30",
      ip: "123.45.67.89",
    },
    {
      id: 5,
      type: "settings_changed",
      admin: "admin@example.com",
      details: "تغيير إعدادات المنصة",
      changes: "تحديث معدل تحويل العملات",
      date: "2023-09-15 10:05:12",
      ip: "192.168.1.100",
    },
    {
      id: 6,
      type: "user_register",
      user: "fatima@example.com",
      details: "تسجيل مستخدم جديد",
      referrer: "direct",
      date: "2023-09-15 09:30:45",
      ip: "98.76.54.32",
    },
    {
      id: 7,
      type: "fraud_detected",
      user: "unknown@example.com",
      details: "محاولة احتيال: حسابات متعددة",
      action: "تم الحظر",
      date: "2023-09-15 08:20:18",
      ip: "45.67.89.12",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_login":
      case "user_register":
        return <User className="h-4 w-4 text-blue-500" />
      case "offer_complete":
        return <Coins className="h-4 w-4 text-emerald-500" />
      case "payment_request":
        return <Coins className="h-4 w-4 text-yellow-500" />
      case "user_banned":
        return <Ban className="h-4 w-4 text-red-500" />
      case "settings_changed":
        return <Shield className="h-4 w-4 text-purple-500" />
      case "fraud_detected":
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredActivities =
    filter === "all" ? activities : activities.filter((activity) => activity.type.includes(filter))

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>سجلات النشاط</CardTitle>
            <CardDescription>سجل تفصيلي لجميع الأنشطة على المنصة</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="بحث..." className="w-full sm:w-64 pl-8" readOnly={true} />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="تصفية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنشطة</SelectItem>
                <SelectItem value="user">أنشطة المستخدمين</SelectItem>
                <SelectItem value="offer">العروض</SelectItem>
                <SelectItem value="payment">المدفوعات</SelectItem>
                <SelectItem value="fraud">الاحتيال</SelectItem>
                <SelectItem value="settings">الإعدادات</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>النوع</TableHead>
              <TableHead>المستخدم</TableHead>
              <TableHead>التفاصيل</TableHead>
              <TableHead>عنوان IP</TableHead>
              <TableHead>التاريخ والوقت</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <span>
                      {activity.type === "user_login" && "تسجيل دخول"}
                      {activity.type === "user_register" && "تسجيل مستخدم"}
                      {activity.type === "offer_complete" && "إكمال عرض"}
                      {activity.type === "payment_request" && "طلب سحب"}
                      {activity.type === "user_banned" && "حظر مستخدم"}
                      {activity.type === "settings_changed" && "تغيير إعدادات"}
                      {activity.type === "fraud_detected" && "اكتشاف احتيال"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{activity.user || activity.admin || "النظام"}</TableCell>
                <TableCell>{activity.details}</TableCell>
                <TableCell>{activity.ip}</TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 ml-2" />
                    التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

