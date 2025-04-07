"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/check-users")
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.message || "حدث خطأ أثناء جلب المستخدمين")
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">التحقق من المستخدمين في قاعدة البيانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={fetchUsers} disabled={loading}>
              {loading ? "جاري التحميل..." : "تحديث القائمة"}
            </Button>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {users.length === 0 && !loading && !error ? (
            <div className="text-center py-4">لا يوجد مستخدمين في قاعدة البيانات</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">المعرف</th>
                    <th className="py-2 px-4 border-b">اسم المستخدم</th>
                    <th className="py-2 px-4 border-b">البريد الإلكتروني</th>
                    <th className="py-2 px-4 border-b">الدور</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2 px-4 border-b">{user.id.substring(0, 8)}...</td>
                      <td className="py-2 px-4 border-b">{user.username}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

