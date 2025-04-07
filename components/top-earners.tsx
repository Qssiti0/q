import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopEarners() {
  // بيانات ثابتة للمتصدرين
  const topUsers = [
    { id: 1, name: "أحمد محمد", coins: 250000, avatar: "" },
    { id: 2, name: "سارة أحمد", coins: 180000, avatar: "" },
    { id: 3, name: "محمد علي", coins: 150000, avatar: "" },
    { id: 4, name: "فاطمة حسن", coins: 120000, avatar: "" },
    { id: 5, name: "عمر خالد", coins: 100000, avatar: "" },
  ]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.coins.toLocaleString()} عملة</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

