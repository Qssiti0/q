import { ChatManagement } from "@/components/admin/chat-management"
import { AdminLayout } from "@/components/admin/layout"

export default function ChatManagementPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة الدردشة</h1>
          <p className="text-muted-foreground">مراقبة وإدارة الدردشة الجماعية وإعداداتها</p>
        </div>
        <ChatManagement />
      </div>
    </AdminLayout>
  )
}

