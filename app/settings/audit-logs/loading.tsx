import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center p-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
      </CardContent>
    </Card>
  )
}
