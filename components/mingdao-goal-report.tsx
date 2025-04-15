"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  Calendar,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
  Target,
  Flag,
} from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { exportReportToPDF, exportChartToPDF } from "../utils/report-exporter"
import { TemplateSelector } from "./template-selector"
import { TemplateProvider, useTemplate } from "../contexts/template-context"
import type { GoalWithHistory, ReportPeriod, ReportData } from "../types/goal"
import styles from "../styles/template-styles.module.css"

interface MingdaoGoalReportProps {
  customersWorksheetId: string
  opportunitiesWorksheetId: string
}

export function MingdaoGoalReport({ customersWorksheetId, opportunitiesWorksheetId }: MingdaoGoalReportProps) {
  const [goals, setGoals] = useState<GoalWithHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("monthly")
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const { currentTemplate } = useTemplate()
  const reportContainerRef = useRef<HTMLDivElement>(null)

  // 报告数据
  const [reportData, setReportData] = useState<ReportData>({
    overallCompletion: 0,
    categoryCompletion: {},
    statusDistribution: {},
    completionTrend: [],
    topPerformingGoals: [],
    atRiskGoals: [],
    // 新增高级图表数据
    radarData: [],
    heatmapData: [],
    performanceMatrix: [],
    goalDistribution: [{ name: "所有目标", children: [] }], // 初始化为有效的结构
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

  // 当模板变化时应用样式
  useEffect(() => {
    if (reportContainerRef.current) {
      // 移除所有模板类
      reportContainerRef.current.classList.remove(styles.default, styles.modern, styles.corporate, styles.colorful)

      // 添加当前模板类
      reportContainerRef.current.classList.add(styles.templateApplied)
      reportContainerRef.current.classList.add(styles[currentTemplate.id])

      // 更新图表颜色
      // 这里可以添加更新图表颜色的逻辑
    }
  }, [currentTemplate])

  // 生成报告
  const generateReport = () => {
    setIsGenerating(true)

    // 模拟报告生成延迟
    setTimeout(() => {
      try {
        // 计算总体完成率
        const completedGoals = goals.filter((goal) => goal.status === "completed").length
        const overallCompletion = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0

        // 计算各类别完成率
        const categoryCompletion: Record<string, number> = {}
        const categoriesList = ["revenue", "customers", "opportunities", "other"]

        categoriesList.forEach((category) => {
          const categoryGoals = goals.filter((goal) => goal.category === category)
          const completedCategoryGoals = categoryGoals.filter((goal) => goal.status === "completed").length
          categoryCompletion[category] =
            categoryGoals.length > 0 ? (completedCategoryGoals / categoryGoals.length) * 100 : 0
        })

        // 计算状态分布
        const statusDistribution: Record<string, number> = {
          active: goals.filter((goal) => goal.status === "active").length,
          completed: goals.filter((goal) => goal.status === "completed").length,
          overdue: goals.filter((goal) => goal.status === "overdue").length,
        }

        // 生成完成趋势数据（模拟数据）
        const completionTrend = [
          { month: "1月", 完成率: 65 },
          { month: "2月", 完成率: 70 },
          { month: "3月", 完成率: 75 },
          { month: "4月", 完成率: 68 },
          { month: "5月", 完成率: 72 },
          { month: "6月", 完成率: 78 },
        ]

        // 找出表现最好的目标（完成率最高的）
        const topPerformingGoals = [...goals]
          .map((goal) => ({
            ...goal,
            completionRate: (goal.currentValue / goal.targetValue) * 100,
          }))
          .sort((a, b) => b.completionRate - a.completionRate)
          .slice(0, 3)

        // 找出风险目标（接近截止日期但完成率低的）
        const today = new Date()
        const atRiskGoals = goals
          .filter((goal) => {
            const endDate = new Date(goal.endDate)
            const timeLeft = endDate.getTime() - today.getTime()
            const daysLeft = timeLeft / (1000 * 60 * 60 * 24)
            const completionRate = (goal.currentValue / goal.targetValue) * 100

            // 如果剩余时间少于30天且完成率低于70%，则视为风险目标
            return goal.status === "active" && daysLeft < 30 && completionRate < 70
          })
          .slice(0, 3)

        // 生成雷达图数据
        const radarData = [
          { subject: "收入目标", A: categoryCompletion.revenue || 0, fullMark: 100 },
          { subject: "客户目标", A: categoryCompletion.customers || 0, fullMark: 100 },
          { subject: "商机目标", A: categoryCompletion.opportunities || 0, fullMark: 100 },
          { subject: "其他目标", A: categoryCompletion.other || 0, fullMark: 100 },
          { subject: "总体完成", A: overallCompletion, fullMark: 100 },
        ]

        // 生成热图数据（目标完成情况按月份和类别）
        const heatmapData = []
        const months = ["1月", "2月", "3月", "4月", "5月", "6月"]
        const categoryNames = {
          revenue: "收入",
          customers: "客户",
          opportunities: "商机",
          other: "其他",
        }

        // 模拟每月每类别的完成率数据
        months.forEach((month) => {
          const monthData: any = { month }
          categoriesList.forEach((category) => {
            // 生成50-100之间的随机数作为完成率
            monthData[categoryNames[category]] = Math.floor(Math.random() * 50) + 50
          })
          heatmapData.push(monthData)
        })

        // 生成目标表现矩阵（散点图数据）
        const performanceMatrix = goals.map((goal) => {
          const completionRate = (goal.currentValue / goal.targetValue) * 100
          const endDate = new Date(goal.endDate)
          const today = new Date()
          const timeLeft = endDate.getTime() - today.getTime()
          const daysLeft = timeLeft / (1000 * 60 * 60 * 24)

          // 计算时间紧迫度（0-100，越小越紧迫）
          const urgency = Math.max(0, Math.min(100, (daysLeft / 30) * 100))

          return {
            name: goal.name,
            category: goal.category,
            completion: completionRate,
            urgency: urgency,
            value: goal.targetValue,
          }
        })

        // 生成目标分布树状图数据
        const goalDistribution = [
          {
            name: "所有目标",
            children: [
              {
                name: "收入",
                children: goals
                  .filter((goal) => goal.category === "revenue")
                  .map((goal) => ({
                    name: goal.name,
                    size: goal.targetValue,
                    completion: (goal.currentValue / goal.targetValue) * 100,
                  })),
              },
              {
                name: "客户",
                children: goals
                  .filter((goal) => goal.category === "customers")
                  .map((goal) => ({
                    name: goal.name,
                    size: goal.targetValue,
                    completion: (goal.currentValue / goal.targetValue) * 100,
                  })),
              },
              {
                name: "商机",
                children: goals
                  .filter((goal) => goal.category === "opportunities")
                  .map((goal) => ({
                    name: goal.name,
                    size: goal.targetValue,
                    completion: (goal.currentValue / goal.targetValue) * 100,
                  })),
              },
              {
                name: "其他",
                children: goals
                  .filter((goal) => goal.category === "other")
                  .map((goal) => ({
                    name: goal.name,
                    size: goal.targetValue,
                    completion: (goal.currentValue / goal.targetValue) * 100,
                  })),
              },
            ],
          },
        ]

        // 更新报告数据
        setReportData({
          overallCompletion,
          categoryCompletion,
          statusDistribution,
          completionTrend,
          topPerformingGoals,
          atRiskGoals,
          radarData,
          heatmapData,
          performanceMatrix,
          goalDistribution,
        })

        setIsGenerating(false)
      } catch (err) {
        console.error("Error generating report:", err)
        setError("生成报告时出错：" + err.message)
        setIsGenerating(false)
      }
    }, 1500)
  }

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

  // 计算目标进度百分比
  const calculateProgress = (current: number, target: number) => {
    const progress = (current / target) * 100
    return Math.min(progress, 100) // 确保不超过100%
  }

  // 获取目标图标
  const getGoalIcon = (category: string) => {
    switch (category) {
      case "revenue":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "customers":
        return <Users className="h-5 w-5 text-blue-600" />
      case "opportunities":
        return <Target className="h-5 w-5 text-purple-600" />
      default:
        return <Flag className="h-5 w-5 text-amber-600" />
    }
  }

  // 获取报告期间名称
  const getReportPeriodName = () => {
    switch (reportPeriod) {
      case "weekly":
        return "周报"
      case "monthly":
        return "月报"
      case "quarterly":
        return "季报"
      case "yearly":
        return "年报"
      default:
        return "报告"
    }
  }

  // 导出报告
  const exportReport = async () => {
    try {
      setIsGenerating(true)

      await exportReportToPDF({
        title: `目标完成情况${getReportPeriodName()}`,
        date: new Date().toLocaleDateString("zh-CN"),
        goals,
        overallCompletion: reportData.overallCompletion,
        statusDistribution: reportData.statusDistribution,
        topPerformingGoals: reportData.topPerformingGoals,
        atRiskGoals: reportData.atRiskGoals,
        categoryCompletion: reportData.categoryCompletion,
        template: currentTemplate, // 传递当前模板
      })

      setIsGenerating(false)
    } catch (err) {
      console.error("导出报告时出错:", err)
      setError("导出报告时出错: " + err.message)
      setIsGenerating(false)
      alert("导出报告时出错，请查看控制台获取详细信息。")
    }
  }

  // 导出单个图表
  const exportChart = async (chartId: string, title: string) => {
    try {
      setIsGenerating(true)

      const chartElement = document.getElementById(chartId)
      if (!chartElement) {
        throw new Error("图表元素不存在")
      }

      await exportChartToPDF(chartElement, title, currentTemplate) // 传递当前模板

      setIsGenerating(false)
    } catch (err) {
      console.error("导出图表时出错:", err)
      setError("导出图表时出错: " + err.message)
      setIsGenerating(false)
      alert("导出图表时出错，请查看控制台获取详细信息。")
    }
  }

  // 饼图颜色
  const getChartColors = () => {
    return currentTemplate.colors.chartColors || ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
  }

  // 如果 worksheetId 是占位符，显示配置提示
  if (
    customersWorksheetId === "your_customers_worksheet_id" ||
    opportunitiesWorksheetId === "your_opportunities_worksheet_id"
  ) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>目标完成情况报告</CardTitle>
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

  return (
    <div ref={reportContainerRef} className={`${styles.reportContainer}`}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="card-title">目标完成情况报告</CardTitle>
            <CardDescription className="card-description">生成和查看目标完成情况的定期报告</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <TemplateSelector />
            <Button variant="outline" size="sm" onClick={exportReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  导出报告
                </>
              )}
            </Button>
            <Button size="sm" onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  生成报告
                </>
              )}
            </Button>
          </div>
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
              <div
                id="report-content"
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">报告类型：</span>
                  </div>
                  <Select value={reportPeriod} onValueChange={(value) => setReportPeriod(value as ReportPeriod)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="选择报告类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">周报</SelectItem>
                      <SelectItem value="monthly">月报</SelectItem>
                      <SelectItem value="quarterly">季报</SelectItem>
                      <SelectItem value="yearly">年报</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">报告日期：</span>
                  </div>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="px-3 py-1 border rounded-md"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-800">
                    {getReportPeriodName()} -{" "}
                    {new Date(reportDate).toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
                  </h3>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  本报告包含 {goals.length} 个目标的完成情况，总体完成率为 {formatPercent(reportData.overallCompletion)}
                  。
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">总览</TabsTrigger>
                  <TabsTrigger value="categories">类别分析</TabsTrigger>
                  <TabsTrigger value="trends">趋势分析</TabsTrigger>
                  <TabsTrigger value="advanced">高级分析</TabsTrigger>
                  <TabsTrigger value="details">详细目标</TabsTrigger>
                </TabsList>

                {/* 总览标签页 */}
                <TabsContent value="overview">
                  <div id="overview-charts" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="card">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between card-header">
                        <CardTitle className="text-base font-medium card-title">总体完成率</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportChart("overall-completion-chart", "总体完成率")}
                          disabled={isGenerating}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div id="overall-completion-chart" className="flex flex-col items-center">
                          <div className="text-4xl font-bold mb-2">{formatPercent(reportData.overallCompletion)}</div>
                          <Progress
                            value={reportData.overallCompletion}
                            className="h-2 w-full"
                            style={
                              {
                                backgroundColor: currentTemplate.colors.border,
                                "--progress-color": currentTemplate.colors.primary,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between card-header">
                        <CardTitle className="text-base font-medium card-title">目标状态分布</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportChart("status-distribution-chart", "目标状态分布")}
                          disabled={isGenerating}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div id="status-distribution-chart" className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: "进行中", value: reportData.statusDistribution.active || 0 },
                                  { name: "已完成", value: reportData.statusDistribution.completed || 0 },
                                  { name: "已逾期", value: reportData.statusDistribution.overdue || 0 },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {[
                                  { name: "进行中", value: reportData.statusDistribution.active || 0 },
                                  { name: "已完成", value: reportData.statusDistribution.completed || 0 },
                                  { name: "已逾期", value: reportData.statusDistribution.overdue || 0 },
                                ].map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={getChartColors()[index % getChartColors().length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 其余内容省略，但应该类似地应用模板样式 */}
                    {/* 第三个卡片 - 目标类别分布 */}
                    <Card className="card">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between card-header">
                        <CardTitle className="text-base font-medium card-title">目标类别分布</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportChart("category-distribution-chart", "目标类别分布")}
                          disabled={isGenerating}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div id="category-distribution-chart" className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  {
                                    name: "收入",
                                    value: goals.filter((goal) => goal.category === "revenue").length,
                                  },
                                  {
                                    name: "客户",
                                    value: goals.filter((goal) => goal.category === "customers").length,
                                  },
                                  {
                                    name: "商机",
                                    value: goals.filter((goal) => goal.category === "opportunities").length,
                                  },
                                  {
                                    name: "其他",
                                    value: goals.filter((goal) => goal.category === "other").length,
                                  },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {[
                                  {
                                    name: "收入",
                                    value: goals.filter((goal) => goal.category === "revenue").length,
                                  },
                                  {
                                    name: "客户",
                                    value: goals.filter((goal) => goal.category === "customers").length,
                                  },
                                  {
                                    name: "商机",
                                    value: goals.filter((goal) => goal.category === "opportunities").length,
                                  },
                                  {
                                    name: "其他",
                                    value: goals.filter((goal) => goal.category === "other").length,
                                  },
                                ].map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={getChartColors()[index % getChartColors().length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="card">
                      <CardHeader className="pb-2 card-header">
                        <CardTitle className="text-base font-medium card-title">表现最佳的目标</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {reportData.topPerformingGoals.map((goal) => (
                            <div
                              key={goal.id}
                              className="border rounded-lg p-3"
                              style={{ borderColor: currentTemplate.colors.border }}
                            >
                              <div className="flex items-center mb-2">
                                <div className="p-1.5 bg-gray-100 rounded-full mr-2">{getGoalIcon(goal.category)}</div>
                                <div className="font-medium">{goal.name}</div>
                              </div>
                              <div className="text-sm text-gray-500 mb-2">{goal.description}</div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">{goal.metricType}</span>
                                  <span className="text-sm">
                                    {goal.currentValue} / {goal.targetValue}
                                  </span>
                                </div>
                                <Progress
                                  value={calculateProgress(goal.currentValue, goal.targetValue)}
                                  className="h-2"
                                  style={
                                    {
                                      backgroundColor: currentTemplate.colors.border,
                                      "--progress-color": currentTemplate.colors.success,
                                    } as React.CSSProperties
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card">
                      <CardHeader className="pb-2 card-header">
                        <CardTitle className="text-base font-medium card-title">需要关注的目标</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {reportData.atRiskGoals.length > 0 ? (
                            reportData.atRiskGoals.map((goal) => (
                              <div
                                key={goal.id}
                                className="border rounded-lg p-3"
                                style={{
                                  borderColor: currentTemplate.colors.danger,
                                  backgroundColor: `${currentTemplate.colors.danger}10`,
                                }}
                              >
                                <div className="flex items-center mb-2">
                                  <div
                                    className="p-1.5 rounded-full mr-2"
                                    style={{ backgroundColor: `${currentTemplate.colors.danger}20` }}
                                  >
                                    {getGoalIcon(goal.category)}
                                  </div>
                                  <div className="font-medium">{goal.name}</div>
                                </div>
                                <div className="text-sm mb-2" style={{ color: currentTemplate.colors.subtext }}>
                                  {goal.description}
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">{goal.metricType}</span>
                                    <span className="text-sm">
                                      {goal.currentValue} / {goal.targetValue}
                                    </span>
                                  </div>
                                  <Progress
                                    value={calculateProgress(goal.currentValue, goal.targetValue)}
                                    className="h-2"
                                    style={
                                      {
                                        backgroundColor: currentTemplate.colors.border,
                                        "--progress-color": currentTemplate.colors.warning,
                                      } as React.CSSProperties
                                    }
                                  />
                                </div>
                                <div className="mt-2 text-sm" style={{ color: currentTemplate.colors.danger }}>
                                  截止日期: {new Date(goal.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8" style={{ color: currentTemplate.colors.subtext }}>
                              <p>没有需要特别关注的目标</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 其他标签页内容也应该类似地应用模板样式 */}
                {/* 这里省略了其他标签页的内容，但应该按照相同的方式应用模板样式 */}
              </Tabs>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between" style={{ color: currentTemplate.colors.subtext }}>
          <div className="text-sm">报告生成时间: {new Date().toLocaleString("zh-CN")}</div>
          <div className="text-sm">数据来源: 明道云业务目标跟踪系统</div>
        </CardFooter>
      </Card>
    </div>
  )
}

// 创建一个包装组件，提供模板上下文
export function MingdaoGoalReportWithTemplates(props: MingdaoGoalReportProps) {
  return (
    <TemplateProvider>
      <MingdaoGoalReport {...props} />
    </TemplateProvider>
  )
}
