"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, RefreshCw } from "lucide-react"

export function DatabaseCheck() {
  const [redisData, setRedisData] = useState<any>(null)
  const [localData, setLocalData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // التحقق من بيانات Redis
  const checkRedisData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // جلب البيانات من Redis عبر API
      const response = await fetch("/api/messages/check")
      if (!response.ok) {
        throw new Error("فشل في جلب البيانات من Redis")
      }

      const data = await response.json()
      setRedisData(data)

      // جلب البيانات من localStorage للمقارنة
      const localMessages = localStorage.getItem("groupChatMessages")
      if (localMessages) {
        setLocalData({
          source: "Local Storage",
          messageCount: JSON.parse(localMessages).length,
          recentMessages: JSON.parse(localMessages).slice(0, 5),
        })
      } else {
        setLocalData({
          source: "Local Storage",
          messageCount: 0,
          recentMessages: [],
        })
      }
    } catch (err) {
      console.error("Error checking data:", err)
      setError(err instanceof Error ? err.message : "حدث خطأ غير معروف")
    } finally {
      setIsLoading(false)
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-SA")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          التحقق من مصدر البيانات
        </CardTitle>
        <CardDescription>
          تحقق من أن بيانات الدردشة مخزنة في قاعدة بيانات Redis وليس فقط في التخزين المحلي
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200">{error}</div>}

          {redisData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">بيانات Redis</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600">
                      {redisData.messageCount} رسالة
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {redisData.recentMessages.length > 0 ? (
                      <div className="space-y-2">
                        <p>آخر الرسائل في Redis:</p>
                        <ul className="space-y-1">
                          {redisData.recentMessages.map((msg: any, index: number) => (
                            <li key={index} className="border-b pb-1">
                              <div className="font-medium">{msg.userName}</div>
                              <div>{msg.text}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>لا توجد رسائل في Redis</p>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">بيانات التخزين المحلي</h3>
                    <Badge variant="outline" className="bg-amber-50 text-amber-600">
                      {localData?.messageCount || 0} رسالة
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {localData && localData.recentMessages.length > 0 ? (
                      <div className="space-y-2">
                        <p>آخر الرسائل في التخزين المحلي:</p>
                        <ul className="space-y-1">
                          {localData.recentMessages.map((msg: any, index: number) => (
                            <li key={index} className="border-b pb-1">
                              <div className="font-medium">{msg.userName}</div>
                              <div>{msg.text}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>لا توجد رسائل في التخزين المحلي</p>
                    )}
                  </div>
                </div>
              </div>

              {redisData.messageCount > 0 && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md border border-green-200">
                  <p className="font-medium">✓ تم التأكد من تخزين البيانات في Redis</p>
                  <p className="text-sm">
                    البيانات مخزنة بنجاح في قاعدة بيانات Redis وليس فقط في التخزين المحلي للمتصفح.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkRedisData} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              جاري التحقق...
            </>
          ) : (
            "التحقق من مصدر البيانات"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

