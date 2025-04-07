import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Coins, DollarSign, Users } from "lucide-react"

export function AdminStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,345</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5,678</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              8%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Coins Distributed</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">25.6M</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              18%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 inline-flex items-center">
              <ArrowDown className="mr-1 h-3 w-3" />
              3%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

