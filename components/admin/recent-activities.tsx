import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Ban, Check, Coins, UserPlus } from "lucide-react"

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "user_register",
      user: "محمد أحمد",
      time: "منذ 5 دقائق",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      type: "coins_added",
      user: "سارة خالد",
      amount: 5000,
      time: "منذ 15 دقيقة",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      type: "user_banned",
      user: "أحمد محمود",
      time: "منذ 45 دقيقة",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      type: "offerwall_added",
      name: "OfferToro",
      time: "منذ ساعة",
    },
    {
      id: 5,
      type: "user_unbanned",
      user: "فاطمة علي",
      time: "منذ 3 ساعات",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_register":
        return <UserPlus className="h-4 w-4 text-emerald-500" />
      case "coins_added":
        return <Coins className="h-4 w-4 text-yellow-500" />
      case "user_banned":
        return <Ban className="h-4 w-4 text-red-500" />
      case "user_unbanned":
        return <Check className="h-4 w-4 text-emerald-500" />
      default:
        return <Coins className="h-4 w-4 text-emerald-500" />
    }
  }

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "user_register":
        return `تسجيل مستخدم جديد: ${activity.user}`
      case "coins_added":
        return `تم إضافة ${activity.amount} عملة لـ ${activity.user}`
      case "user_banned":
        return `تم حظر المستخدم: ${activity.user}`
      case "offerwall_added":
        return `تمت إضافة شركة عروض جديدة: ${activity.name}`
      case "user_unbanned":
        return `تم إلغاء حظر المستخدم: ${activity.user}`
      default:
        return "نشاط جديد"
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          {activity.avatar ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.avatar} alt={activity.user} />
              <AvatarFallback>{activity.user?.substring(0, 2) || "؟"}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{getActivityText(activity)}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

