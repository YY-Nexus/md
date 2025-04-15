"use client"

import { usePermissionUsage } from "@/hooks/use-permission-usage"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PermissionUsageDashboardContentProps {
  token: string | null
}

function PermissionUsageDashboardContent({ token }: PermissionUsageDashboardContentProps) {
  const { permissionStats, isLoading, error, refresh } = usePermissionUsage({ limit: 5, token: token })

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{String(error)}</p>
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium">常用权限</h3>
        <p className="text-sm text-gray-500">以下是系统中常用的权限列表</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {permissionStats.map((stat) => (
          <Card key={stat.permission} className="border-2 border-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{stat.permission}</h4>
                  <p className="text-sm text-gray-500">使用次数: {stat.count}</p>
                </div>
                <Badge variant="secondary">{stat.users.length} 用户</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">权限使用趋势</h3>
        <p className="text-sm text-gray-500">权限使用随时间变化的趋势图</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "1月", 权限A: 4000, 权限B: 2400, 权限C: 2400 },
                { name: "2月", 权限A: 3000, 权限B: 1398, 权限C: 2210 },
                { name: "3月", 权限A: 2000, 权限B: 9800, 权限C: 2290 },
                { name: "4月", 权限A: 2780, 权限B: 3908, 权限C: 2000 },
                { name: "5月", 权限A: 1890, 权限B: 4800, 权限C: 2181 },
                { name: "6月", 权限A: 2390, 权限B: 3800, 权限C: 2500 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="权限A" fill="#8884d8" />
              <Bar dataKey="权限B" fill="#82ca9d" />
              <Bar dataKey="权限C" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
import { auth } from "@clerk/nextjs/server"

export default async function PermissionUsageDashboard() {
  const { getToken } = auth()
  const token = await getToken()

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>权限使用分析</CardTitle>
          <CardDescription>查看系统中权限的使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">请设置 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 和 CLERK_SECRET_KEY 环境变量.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>权限使用分析</CardTitle>
        <CardDescription>查看系统中权限的使用情况</CardDescription>
      </CardHeader>
      <CardContent>
        <PermissionUsageDashboardContent token={token} />
      </CardContent>
    </Card>
  )
}
