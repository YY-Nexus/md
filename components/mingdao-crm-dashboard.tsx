"use client"

import { useState } from "react"
import { useMingdaoData } from "@/hooks/use-mingdao-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, DollarSign, TrendingUp, Clock } from "lucide-react"

export function MingdaoCrmDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // 获取客户数据
  const { data: customersData, isLoading: loadingCustomers } = useMingdaoData("customers", {
    pageSize: 100,
  })

  // 获取商机数据
  const { data: opportunitiesData, isLoading: loadingOpportunities } = useMingdaoData("opportunities", {
    pageSize: 100,
  })

  // 计算仪表板指标
  const totalCustomers = customersData?.total || 0
  const totalOpportunities = opportunitiesData?.total || 0
  const totalValue = opportunitiesData?.records?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0

  // 商机阶段数据
  const stageData = opportunitiesData?.records?.reduce((acc, opp) => {
    const stage = opp.stage || "未分类"
    acc[stage] = (acc[stage] || 0) + 1
    return acc
  }, {})

  const stageChartData = stageData
    ? Object.keys(stageData).map((stage) => ({
        name: stage,
        value: stageData[stage],
      }))
    : []

  // 月度销售数据
  const monthlySalesData = [
    { name: "1月", 销售额: 4000 },
    { name: "2月", 销售额: 3000 },
    { name: "3月", 销售额: 2000 },
    { name: "4月", 销售额: 2780 },
    { name: "5月", 销售额: 1890 },
    { name: "6月", 销售额: 2390 },
  ]

  // 饼图颜色
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">CRM仪表板</h2>
        <Button>刷新数据</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">客户总数</p>
                <h3 className="text-2xl font-bold">{totalCustomers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">商机总数</p>
                <h3 className="text-2xl font-bold">{totalOpportunities}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">商机总价值</p>
                <h3 className="text-2xl font-bold">¥{totalValue.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">平均成交周期</p>
                <h3 className="text-2xl font-bold">32天</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="sales">销售分析</TabsTrigger>
          <TabsTrigger value="customers">客户分析</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>商机阶段分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stageChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {stageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>月度销售趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="销售额" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>销售详细分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">此处显示更详细的销售分析数据...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>客户详细分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">此处显示更详细的客户分析数据...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // 添加 await
    // 模拟从明道云获取用户数据
    const mockUserData = {
      id,
      name: "Mock User",
    };
    return NextResponse.json(mockUserData);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.3.7"],
  },
};

export default nextConfig;
