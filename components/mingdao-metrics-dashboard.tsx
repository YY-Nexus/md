"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart4 } from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MingdaoMetricsDashboardProps {
  customersWorksheetId: string
  opportunitiesWorksheetId: string
}

export function MingdaoMetricsDashboard({
  customersWorksheetId,
  opportunitiesWorksheetId,
}: MingdaoMetricsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 指标数据
  const [metrics, setMetrics] = useState({
    // 客户指标
    totalCustomers: 0,
    activeCustomers: 0,
    customerActivationRate: 0,
    newCustomersThisMonth: 0,
    customerGrowthRate: 0,
    averageCustomerRevenue: 0,
    topCustomerRegion: "",

    // 商机指标
    totalOpportunities: 0,
    openOpportunities: 0,
    totalOpportunityValue: 0,
    averageOpportunityValue: 0,
    winRate: 0,
    salesCycleLength: 0,
    highValueOpportunities: 0,

    // 趋势数据
    customerTrend: [] as any[],
    revenueTrend: [] as any[],
    opportunityTrend: [] as any[],
    stageDistribution: [] as any[],
  })

  // 获取并计算指标
  const fetchAndCalculateMetrics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 获取客户数据
      const customersResponse = await fetch(`/api/mingdao/worksheets/${customersWorksheetId}/records?pageSize=100`)

      // 获取商机数据
      const opportunitiesResponse = await fetch(
        `/api/mingdao/worksheets/${opportunitiesWorksheetId}/records?pageSize=100`,
      )

      if (!customersResponse.ok || !opportunitiesResponse.ok) {
        throw new Error("获取数据失败")
      }

      const customersData = await customersResponse.json()
      const opportunitiesData = await opportunitiesResponse.json()

      const customers = customersData.records || []
      const opportunities = opportunitiesData.records || []

      // 计算客户指标
      const totalCustomers = customers.length
      const activeCustomers = customers.filter((c) => c.status === "活跃").length
      const customerActivationRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0

      // 假设最近一个月的新客户（在实际应用中，应该根据日期字段计算）
      const newCustomersThisMonth = Math.floor(totalCustomers * 0.15) // 模拟数据，实际应根据joinDate计算
      const customerGrowthRate = 12.5 // 模拟数据，实际应根据历史数据计算

      // 计算平均客户收入
      const totalRevenue = customers.reduce((sum, customer) => sum + (customer.revenue || 0), 0)
      const averageCustomerRevenue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0

      // 计算客户区域分布并找出最多的区域
      const regionCounts = customers.reduce((acc, customer) => {
        const region = customer.region || "未知"
        acc[region] = (acc[region] || 0) + 1
        return acc
      }, {})

      const topCustomerRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "未知"

      // 计算商机指标
      const totalOpportunities = opportunities.length
      const openOpportunities = opportunities.filter((o) =>
        ["初步接触", "需求分析", "方案确认", "商务谈判"].includes(o.stage),
      ).length

      const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0)
      const averageOpportunityValue = totalOpportunities > 0 ? totalOpportunityValue / totalOpportunities : 0

      // 假设赢率和销售周期（在实际应用中，应该根据历史数据计算）
      const winRate = 35.8 // 模拟数据
      const salesCycleLength = 45 // 模拟数据，天数

      // 高价值商机（价值超过平均值的150%）
      const highValueThreshold = averageOpportunityValue * 1.5
      const highValueOpportunities = opportunities.filter((opp) => (opp.value || 0) > highValueThreshold).length

      // 准备趋势数据
      // 客户增长趋势（模拟数据）
      const customerTrend = [
        { month: "1月", 客户数: 120 },
        { month: "2月", 客户数: 132 },
        { month: "3月", 客户数: 145 },
        { month: "4月", 客户数: 155 },
        { month: "5月", 客户数: 165 },
        { month: "6月", 客户数: 180 },
      ]

      // 收入趋势（模拟数据）
      const revenueTrend = [
        { month: "1月", 收入: 3200000 },
        { month: "2月", 收入: 3500000 },
        { month: "3月", 收入: 3800000 },
        { month: "4月", 收入: 4100000 },
        { month: "5月", 收入: 4500000 },
        { month: "6月", 收入: 5000000 },
      ]

      // 商机趋势（模拟数据）
      const opportunityTrend = [
        { month: "1月", 商机数: 25 },
        { month: "2月", 商机数: 30 },
        { month: "3月", 商机数: 28 },
        { month: "4月", 商机数: 35 },
        { month: "5月", 商机数: 40 },
        { month: "6月", 商机数: 45 },
      ]

      // 商机阶段分布
      const stageDistribution = opportunities.reduce((acc, opp) => {
        const stage = opp.stage || "未分类"
        acc[stage] = (acc[stage] || 0) + 1
        return acc
      }, {})

      const stageDistributionData = Object.entries(stageDistribution).map(([stage, count]) => ({
        stage,
        count,
      }))

      // 更新指标状态
      setMetrics({
        totalCustomers,
        activeCustomers,
        customerActivationRate,
        newCustomersThisMonth,
        customerGrowthRate,
        averageCustomerRevenue,
        topCustomerRegion,

        totalOpportunities,
        openOpportunities,
        totalOpportunityValue,
        averageOpportunityValue,
        winRate,
        salesCycleLength,
        highValueOpportunities,

        customerTrend,
        revenueTrend,
        opportunityTrend,
        stageDistribution: stageDistributionData,
      })
    } catch (err) {
      console.error("Error fetching metrics:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndCalculateMetrics()
  }, [customersWorksheetId, opportunitiesWorksheetId])

  // 格式化数字为货币格式
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // 格式化百分比
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // 如果 worksheetId 是占位符，显示配置提示
  if (
    customersWorksheetId === "your_customers_worksheet_id" ||
    opportunitiesWorksheetId === "your_opportunities_worksheet_id"
  ) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>业务指标仪表盘</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">配置需要更新</p>
              <p className="text-sm mt-1">
                请在 <code className="bg-amber-100 px-1 py-0.5 rounded">app/mingdao-dashboard/page.tsx</code>{" "}
                文件中更新工作表 ID
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>业务指标仪表盘</CardTitle>
        <CardDescription>关键业务指标汇总与分析</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>加载数据时出错：{error}</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">总览</TabsTrigger>
              <TabsTrigger value="customers">客户分析</TabsTrigger>
              <TabsTrigger value="opportunities">商机分析</TabsTrigger>
              <TabsTrigger value="trends">趋势分析</TabsTrigger>
            </TabsList>

            {/* 总览标签页 */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* 总客户数 */}
                <MetricCard
                  title="总客户数"
                  value={metrics.totalCustomers.toString()}
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                  trend={`${metrics.customerGrowthRate > 0 ? "+" : ""}${metrics.customerGrowthRate}%`}
                  trendUp={metrics.customerGrowthRate > 0}
                  subtitle={`本月新增 ${metrics.newCustomersThisMonth}`}
                />

                {/* 总商机数 */}
                <MetricCard
                  title="总商机数"
                  value={metrics.totalOpportunities.toString()}
                  icon={<Target className="h-5 w-5 text-green-600" />}
                  trend={`${metrics.openOpportunities} 个进行中`}
                  trendUp={true}
                  subtitle={`高价值商机 ${metrics.highValueOpportunities} 个`}
                />

                {/* 商机总价值 */}
                <MetricCard
                  title="商机总价值"
                  value={formatCurrency(metrics.totalOpportunityValue)}
                  icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                  trend={`平均 ${formatCurrency(metrics.averageOpportunityValue)}`}
                  trendUp={true}
                  subtitle={`赢率 ${formatPercent(metrics.winRate)}`}
                />

                {/* 客户活跃度 */}
                <MetricCard
                  title="客户活跃度"
                  value={`${metrics.activeCustomers}/${metrics.totalCustomers}`}
                  icon={<BarChart4 className="h-5 w-5 text-purple-600" />}
                  trend={formatPercent(metrics.customerActivationRate)}
                  trendUp={metrics.customerActivationRate > 50}
                  subtitle={`主要区域: ${metrics.topCustomerRegion}`}
                />
              </div>

              {/* 趋势图表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 客户增长趋势 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">客户增长趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics.customerTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="客户数" stroke="#3b82f6" fill="#93c5fd" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 商机价值趋势 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">收入趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.revenueTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value as number), "收入"]} />
                          <Bar dataKey="收入" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 客户分析标签页 */}
            <TabsContent value="customers">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 总客户数 */}
                <MetricCard
                  title="总客户数"
                  value={metrics.totalCustomers.toString()}
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                  trend={`${metrics.customerGrowthRate > 0 ? "+" : ""}${metrics.customerGrowthRate}%`}
                  trendUp={metrics.customerGrowthRate > 0}
                />

                {/* 活跃客户 */}
                <MetricCard
                  title="活跃客户"
                  value={metrics.activeCustomers.toString()}
                  icon={<Users className="h-5 w-5 text-green-600" />}
                  trend={formatPercent(metrics.customerActivationRate)}
                  trendUp={metrics.customerActivationRate > 50}
                />

                {/* 平均客户收入 */}
                <MetricCard
                  title="平均客户收入"
                  value={formatCurrency(metrics.averageCustomerRevenue)}
                  icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                  trend="按年计算"
                  trendUp={true}
                />
              </div>

              {/* 客户活跃度进度条 */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">客户活跃度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">活跃率</span>
                        <span className="text-sm font-medium">{formatPercent(metrics.customerActivationRate)}</span>
                      </div>
                      <Progress value={metrics.customerActivationRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">活跃客户</div>
                        <div className="text-xl font-bold">{metrics.activeCustomers}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">潜在客户</div>
                        <div className="text-xl font-bold">{metrics.totalCustomers - metrics.activeCustomers}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">主要区域</div>
                        <div className="text-xl font-bold">{metrics.topCustomerRegion}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 客户增长趋势 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">客户增长趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics.customerTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="客户数" stroke="#3b82f6" fill="#93c5fd" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 商机分析标签页 */}
            <TabsContent value="opportunities">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* 总商机数 */}
                <MetricCard
                  title="总商机数"
                  value={metrics.totalOpportunities.toString()}
                  icon={<Target className="h-5 w-5 text-blue-600" />}
                  trend={`${metrics.openOpportunities} 个进行中`}
                  trendUp={true}
                />

                {/* 商机总价值 */}
                <MetricCard
                  title="商机总价值"
                  value={formatCurrency(metrics.totalOpportunityValue)}
                  icon={<DollarSign className="h-5 w-5 text-green-600" />}
                  trend={`平均 ${formatCurrency(metrics.averageOpportunityValue)}`}
                  trendUp={true}
                />

                {/* 赢率 */}
                <MetricCard
                  title="赢率"
                  value={formatPercent(metrics.winRate)}
                  icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
                  trend={`销售周期 ${metrics.salesCycleLength} 天`}
                  trendUp={true}
                />
              </div>

              {/* 商机阶段分布 */}
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">商机阶段分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.stageDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="stage" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 高价值商机 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">高价值商机</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">高价值商机比例</span>
                        <span className="text-sm font-medium">
                          {formatPercent((metrics.highValueOpportunities / metrics.totalOpportunities) * 100)}
                        </span>
                      </div>
                      <Progress
                        value={(metrics.highValueOpportunities / metrics.totalOpportunities) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">高价值商机</div>
                        <div className="text-xl font-bold">{metrics.highValueOpportunities}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">高价值阈值</div>
                        <div className="text-xl font-bold">{formatCurrency(metrics.averageOpportunityValue * 1.5)}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">平均商机价值</div>
                        <div className="text-xl font-bold">{formatCurrency(metrics.averageOpportunityValue)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 趋势分析标签页 */}
            <TabsContent value="trends">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 客户增长趋势 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">客户增长趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics.customerTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="客户数" stroke="#3b82f6" fill="#93c5fd" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 商机趋势 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">商机趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metrics.opportunityTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="商机数" stroke="#10b981" fill="#6ee7b7" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 收入趋势 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">收入趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.revenueTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value as number), "收入"]} />
                          <Bar dataKey="收入" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 商机阶段分布 */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">商机阶段分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.stageDistribution} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="stage" type="category" width={100} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

// 指标卡片组件
interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
  subtitle?: string
}

function MetricCard({ title, value, icon, trend, trendUp, subtitle }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          <div className="p-1.5 bg-gray-100 rounded-full">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${trendUp ? "text-green-500" : "text-red-500"}`}>{trend}</span>
        </div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  )
}
