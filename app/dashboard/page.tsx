import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, Target, Calendar, TrendingUp } from "lucide-react"
import PermissionUsageDashboard from "@/components/permission-usage-dashboard"

const data = [
  { name: "1月", 完成率: 65, 目标: 80 },
  { name: "2月", 完成率: 70, 目标: 80 },
  { name: "3月", 完成率: 75, 目标: 80 },
  { name: "4月", 完成率: 68, 目标: 80 },
  { name: "5月", 完成率: 72, 目标: 80 },
  { name: "6月", 完成率: 78, 目标: 80 },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">团队成员</p>
                  <h3 className="text-2xl font-bold">24</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">活跃项目</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">本月任务</p>
                  <h3 className="text-2xl font-bold">156</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">目标完成率</p>
                  <h3 className="text-2xl font-bold">78%</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>目标完成趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="完成率" fill="#3b82f6" />
                  <Bar dataKey="目标" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 添加权限使用分析仪表板 */}
        <PermissionUsageDashboard />
      </div>
    </AppLayout>
  )
}
