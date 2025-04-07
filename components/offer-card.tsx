import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface OfferCardProps {
  title: string
  description: string
  coins: number
  provider: string
}

export function OfferCard({ title, description, coins, provider }: OfferCardProps) {
  return (
    <Card className="border-2 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-500 transition-colors">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="font-medium">{coins.toLocaleString()} عملة</p>
            <p className="text-xs text-muted-foreground">مقدم من: {provider}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600">اربح {coins.toLocaleString()} عملة</Button>
      </CardFooter>
    </Card>
  )
}

