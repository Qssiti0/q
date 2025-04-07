"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, TrendingUp } from "lucide-react"

interface ReferralStatsProps {
  referrals: any[]
}

export function ReferralStats({ referrals }: ReferralStatsProps) {
  // حساب عدد العروض المكتملة من قبل المحالين
  const totalCompletedOffers = referrals.reduce((sum, referral) => {
    return sum + (referral.completedOffers || 0)
  }, 0)

  // حساب إجمالي الأرباح من الإحالات
  const totalEarnings = referrals.reduce((sum, referral) => {
    return sum + (referral.earnings || 0)
  }, 0)

  // حساب متوسط الأرباح لكل مُحال نشط
  const activeReferrals = referrals.filter((r) => r.status === "active")
  const averageEarningsPerActive = activeReferrals.length ? Math.round(totalEarnings / activeReferrals.length) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          إحصائيات الإحالة
        </CardTitle>
        <CardDescription>مؤشرات أداء برنامج الإحالة الخاص بك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">إجمالي المُحالين</p>
              <p className="text-2xl font-bold">{referrals.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">المُحالين النشطين</p>
              <p className="text-2xl font-bold">{activeReferrals.length}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">معدل تحويل المُحالين</p>
            <p className="text-2xl font-bold">
              {referrals.length ? `${Math.round((activeReferrals.length / referrals.length) * 100)}%` : "0%"}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">العروض المكتملة</p>
              <p className="text-2xl font-bold">{totalCompletedOffers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">إجمالي الأرباح</p>
              <p className="text-2xl font-bold text-emerald-600">{totalEarnings.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">متوسط الأرباح لكل مُحال نشط</p>
            <p className="text-2xl font-bold text-emerald-600">{averageEarningsPerActive.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 flex items-start">
          <Info className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
          <p>كلما زاد عدد المحالين النشطين لديك، زادت أرباحك! شارك رابط الإحالة الخاص بك مع المزيد من الأشخاص.</p>
        </div>
      </CardContent>
    </Card>
  )
}

