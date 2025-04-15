"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, RefreshCw, BarChartIcon, PieChartIcon, LineChartIcon } from "lucide-react"
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
  Sankey,
  Treemap,
  ComposedChart,
  Area,
} from "recharts"

// 目标类型定义（与MingdaoGoalTracker中的相同）
interface Goal {
  id: string
  name: string
  description: string
  metricType: string
  targetValue: number
  currentValue: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "overdue"
  category: "revenue" | "customers" | "opportunities" | "other"
}

// 历史记录条目
interface HistoryEntry {
  date: string
  value: number
}

// 带历史记录的目标
interface GoalWithHistory extends Goal {
  history: HistoryEntry[]
}

interface MingdaoGoalAnalyticsProps {
  customersWorksheetId: string
  opportunitiesWorksheetId: string
}

export function MingdaoGoalAnalytics({ customersWorksheetId, opportunitiesWorksheetId }: MingdaoGoalAnalyticsProps) {
  const [goals, setGoals] = useState<GoalWithHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("heatmap")
  const [timeRange, setTimeRange] = useState("6months")
  const [showLabels, setShowLabels] = useState(true)
  const [normalizeData, setNormalizeData] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "revenue",
    "customers",
    "opportunities",
    "other",
  ])

  // 图表数据
  const [chartData, setChartData] = useState({
    heatmapData: [] as any[],
    sankeyData: [] as any[],
    sunburstData: {} as any,
    composedData: [] as any[],
    correlationData: [] as any[],
  })

  // 加载目标数据
  const loadGoals = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 在实际应用中，这里应该从API获取目标数据
      // 这里使用模拟数据
      const mockGoals: GoalWithHistory[] = [
        {
          id: "1",
          name: "第二季度销售目标",
          description: "实现第二季度销售收入500万元",
          metricType: "销售收入",
          targetValue: 5000000,
          currentValue: 3200000,
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          category: "revenue",
          history: [
            { date: "2023-04-15", value: 1000000 },
            { date: "2023-04-30", value: 1800000 },
            { date: "2023-05-15", value: 2500000 },
            { date: "2023-05-31", value: 3200000 },
          ],
        },
        {
          id: "2",
          name: "新客户获取",
          description: "本季度新增50个客户",
          metricType: "客户数量",
          targetValue: 50,
          currentValue: 32,
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          category: "customers",
          history: [
            { date: "2023-04-15", value: 8 },
            { date: "2023-04-30", value: 15 },
            { date: "2023-05-15", value: 24 },
            { date: "2023-05-31", value: 32 },
          ],
        },
        {
          id: "3",
          name: "高价值商机转化",
          description: "将10个高价值商机转化为客户",
          metricType: "商机转化",
          targetValue: 10,
          currentValue: 6,
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          category: "opportunities",
          history: [
            { date: "2023-04-15", value: 1 },
            { date: "2023-04-30", value: 3 },
            { date: "2023-05-15", value: 4 },
            { date: "2023-05-31", value: 6 },
          ],
        },
        {
          id: "4",
          name: "客户满意度提升",
          description: "将客户满意度提升到90%",
          metricType: "满意度",
          targetValue: 90,
          currentValue: 85,
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          category: "other",
          history: [
            { date: "2023-04-15", value: 75 },
            { date: "2023-04-30", value: 78 },
            { date: "2023-05-15", value: 82 },
            { date: "2023-05-31", value: 85 },
          ],
        },
        {
          id: "5",
          name: "第一季度销售目标",
          description: "实现第一季度销售收入300万元",
          metricType: "销售收入",
          targetValue: 3000000,
          currentValue: 3200000,
          startDate: "2023-01-01",
          endDate: "2023-03-31",
          status: "completed",
          category: "revenue",
          history: [
            { date: "2023-01-15", value: 800000 },
            { date: "2023-01-31", value: 1500000 },
            { date: "2023-02-15", value: 2200000 },
            { date: "2023-02-28", value: 2800000 },
            { date: "2023-03-15", value: 3000000 },
            { date: "2023-03-31", value: 3200000 },
          ],
        },
        {
          id: "6",
          name: "市场活动效果",
          description: "通过市场活动获取100个潜在客户",
          metricType: "潜在客户",
          targetValue: 100,
          currentValue: 120,
          startDate: "2023-01-01",
          endDate: "2023-03-31",
          status: "completed",
          category: "customers",
          history: [
            { date: "2023-01-15", value: 25 },
            { date: "2023-01-31", value: 45 },
            { date: "2023-02-15", value: 70 },
            { date: "2023-02-28", value: 90 },
            { date: "2023-03-15", value: 105 },
            { date: "2023-03-31", value: 120 },
          ],
        },
        {
          id: "7",
          name: "产品开发里程碑",
          description: "完成5个关键产品功能开发",
          metricType: "功能数量",
          targetValue: 5,
          currentValue: 3,
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          category: "other",
          history: [
            { date: "2023-04-15", value: 1 },
            { date: "2023-04-30", value: 2 },
            { date: "2023-05-15", value: 2 },
            { date: "2023-05-31", value: 3 },
          ],
        },
        {
          id: "8",
          name: "销售团队扩张",
          description: "招聘8名销售代表",
          metricType: "招聘人数",
          targetValue: 8,
          currentValue: 5,
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          category: "other",
          history: [
            { date: "2023-04-15", value: 1 },
            { date: "2023-04-30", value: 3 },
            { date: "2023-05-15", value: 4 },
            { date: "2023-05-31", value: 5 },
          ],
        },
      ]

      setGoals(mockGoals)
      generateChartData(mockGoals)
    } catch (err) {
      console.error("Error loading goals:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadGoals()
  }, [])

  // 当过滤条件变化时重新生成图表数据
  useEffect(() => {
    if (goals.length > 0) {
      generateChartData(goals)
    }
  }, [timeRange, normalizeData, selectedCategories])

  // 生成图表数据
  const generateChartData = (goalsData: GoalWithHistory[]) => {
    try {
      // 过滤目标数据
      const filteredGoals = goalsData.filter((goal) => selectedCategories.includes(goal.category))

      // 生成热图数据
      const months = ["1月", "2月", "3月", "4月", "5月", "6月"]
      const categories = ["revenue", "customers", "opportunities", "other"]
      const categoryNames = {
        revenue: "收入",
        customers: "客户",
        opportunities: "商机",
        other: "其他",
      }

      const heatmapData = months.map((month) => {
        const monthData: any = { month }
        selectedCategories.forEach((category) => {
          // 生成50-100之间的随机数作为完成率
          monthData[categoryNames[category]] = Math.floor(Math.random() * 50) + 50
        })
        return monthData
      })

      // 生成桑基图数据
      const sankeyData = {
        nodes: [
          { name: "目标总数" },
          { name: "收入目标" },
          { name: "客户目标" },
          { name: "商机目标" },
          { name: "其他目标" },
          { name: "已完成" },
          { name: "进行中" },
          { name: "已逾期" },
        ],
        links: [
          { source: 0, target: 1, value: filteredGoals.filter((g) => g.category === "revenue").length },
          { source: 0, target: 2, value: filteredGoals.filter((g) => g.category === "customers").length },
          { source: 0, target: 3, value: filteredGoals.filter((g) => g.category === "opportunities").length },
          { source: 0, target: 4, value: filteredGoals.filter((g) => g.category === "other").length },

          {
            source: 1,
            target: 5,
            value: filteredGoals.filter((g) => g.category === "revenue" && g.status === "completed").length || 1,
          },
          {
            source: 1,
            target: 6,
            value: filteredGoals.filter((g) => g.category === "revenue" && g.status === "active").length || 1,
          },
          {
            source: 1,
            target: 7,
            value: filteredGoals.filter((g) => g.category === "revenue" && g.status === "overdue").length || 1,
          },

          {
            source: 2,
            target: 5,
            value: filteredGoals.filter((g) => g.category === "customers" && g.status === "completed").length || 1,
          },
          {
            source: 2,
            target: 6,
            value: filteredGoals.filter((g) => g.category === "customers" && g.status === "active").length || 1,
          },
          {
            source: 2,
            target: 7,
            value: filteredGoals.filter((g) => g.category === "customers" && g.status === "overdue").length || 1,
          },

          {
            source: 3,
            target: 5,
            value: filteredGoals.filter((g) => g.category === "opportunities" && g.status === "completed").length || 1,
          },
          {
            source: 3,
            target: 6,
            value: filteredGoals.filter((g) => g.category === "opportunities" && g.status === "active").length || 1,
          },
          {
            source: 3,
            target: 7,
            value: filteredGoals.filter((g) => g.category === "opportunities" && g.status === "overdue").length || 1,
          },

          {
            source: 4,
            target: 5,
            value: filteredGoals.filter((g) => g.category === "other" && g.status === "completed").length || 1,
          },
          {
            source: 4,
            target: 6,
            value: filteredGoals.filter((g) => g.category === "other" && g.status === "active").length || 1,
          },
          {
            source: 4,
            target: 7,
            value: filteredGoals.filter((g) => g.category === "other" && g.status === "overdue").length || 1,
          },
        ],
      }

      // 生成旭日图数据
      const sunburstData = {
        name: "目标",
        children: [
          {
            name: "收入",
            children: filteredGoals
              .filter((g) => g.category === "revenue")
              .map((g) => ({
                name: g.name,
                size: g.targetValue,
                completion: (g.currentValue / g.targetValue) * 100,
                status: g.status,
              })),
          },
          {
            name: "客户",
            children: filteredGoals
              .filter((g) => g.category === "customers")
              .map((g) => ({
                name: g.name,
                size: g.targetValue,
                completion: (g.currentValue / g.targetValue) * 100,
                status: g.status,
              })),
          },
          {
            name: "商机",
            children: filteredGoals
              .filter((g) => g.category === "opportunities")
              .map((g) => ({
                name: g.name,
                size: g.targetValue,
                completion: (g.currentValue / g.targetValue) * 100,
                status: g.status,
              })),
          },
          {
            name: "其他",
            children: filteredGoals
              .filter((g) => g.category === "other")
              .map((g) => ({
                name: g.name,
                size: g.targetValue,
                completion: (g.currentValue / g.targetValue) * 100,
                status: g.status,
              })),
          },
        ],
      }

      // 生成复合图表数据
      const composedData = months.map((month) => {
        const data: any = { month }

        // 添加每个类别的完成率
        selectedCategories.forEach((category) => {
          data[`${categoryNames[category]}完成率`] = Math.floor(Math.random() * 50) + 50
        })

        // 添加总体完成率和目标数
        data["总体完成率"] = Math.floor(Math.random() * 30) + 70
        data["目标数"] = Math.floor(Math.random() * 5) + 5

        return data
      })

      // 生成相关性分析数据
      const correlationData = filteredGoals.map((goal) => {
        const completionRate = (goal.currentValue / goal.targetValue) * 100
        const timeProgress = calculateTimeProgress(goal.startDate, goal.endDate)

        return {
          name: goal.name,
          category: goal.category,
          completionRate,
          timeProgress,
          targetValue: goal.targetValue,
          status: goal.status,
        }
      })

      // 更新图表数据
      setChartData({
        heatmapData,
        sankeyData,
        sunburstData,
        composedData,
        correlationData,
      })
    } catch (err) {
      console.error("Error generating chart data:", err)
      setError("生成图表数据时出错：" + err.message)
    }
  }

  // 计算时间进度百分比
  const calculateTimeProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()

    if (now <= start) return 0
    if (now >= end) return 100

    return ((now - start) / (end - start)) * 100
  }

  // 获取类别名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case "revenue":
        return "收入"
      case "customers":
        return "客户"
      case "opportunities":
        return "商机"
      default:
        return "其他"
    }
  }

  // 获取状态名称
  const getStatusName = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "overdue":
        return "已逾期"
      default:
        return "进行中"
    }
  }

  // 图表颜色
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
  const STATUS_COLORS = {
    completed: "#4CAF50",
    active: "#2196F3",
    overdue: "#F44336",
  }

  // 如果 worksheetId 是占位符，显示配置提示
  if (
    customersWorksheetId === "your_customers_worksheet_id" ||
    opportunitiesWorksheetId === "your_opportunities_worksheet_id"
  ) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>高级目标分析</CardTitle>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>高级目标分析</CardTitle>
          <CardDescription>使用高级图表深入分析目标数据</CardDescription>
        </div>
        <Button size="sm" onClick={() => loadGoals()} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              加载中...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1" />
              刷新数据
            </>
          )}
        </Button>
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
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="time-range">时间范围:</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger id="time-range" className="w-[120px]">
                      <SelectValue placeholder="选择时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">近3个月</SelectItem>
                      <SelectItem value="6months">近6个月</SelectItem>
                      <SelectItem value="1year">近1年</SelectItem>
                      <SelectItem value="all">全部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="show-labels">显示标签:</Label>
                  <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="normalize-data">标准化数据:</Label>
                  <Switch id="normalize-data" checked={normalizeData} onCheckedChange={setNormalizeData} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Label className="mr-2">目标类别:</Label>
                {["revenue", "customers", "opportunities", "other"].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedCategories.includes(category)) {
                        if (selectedCategories.length > 1) {
                          setSelectedCategories(selectedCategories.filter((c) => c !== category))
                        }
                      } else {
                        setSelectedCategories([...selectedCategories, category])
                      }
                    }}
                    className="min-w-[80px]"
                  >
                    {getCategoryName(category)}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="heatmap" className="flex items-center">
                  <BarChartIcon className="h-4 w-4 mr-1" />
                  热图分析
                </TabsTrigger>
                <TabsTrigger value="sankey" className="flex items-center">
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  流向分析
                </TabsTrigger>
                <TabsTrigger value="sunburst" className="flex items-center">
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  树状图分析
                </TabsTrigger>
                <TabsTrigger value="composed" className="flex items-center">
                  <BarChartIcon className="h-4 w-4 mr-1" />
                  复合分析
                </TabsTrigger>
                <TabsTrigger value="correlation" className="flex items-center">
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  相关性分析
                </TabsTrigger>
              </TabsList>

              {/* 热图分析标签页 */}
              <TabsContent value="heatmap">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">目标完成热图</CardTitle>
                    <CardDescription>按月份和类别的目标完成率热力图</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData.heatmapData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value}%`, "完成率"]}
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-2 border rounded shadow-sm">
                                    <p className="font-medium">{label}</p>
                                    {payload.map((entry, index) => (
                                      <div key={`item-${index}`} className="flex items-center">
                                        <div className="w-3 h-3 mr-1" style={{ backgroundColor: entry.color }}></div>
                                        <p className="text-sm">
                                          {entry.name}: {entry.value}%
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                          {selectedCategories.includes("revenue") && <Bar dataKey="收入" stackId="a" fill="#0088FE" />}
                          {selectedCategories.includes("customers") && (
                            <Bar dataKey="客户" stackId="a" fill="#00C49F" />
                          )}
                          {selectedCategories.includes("opportunities") && (
                            <Bar dataKey="商机" stackId="a" fill="#FFBB28" />
                          )}
                          {selectedCategories.includes("other") && <Bar dataKey="其他" stackId="a" fill="#FF8042" />}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>热图分析展示了不同类别目标在各月份的完成率情况，帮助识别表现最好和最差的时期。</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 流向分析标签页 */}
              <TabsContent value="sankey">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">目标流向分析</CardTitle>
                    <CardDescription>目标类别与状态的流向关系</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <Sankey
                          data={chartData.sankeyData}
                          nodePadding={50}
                          nodeWidth={10}
                          linkCurvature={0.5}
                          iterations={64}
                          link={{ stroke: "#d0d0d0" }}
                          node={{
                            stroke: "#fff",
                            strokeWidth: 2,
                            fill: "#8884d8",
                          }}
                        >
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-2 border rounded shadow-sm">
                                    <p className="font-medium">{`${data.source.name} → ${data.target.name}`}</p>
                                    <p className="text-sm">数量: {data.value}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </Sankey>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>流向分析展示了目标从类别到状态的流向关系，帮助理解不同类别目标的完成情况。</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 层次分析标签页 */}
              <TabsContent value="sunburst">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">目标层次分析</CardTitle>
                    <CardDescription>按类别和目标的层次结构（树状图）</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                          data={chartData.sunburstData.children}
                          dataKey="size"
                          ratio={4 / 3}
                          stroke="#fff"
                          fill="#8884d8"
                          content={({ root, depth, x, y, width, height, index, payload, rank, name }) => {
                            return (
                              <g>
                                <rect
                                  x={x}
                                  y={y}
                                  width={width}
                                  height={height}
                                  style={{
                                    fill: depth === 1 ? COLORS[index % COLORS.length] : "rgba(255, 255, 255, 0.5)",
                                    stroke: "#fff",
                                    strokeWidth: 2 / (depth + 1e-10),
                                    strokeOpacity: 1 / (depth + 1e-10),
                                  }}
                                />
                                {width > 50 && height > 30 ? (
                                  <>
                                    <text
                                      x={x + width / 2}
                                      y={y + height / 2 - 7}
                                      textAnchor="middle"
                                      fill="#fff"
                                      fontSize={12}
                                    >
                                      {name}
                                    </text>
                                    {payload.completion && (
                                      <text
                                        x={x + width / 2}
                                        y={y + height / 2 + 12}
                                        textAnchor="middle"
                                        fill="#fff"
                                        fontSize={11}
                                      >
                                        {`${payload.completion.toFixed(0)}%`}
                                      </text>
                                    )}
                                  </>
                                ) : null}
                              </g>
                            )
                          }}
                        />
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>树状图展示了目标的层次结构，从类别到具体目标，帮助理解目标的分布情况和相对大小。</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 复合分析标签页 */}
              <TabsContent value="composed">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">目标复合分析</CardTitle>
                    <CardDescription>完成率与目标数量的复合分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={chartData.composedData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                          <YAxis yAxisId="right" orientation="right" domain={[0, "auto"]} />
                          <Tooltip />
                          <Legend />
                          {selectedCategories.includes("revenue") && (
                            <Bar yAxisId="right" dataKey="目标数" fill="#8884d8" />
                          )}
                          {selectedCategories.includes("revenue") && (
                            <Line yAxisId="left" type="monotone" dataKey="收入完成率" stroke="#0088FE" />
                          )}
                          {selectedCategories.includes("customers") && (
                            <Line yAxisId="left" type="monotone" dataKey="客户完成率" stroke="#00C49F" />
                          )}
                          {selectedCategories.includes("opportunities") && (
                            <Line yAxisId="left" type="monotone" dataKey="商机完成率" stroke="#FFBB28" />
                          )}
                          {selectedCategories.includes("other") && (
                            <Line yAxisId="left" type="monotone" dataKey="其他完成率" stroke="#FF8042" />
                          )}
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="总体完成率"
                            fill="#8884d8"
                            stroke="#8884d8"
                            fillOpacity={0.3}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>复合分析展示了目标完成率与目标数量的关系，帮助理解目标数量对完成率的影响。</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 相关性分析标签页 */}
              <TabsContent value="correlation">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">目标相关性分析</CardTitle>
                    <CardDescription>完成率与时间进度的相关性</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="timeProgress"
                            name="时间进度"
                            domain={[0, 100]}
                            label={{ value: "时间进度 (%)", position: "bottom" }}
                          />
                          <YAxis
                            type="number"
                            dataKey="completionRate"
                            name="完成率"
                            domain={[0, 100]}
                            label={{ value: "完成率 (%)", angle: -90, position: "left" }}
                          />
                          <ZAxis type="number" dataKey="targetValue" range={[50, 400]} name="目标值" />
                          <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-2 border rounded shadow-sm">
                                    <p className="font-medium">{data.name}</p>
                                    <p className="text-sm">完成率: {data.completionRate.toFixed(1)}%</p>
                                    <p className="text-sm">时间进度: {data.timeProgress.toFixed(1)}%</p>
                                    <p className="text-sm">类别: {getCategoryName(data.category)}</p>
                                    <p className="text-sm">状态: {getStatusName(data.status)}</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Legend />
                          {selectedCategories.map((category, index) => (
                            <Scatter
                              key={category}
                              name={getCategoryName(category)}
                              data={chartData.correlationData.filter((d) => d.category === category)}
                              fill={COLORS[index % COLORS.length]}
                              shape={(props) => {
                                const { cx, cy, fill } = props
                                const status = props.payload.status
                                const color = STATUS_COLORS[status] || fill

                                return (
                                  <circle
                                    cx={cx}
                                    cy={cy}
                                    r={8}
                                    stroke={color}
                                    strokeWidth={2}
                                    fill={color}
                                    fillOpacity={0.6}
                                  />
                                )
                              }}
                            />
                          ))}
                          {/* 理想进度线 */}
                          <Line
                            name="理想进度"
                            type="monotone"
                            dataKey="completionRate"
                            data={[
                              { timeProgress: 0, completionRate: 0 },
                              { timeProgress: 100, completionRate: 100 },
                            ]}
                            stroke="#000"
                            strokeDasharray="5 5"
                            dot={false}
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>
                        相关性分析展示了目标完成率与时间进度的关系，点的大小表示目标值大小，颜色表示目标状态。理想情况下，点应该分布在对角线附近。
                      </p>
                      <ul className="mt-2 flex items-center space-x-4">
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                          <span>已完成</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                          <span>进行中</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                          <span>已逾期</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">数据更新时间: {new Date().toLocaleString("zh-CN")}</div>
        <div className="text-sm text-gray-500">数据来源: 明道云业务目标跟踪系统</div>
      </CardFooter>
    </Card>
  )
}
