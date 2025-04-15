"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  Calendar,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Award,
  Zap,
  Target,
  TrendingUp,
  BarChart2,
  Users,
  CheckCircle,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts"
import { useTemplate } from "../contexts/template-context"
import { exportReportToPDF } from "../utils/report-exporter"
import { TemplateSelector } from "./template-selector"
import styles from "../styles/template-styles.module.css"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// 团队成员类型
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  department: string
  performance: number
  skills: Record<string, number>
  projects: string[]
  tasks: {
    completed: number
    inProgress: number
    overdue: number
  }
  attendance: number
  productivity: number
}

// 项目类型
interface Project {
  id: string
  name: string
  status: "planning" | "inProgress" | "completed" | "onHold"
  progress: number
  startDate: string
  endDate: string
  teamMembers: string[]
  budget: {
    allocated: number
    spent: number
  }
  tasks: {
    total: number
    completed: number
  }
  priority: "low" | "medium" | "high"
}

// 部门类型
interface Department {
  id: string
  name: string
  headCount: number
  performance: number
  budget: {
    allocated: number
    spent: number
  }
  projects: number
}

// 团队目标类型
interface TeamGoal {
  id: string
  name: string
  description: string
  category: "performance" | "revenue" | "innovation" | "quality" | "growth" | "other"
  targetValue: number
  currentValue: number
  unit: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "at_risk" | "overdue"
  assignedTo: string[] // 团队成员ID
  relatedProjects: string[] // 项目ID
  milestones: {
    id: string
    name: string
    dueDate: string
    completed: boolean
  }[]
  progress: number // 0-100
  priority: "low" | "medium" | "high"
  history: {
    date: string
    value: number
  }[]
}

// 团队管理报告属性
interface TeamManagementReportProps {
  teamId: string
}

export function TeamManagementReport({ teamId }: TeamManagementReportProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [teamGoals, setTeamGoals] = useState<TeamGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [reportPeriod, setReportPeriod] = useState<"weekly" | "monthly" | "quarterly">("monthly")
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const { currentTemplate, setTemplate } = useTemplate()
  const reportContainerRef = useRef<HTMLDivElement>(null)

  // 团队成员对比分析状态
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [comparisonMetric, setComparisonMetric] = useState<"performance" | "skills" | "productivity" | "tasks">(
    "performance",
  )
  const [showComparisonDialog, setShowComparisonDialog] = useState(false)

  // 团队目标对话框状态
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [currentGoal, setCurrentGoal] = useState<TeamGoal | null>(null)
  const [goalFilter, setGoalFilter] = useState<"all" | "active" | "completed" | "at_risk">("all")
  const [isGoalExpanded, setIsGoalExpanded] = useState<Record<string, boolean>>({})

  // 加载团队数据
  const loadTeamData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 在实际应用中，这里应该从API获取团队数据
      // 这里使用模拟数据

      // 模拟团队成员数据
      const mockTeamMembers: TeamMember[] = [
        {
          id: "1",
          name: "张明",
          role: "团队负责人",
          avatar: "",
          department: "研发部",
          performance: 92,
          skills: {
            领导力: 90,
            沟通: 85,
            技术: 80,
            决策: 88,
            创新: 75,
          },
          projects: ["项目A", "项目B", "项目C"],
          tasks: {
            completed: 45,
            inProgress: 12,
            overdue: 2,
          },
          attendance: 98,
          productivity: 94,
        },
        {
          id: "2",
          name: "李华",
          role: "高级开发",
          avatar: "",
          department: "研发部",
          performance: 88,
          skills: {
            领导力: 70,
            沟通: 75,
            技术: 95,
            决策: 80,
            创新: 85,
          },
          projects: ["项目A", "项目D"],
          tasks: {
            completed: 38,
            inProgress: 8,
            overdue: 1,
          },
          attendance: 95,
          productivity: 90,
        },
        {
          id: "3",
          name: "王芳",
          role: "UI设计师",
          avatar: "",
          department: "设计部",
          performance: 85,
          skills: {
            领导力: 65,
            沟通: 90,
            技术: 85,
            决策: 70,
            创新: 95,
          },
          projects: ["项目B", "项目E"],
          tasks: {
            completed: 32,
            inProgress: 10,
            overdue: 0,
          },
          attendance: 92,
          productivity: 88,
        },
        {
          id: "4",
          name: "赵强",
          role: "产品经理",
          avatar: "",
          department: "产品部",
          performance: 90,
          skills: {
            领导力: 85,
            沟通: 95,
            技术: 70,
            决策: 90,
            创新: 85,
          },
          projects: ["项目A", "项目C", "项目E"],
          tasks: {
            completed: 40,
            inProgress: 15,
            overdue: 3,
          },
          attendance: 96,
          productivity: 92,
        },
        {
          id: "5",
          name: "刘伟",
          role: "测试工程师",
          avatar: "",
          department: "测试部",
          performance: 82,
          skills: {
            领导力: 60,
            沟通: 80,
            技术: 90,
            决策: 75,
            创新: 65,
          },
          projects: ["项目B", "项目D"],
          tasks: {
            completed: 35,
            inProgress: 5,
            overdue: 1,
          },
          attendance: 94,
          productivity: 85,
        },
      ]

      // 模拟项目数据
      const mockProjects: Project[] = [
        {
          id: "A",
          name: "客户管理系统升级",
          status: "inProgress",
          progress: 65,
          startDate: "2023-01-15",
          endDate: "2023-06-30",
          teamMembers: ["1", "2", "4"],
          budget: {
            allocated: 200000,
            spent: 130000,
          },
          tasks: {
            total: 120,
            completed: 78,
          },
          priority: "high",
        },
        {
          id: "B",
          name: "移动应用UI改版",
          status: "inProgress",
          progress: 40,
          startDate: "2023-03-01",
          endDate: "2023-07-15",
          teamMembers: ["1", "3", "5"],
          budget: {
            allocated: 150000,
            spent: 60000,
          },
          tasks: {
            total: 85,
            completed: 34,
          },
          priority: "medium",
        },
        {
          id: "C",
          name: "数据分析平台",
          status: "planning",
          progress: 15,
          startDate: "2023-05-01",
          endDate: "2023-12-31",
          teamMembers: ["1", "4"],
          budget: {
            allocated: 300000,
            spent: 45000,
          },
          tasks: {
            total: 150,
            completed: 22,
          },
          priority: "high",
        },
        {
          id: "D",
          name: "安全审计系统",
          status: "inProgress",
          progress: 80,
          startDate: "2023-02-15",
          endDate: "2023-05-30",
          teamMembers: ["2", "5"],
          budget: {
            allocated: 120000,
            spent: 96000,
          },
          tasks: {
            total: 70,
            completed: 56,
          },
          priority: "medium",
        },
        {
          id: "E",
          name: "营销网站重构",
          status: "completed",
          progress: 100,
          startDate: "2023-01-10",
          endDate: "2023-04-15",
          teamMembers: ["3", "4"],
          budget: {
            allocated: 100000,
            spent: 98000,
          },
          tasks: {
            total: 60,
            completed: 60,
          },
          priority: "low",
        },
      ]

      // 模拟部门数据
      const mockDepartments: Department[] = [
        {
          id: "dev",
          name: "研发部",
          headCount: 12,
          performance: 88,
          budget: {
            allocated: 500000,
            spent: 350000,
          },
          projects: 8,
        },
        {
          id: "design",
          name: "设计部",
          headCount: 6,
          performance: 85,
          budget: {
            allocated: 250000,
            spent: 180000,
          },
          projects: 5,
        },
        {
          id: "product",
          name: "产品部",
          headCount: 8,
          performance: 90,
          budget: {
            allocated: 300000,
            spent: 240000,
          },
          projects: 6,
        },
        {
          id: "test",
          name: "测试部",
          headCount: 7,
          performance: 82,
          budget: {
            allocated: 200000,
            spent: 160000,
          },
          projects: 4,
        },
      ]

      // 模拟团队目标数据
      const mockTeamGoals: TeamGoal[] = [
        {
          id: "goal1",
          name: "提高团队整体绩效",
          description: "通过培训和流程优化，将团队整体绩效提升至90%以上",
          category: "performance",
          targetValue: 90,
          currentValue: 87,
          unit: "%",
          startDate: "2023-01-01",
          endDate: "2023-06-30",
          status: "active",
          assignedTo: ["1", "2", "3", "4", "5"],
          relatedProjects: ["A", "B", "C", "D", "E"],
          milestones: [
            {
              id: "m1-1",
              name: "完成团队技能评估",
              dueDate: "2023-01-31",
              completed: true,
            },
            {
              id: "m1-2",
              name: "制定培训计划",
              dueDate: "2023-02-28",
              completed: true,
            },
            {
              id: "m1-3",
              name: "实施流程优化",
              dueDate: "2023-04-30",
              completed: false,
            },
            {
              id: "m1-4",
              name: "最终绩效评估",
              dueDate: "2023-06-15",
              completed: false,
            },
          ],
          progress: 65,
          priority: "high",
          history: [
            { date: "2023-01-31", value: 82 },
            { date: "2023-02-28", value: 84 },
            { date: "2023-03-31", value: 85 },
            { date: "2023-04-30", value: 87 },
          ],
        },
        {
          id: "goal2",
          name: "增加季度收入",
          description: "通过新产品发布和市场拓展，实现季度收入增长20%",
          category: "revenue",
          targetValue: 20,
          currentValue: 15,
          unit: "%",
          startDate: "2023-01-01",
          endDate: "2023-03-31",
          status: "completed",
          assignedTo: ["1", "4"],
          relatedProjects: ["A", "E"],
          milestones: [
            {
              id: "m2-1",
              name: "市场调研",
              dueDate: "2023-01-15",
              completed: true,
            },
            {
              id: "m2-2",
              name: "产品发布",
              dueDate: "2023-02-15",
              completed: true,
            },
            {
              id: "m2-3",
              name: "销售目标达成",
              dueDate: "2023-03-25",
              completed: true,
            },
          ],
          progress: 100,
          priority: "high",
          history: [
            { date: "2023-01-31", value: 5 },
            { date: "2023-02-28", value: 12 },
            { date: "2023-03-31", value: 15 },
          ],
        },
        {
          id: "goal3",
          name: "提高产品质量",
          description: "降低产品缺陷率，提高客户满意度",
          category: "quality",
          targetValue: 99.5,
          currentValue: 98.2,
          unit: "%",
          startDate: "2023-02-01",
          endDate: "2023-07-31",
          status: "at_risk",
          assignedTo: ["2", "5"],
          relatedProjects: ["B", "D"],
          milestones: [
            {
              id: "m3-1",
              name: "质量审计",
              dueDate: "2023-02-28",
              completed: true,
            },
            {
              id: "m3-2",
              name: "实施质量改进计划",
              dueDate: "2023-04-15",
              completed: true,
            },
            {
              id: "m3-3",
              name: "中期评估",
              dueDate: "2023-05-30",
              completed: false,
            },
            {
              id: "m3-4",
              name: "最终质量评估",
              dueDate: "2023-07-15",
              completed: false,
            },
          ],
          progress: 45,
          priority: "medium",
          history: [
            { date: "2023-02-28", value: 97.5 },
            { date: "2023-03-31", value: 97.8 },
            { date: "2023-04-30", value: 98.2 },
          ],
        },
        {
          id: "goal4",
          name: "开发创新产品功能",
          description: "开发3个创新产品功能，提升市场竞争力",
          category: "innovation",
          targetValue: 3,
          currentValue: 1,
          unit: "个",
          startDate: "2023-03-01",
          endDate: "2023-08-31",
          status: "active",
          assignedTo: ["1", "2", "3"],
          relatedProjects: ["B", "C"],
          milestones: [
            {
              id: "m4-1",
              name: "创新功能头脑风暴",
              dueDate: "2023-03-15",
              completed: true,
            },
            {
              id: "m4-2",
              name: "功能1原型开发",
              dueDate: "2023-04-30",
              completed: true,
            },
            {
              id: "m4-3",
              name: "功能2原型开发",
              dueDate: "2023-06-15",
              completed: false,
            },
            {
              id: "m4-4",
              name: "功能3原型开发",
              dueDate: "2023-07-31",
              completed: false,
            },
          ],
          progress: 35,
          priority: "high",
          history: [
            { date: "2023-03-31", value: 0 },
            { date: "2023-04-30", value: 1 },
          ],
        },
        {
          id: "goal5",
          name: "扩大团队规模",
          description: "招聘5名新团队成员，扩大团队规模",
          category: "growth",
          targetValue: 5,
          currentValue: 2,
          unit: "人",
          startDate: "2023-02-15",
          endDate: "2023-06-30",
          status: "active",
          assignedTo: ["1", "4"],
          relatedProjects: [],
          milestones: [
            {
              id: "m5-1",
              name: "制定招聘计划",
              dueDate: "2023-02-28",
              completed: true,
            },
            {
              id: "m5-2",
              name: "发布招聘信息",
              dueDate: "2023-03-15",
              completed: true,
            },
            {
              id: "m5-3",
              name: "完成第一轮招聘",
              dueDate: "2023-04-30",
              completed: true,
            },
            {
              id: "m5-4",
              name: "完成第二轮招聘",
              dueDate: "2023-06-15",
              completed: false,
            },
          ],
          progress: 40,
          priority: "medium",
          history: [
            { date: "2023-02-28", value: 0 },
            { date: "2023-03-31", value: 0 },
            { date: "2023-04-30", value: 2 },
          ],
        },
      ]

      // 设置数据
      setTeamMembers(mockTeamMembers)
      setProjects(mockProjects)
      setDepartments(mockDepartments)
      setTeamGoals(mockTeamGoals)

      // 初始化选中的团队成员（用于对比分析）
      setSelectedMembers(mockTeamMembers.slice(0, 3).map((m) => m.id))

      // 设置团队管理模板
      setTemplate("team_management")
    } catch (err) {
      console.error("Error loading team data:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadTeamData()
  }, [])

  // 当模板变化时应用样式
  useEffect(() => {
    if (reportContainerRef.current) {
      // 移除所有模板类
      reportContainerRef.current.classList.remove(styles.default, styles.modern, styles.corporate, styles.colorful)

      // 添加当前模板类
      reportContainerRef.current.classList.add(styles.templateApplied)
      reportContainerRef.current.classList.add(styles[currentTemplate.id])
    }
  }, [currentTemplate])

  // 导出报告
  const exportReport = async () => {
    try {
      setIsGenerating(true)

      await exportReportToPDF({
        title: `团队管理报告 - ${reportPeriod === "weekly" ? "周报" : reportPeriod === "monthly" ? "月报" : "季报"}`,
        date: new Date(reportDate).toLocaleDateString("zh-CN"),
        goals: [], // 这里可以传入团队目标数据
        overallCompletion: calculateTeamPerformance(),
        statusDistribution: {
          active: projects.filter((p) => p.status === "inProgress").length,
          completed: projects.filter((p) => p.status === "completed").length,
          overdue: projects.filter((p) => p.status === "onHold").length,
        },
        topPerformingGoals: [], // 这里可以传入团队顶级目标
        atRiskGoals: [], // 这里可以传入风险目标
        categoryCompletion: {
          revenue: 85,
          customers: 78,
          opportunities: 92,
          other: 80,
        },
        template: currentTemplate,
      })

      setIsGenerating(false)
    } catch (err) {
      console.error("导出报告时出错:", err)
      setError("导出报告时出错: " + err.message)
      setIsGenerating(false)
      alert("导出报告时出错，请查看控制台获取详细信息。")
    }
  }

  // 计算团队整体绩效
  const calculateTeamPerformance = () => {
    if (teamMembers.length === 0) return 0
    return teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length
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

  // 获取项目状态名称
  const getProjectStatusName = (status: string) => {
    switch (status) {
      case "planning":
        return "规划中"
      case "inProgress":
        return "进行中"
      case "completed":
        return "已完成"
      case "onHold":
        return "已暂停"
      default:
        return status
    }
  }

  // 获取项目状态颜色
  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "inProgress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "onHold":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取优先级名称
  const getPriorityName = (priority: string) => {
    switch (priority) {
      case "low":
        return "低"
      case "medium":
        return "中"
      case "high":
        return "高"
      default:
        return priority
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取目标状态名称
  const getGoalStatusName = (status: string) => {
    switch (status) {
      case "active":
        return "进行中"
      case "completed":
        return "已完成"
      case "at_risk":
        return "风险中"
      case "overdue":
        return "已逾期"
      default:
        return status
    }
  }

  // 获取目标状态颜色
  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "at_risk":
        return "bg-amber-100 text-amber-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取目标类别名称
  const getGoalCategoryName = (category: string) => {
    switch (category) {
      case "performance":
        return "绩效"
      case "revenue":
        return "收入"
      case "innovation":
        return "创新"
      case "quality":
        return "质量"
      case "growth":
        return "增长"
      default:
        return "其他"
    }
  }

  // 获取目标类别颜色
  const getGoalCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-purple-100 text-purple-800"
      case "revenue":
        return "bg-green-100 text-green-800"
      case "innovation":
        return "bg-blue-100 text-blue-800"
      case "quality":
        return "bg-indigo-100 text-indigo-800"
      case "growth":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // 获取目标类别图标
  const getGoalCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <Award className="h-4 w-4" />
      case "revenue":
        return <TrendingUp className="h-4 w-4" />
      case "innovation":
        return <Zap className="h-4 w-4" />
      case "quality":
        return <CheckCircle className="h-4 w-4" />
      case "growth":
        return <BarChart2 className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  // 图表颜色
  const getChartColors = () => {
    return currentTemplate.colors.chartColors || ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]
  }

  // 切换目标展开状态
  const toggleGoalExpanded = (goalId: string) => {
    setIsGoalExpanded({
      ...isGoalExpanded,
      [goalId]: !isGoalExpanded[goalId],
    })
  }

  // 过滤团队目标
  const filteredGoals = teamGoals.filter((goal) => {
    if (goalFilter === "all") return true
    return goal.status === goalFilter
  })

  // 处理团队成员选择变化
  const handleMemberSelectionChange = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      // 如果已选中，则移除
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
    } else {
      // 如果未选中，则添加
      setSelectedMembers([...selectedMembers, memberId])
    }
  }

  // 获取团队成员名称
  const getMemberName = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId)
    return member ? member.name : "未知成员"
  }

  // 获取项目名称
  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : "未知项目"
  }

  // 如果 teamId 是无效的，显示配置提示
  if (!teamId || teamId === "invalid_team_id") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>团队管理报告</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">配置需要更新</p>
              <p className="text-sm mt-1">请提供有效的团队ID</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div ref={reportContainerRef} className={`${styles.reportContainer}`}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="card-title">团队管理智能报告</CardTitle>
            <CardDescription className="card-description">现代化智能可视化的团队管理分析</CardDescription>
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
            <Button size="sm" onClick={loadTeamData} disabled={isLoading}>
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
                  <Select value={reportPeriod} onValueChange={(value) => setReportPeriod(value as any)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="选择报告类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">周报</SelectItem>
                      <SelectItem value="monthly">月报</SelectItem>
                      <SelectItem value="quarterly">季报</SelectItem>
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
                    团队管理{reportPeriod === "weekly" ? "周报" : reportPeriod === "monthly" ? "月报" : "季报"} -{" "}
                    {new Date(reportDate).toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
                  </h3>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  本报告包含 {teamMembers.length} 名团队成员、{projects.length} 个项目、{departments.length} 个部门和{" "}
                  {teamGoals.length} 个团队目标的管理数据， 团队整体绩效为 {formatPercent(calculateTeamPerformance())}。
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">总览</TabsTrigger>
                  <TabsTrigger value="team">团队成员</TabsTrigger>
                  <TabsTrigger value="projects">项目管理</TabsTrigger>
                  <TabsTrigger value="goals">团队目标</TabsTrigger>
                  <TabsTrigger value="comparison">成员对比</TabsTrigger>
                  <TabsTrigger value="departments">部门分析</TabsTrigger>
                </TabsList>

                {/* 总览标签页 */}
                <TabsContent value="overview">
                  <div id="overview-charts" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="card">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between card-header">
                        <CardTitle className="text-base font-medium card-title">团队整体绩效</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div id="team-performance-chart" className="flex flex-col items-center">
                          <div className="text-4xl font-bold mb-2">{formatPercent(calculateTeamPerformance())}</div>
                          <Progress
                            value={calculateTeamPerformance()}
                            className="h-2 w-full"
                            style={
                              {
                                backgroundColor: currentTemplate.colors.border,
                                "--progress-color": currentTemplate.colors.primary,
                              } as React.CSSProperties
                            }
                          />
                          <div className="mt-2 text-sm text-gray-500">
                            {calculateTeamPerformance() > 85
                              ? "团队表现优秀"
                              : calculateTeamPerformance() > 70
                                ? "团队表现良好"
                                : "团队需要改进"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between card-header">
                        <CardTitle className="text-base font-medium card-title">项目状态分布</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div id="project-status-chart" className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: "规划中", value: projects.filter((p) => p.status === "planning").length },
                                  { name: "进行中", value: projects.filter((p) => p.status === "inProgress").length },
                                  { name: "已完成", value: projects.filter((p) => p.status === "completed").length },
                                  { name: "已暂停", value: projects.filter((p) => p.status === "onHold").length },
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
                                  { name: "规划中", value: projects.filter((p) => p.status === "planning").length },
                                  { name: "进行中", value: projects.filter((p) => p.status === "inProgress").length },
                                  { name: "已完成", value: projects.filter((p) => p.status === "completed").length },
                                  { name: "已暂停", value: projects.filter((p) => p.status === "onHold").length },
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

                    <Card className="card">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between card-header">
                        <CardTitle className="text-base font-medium card-title">团队目标状态</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div id="goal-status-chart" className="h-[150px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: "进行中", value: teamGoals.filter((g) => g.status === "active").length },
                                  { name: "已完成", value: teamGoals.filter((g) => g.status === "completed").length },
                                  { name: "风险中", value: teamGoals.filter((g) => g.status === "at_risk").length },
                                  { name: "已逾期", value: teamGoals.filter((g) => g.status === "overdue").length },
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
                                  { name: "进行中", value: teamGoals.filter((g) => g.status === "active").length },
                                  { name: "已完成", value: teamGoals.filter((g) => g.status === "completed").length },
                                  { name: "风险中", value: teamGoals.filter((g) => g.status === "at_risk").length },
                                  { name: "已逾期", value: teamGoals.filter((g) => g.status === "overdue").length },
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
                        <CardTitle className="text-base font-medium card-title">绩效最佳团队成员</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {teamMembers
                            .sort((a, b) => b.performance - a.performance)
                            .slice(0, 3)
                            .map((member) => (
                              <div
                                key={member.id}
                                className="border rounded-lg p-3"
                                style={{ borderColor: currentTemplate.colors.border }}
                              >
                                <div className="flex items-center mb-2">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {member.role} - {member.department}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">绩效评分</span>
                                    <span className="text-sm">{member.performance}%</span>
                                  </div>
                                  <Progress
                                    value={member.performance}
                                    className="h-2"
                                    style={
                                      {
                                        backgroundColor: currentTemplate.colors.border,
                                        "--progress-color": currentTemplate.colors.success,
                                      } as React.CSSProperties
                                    }
                                  />
                                </div>
                                <div className="mt-2 text-sm">
                                  <span className="text-gray-500">参与项目: </span>
                                  {member.projects.join(", ")}
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card">
                      <CardHeader className="pb-2 card-header">
                        <CardTitle className="text-base font-medium card-title">重点关注目标</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {teamGoals
                            .filter((goal) => goal.status === "at_risk" || goal.priority === "high")
                            .slice(0, 3)
                            .map((goal) => (
                              <div
                                key={goal.id}
                                className="border rounded-lg p-3"
                                style={{
                                  borderColor:
                                    goal.status === "at_risk"
                                      ? currentTemplate.colors.warning
                                      : currentTemplate.colors.border,
                                }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium">{goal.name}</div>
                                  <div className="flex space-x-2">
                                    <Badge className={getGoalStatusColor(goal.status)}>
                                      {getGoalStatusName(goal.status)}
                                    </Badge>
                                    <Badge className={getGoalCategoryColor(goal.category)}>
                                      {getGoalCategoryName(goal.category)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">{goal.description}</div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm">进度</span>
                                    <span className="text-sm">
                                      {goal.currentValue}
                                      {goal.unit} / {goal.targetValue}
                                      {goal.unit}
                                    </span>
                                  </div>
                                  <Progress
                                    value={goal.progress}
                                    className="h-2"
                                    style={
                                      {
                                        backgroundColor: currentTemplate.colors.border,
                                        "--progress-color":
                                          goal.status === "at_risk"
                                            ? currentTemplate.colors.warning
                                            : currentTemplate.colors.primary,
                                      } as React.CSSProperties
                                    }
                                  />
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                  截止日期: {new Date(goal.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 团队目标标签页 */}
                <TabsContent value="goals">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-gray-500" />
                      <h3 className="text-lg font-medium">团队目标跟踪</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={goalFilter} onValueChange={(value) => setGoalFilter(value as any)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="筛选目标" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部目标</SelectItem>
                          <SelectItem value="active">进行中</SelectItem>
                          <SelectItem value="completed">已完成</SelectItem>
                          <SelectItem value="at_risk">风险中</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => setShowGoalDialog(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        添加目标
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {filteredGoals.length > 0 ? (
                      filteredGoals.map((goal) => (
                        <Card key={goal.id} className="card overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div
                                  className="p-2 rounded-full mr-2"
                                  style={{ backgroundColor: `${currentTemplate.colors.primary}20` }}
                                >
                                  {getGoalCategoryIcon(goal.category)}
                                </div>
                                <CardTitle className="text-base">{goal.name}</CardTitle>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getGoalCategoryColor(goal.category)}>
                                  {getGoalCategoryName(goal.category)}
                                </Badge>
                                <Badge className={getGoalStatusColor(goal.status)}>
                                  {getGoalStatusName(goal.status)}
                                </Badge>
                                <Badge className={getPriorityColor(goal.priority)}>
                                  {getPriorityName(goal.priority)}优先级
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => toggleGoalExpanded(goal.id)}
                                >
                                  {isGoalExpanded[goal.id] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-sm text-gray-500">{goal.description}</div>

                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">目标进度</span>
                                  <span className="text-sm">
                                    {goal.currentValue}
                                    {goal.unit} / {goal.targetValue}
                                    {goal.unit}
                                  </span>
                                </div>
                                <Progress
                                  value={goal.progress}
                                  className="h-2"
                                  style={
                                    {
                                      backgroundColor: currentTemplate.colors.border,
                                      "--progress-color":
                                        goal.status === "completed"
                                          ? currentTemplate.colors.success
                                          : goal.status === "at_risk"
                                            ? currentTemplate.colors.warning
                                            : goal.status === "overdue"
                                              ? currentTemplate.colors.danger
                                              : currentTemplate.colors.primary,
                                    } as React.CSSProperties
                                  }
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">开始日期: </span>
                                  {new Date(goal.startDate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="text-gray-500">结束日期: </span>
                                  {new Date(goal.endDate).toLocaleDateString()}
                                </div>
                              </div>

                              {isGoalExpanded[goal.id] && (
                                <>
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">目标里程碑</h4>
                                    <div className="space-y-2">
                                      {goal.milestones.map((milestone) => (
                                        <div
                                          key={milestone.id}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                                        >
                                          <div className="flex items-center">
                                            <div
                                              className={`w-4 h-4 rounded-full mr-2 ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                                            ></div>
                                            <span>{milestone.name}</span>
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {new Date(milestone.dueDate).toLocaleDateString()}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">目标进度历史</h4>
                                    <div className="h-[200px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={goal.history}>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) =>
                                              new Date(date).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                              })
                                            }
                                          />
                                          <YAxis domain={[0, goal.targetValue * 1.1]} />
                                          <Tooltip
                                            formatter={(value) => [`${value}${goal.unit}`, "值"]}
                                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                          />
                                          <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={currentTemplate.colors.primary}
                                            strokeWidth={2}
                                          />
                                          {/* 目标线 */}
                                          <Line
                                            type="monotone"
                                            dataKey={() => goal.targetValue}
                                            stroke={currentTemplate.colors.secondary}
                                            strokeDasharray="5 5"
                                            name="目标值"
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">负责团队成员</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {goal.assignedTo.map((memberId) => {
                                          const member = teamMembers.find((m) => m.id === memberId)
                                          return (
                                            <div key={memberId} className="flex items-center p-1 bg-gray-50 rounded-md">
                                              <Avatar className="h-6 w-6 mr-1">
                                                <AvatarImage
                                                  src={member?.avatar || "/placeholder.svg"}
                                                  alt={member?.name}
                                                />
                                                <AvatarFallback>{member?.name.substring(0, 2)}</AvatarFallback>
                                              </Avatar>
                                              <span className="text-sm">{member?.name}</span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium mb-2">相关项目</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {goal.relatedProjects.length > 0 ? (
                                          goal.relatedProjects.map((projectId) => (
                                            <Badge key={projectId} variant="outline">
                                              {getProjectName(projectId)}
                                            </Badge>
                                          ))
                                        ) : (
                                          <span className="text-sm text-gray-500">无相关项目</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 py-2">
                            <div className="w-full flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                {goal.status === "completed"
                                  ? "已完成"
                                  : `剩余 ${Math.ceil((new Date(goal.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 天`}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCurrentGoal(goal)
                                    setShowGoalDialog(true)
                                  }}
                                >
                                  编辑
                                </Button>
                                <Button size="sm" variant="outline">
                                  更新进度
                                </Button>
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>没有找到符合条件的目标</p>
                        <Button size="sm" variant="outline" className="mt-4" onClick={() => setShowGoalDialog(true)}>
                          <Plus className="h-4 w-4 mr-1" />
                          添加新目标
                        </Button>
                      </div>
                    )}
                  </div>

                  <Card className="card">
                    <CardHeader className="pb-2 card-header">
                      <CardTitle className="text-base font-medium card-title">目标完成趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart
                            data={[
                              { month: "1月", 目标完成率: 65, 目标数量: 3 },
                              { month: "2月", 目标完成率: 70, 目标数量: 4 },
                              { month: "3月", 目标完成率: 75, 目标数量: 5 },
                              { month: "4月", 目标完成率: 68, 目标数量: 5 },
                              { month: "5月", 目标完成率: 72, 目标数量: 6 },
                              { month: "6月", 目标完成率: 78, 目标数量: 6 },
                            ]}
                          />
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* TODO: Implement team goal tracking component */}
                </TabsContent>

                {/* 团队成员标签页 */}
                <TabsContent value="team">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">团队成员列表</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {teamMembers.map((member) => (
                      <Card key={member.id} className="card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 card-header">
                          <CardTitle className="text-base font-medium card-title">{member.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center">
                            <Avatar className="h-16 w-16 mb-2">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm text-gray-500 mb-2">{member.role}</div>
                            <div className="text-sm text-gray-500 mb-2">{member.department}</div>
                            <div className="flex justify-between w-full mb-1">
                              <span className="text-sm">绩效评分</span>
                              <span className="text-sm">{member.performance}%</span>
                            </div>
                            <Progress
                              value={member.performance}
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
                    ))}
                  </div>
                </TabsContent>

                {/* 项目管理标签页 */}
                <TabsContent value="projects">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">项目管理看板</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 card-header">
                          <CardTitle className="text-base font-medium card-title">{project.name}</CardTitle>
                          <Badge className={getProjectStatusColor(project.status)}>
                            {getProjectStatusName(project.status)}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">项目进度</span>
                              <span className="text-sm">{project.progress}%</span>
                            </div>
                            <Progress
                              value={project.progress}
                              className="h-2"
                              style={
                                {
                                  backgroundColor: currentTemplate.colors.border,
                                  "--progress-color": currentTemplate.colors.primary,
                                } as React.CSSProperties
                              }
                            />
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">开始日期: </span>
                              {new Date(project.startDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">结束日期: </span>
                              {new Date(project.endDate).toLocaleDateString()}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">优先级: </span>
                              <Badge className={getPriorityColor(project.priority)}>
                                {getPriorityName(project.priority)}
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">团队成员: </span>
                              {project.teamMembers.map((memberId) => {
                                const member = teamMembers.find((m) => m.id === memberId)
                                return (
                                  <Badge key={memberId} variant="secondary" className="mr-1">
                                    {member ? member.name : "未知成员"}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* 成员对比标签页 */}
                <TabsContent value="comparison">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">团队成员对比分析</h3>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <Button variant="outline" size="sm" onClick={() => setShowComparisonDialog(true)}>
                      <Filter className="h-4 w-4 mr-1" />
                      筛选成员
                    </Button>
                    <Select value={comparisonMetric} onValueChange={(value) => setComparisonMetric(value as any)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择对比指标" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">绩效评分</SelectItem>
                        <SelectItem value="skills">技能水平</SelectItem>
                        <SelectItem value="productivity">生产力</SelectItem>
                        <SelectItem value="tasks">任务完成情况</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedMembers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>请选择要对比的团队成员</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-4"
                        onClick={() => setShowComparisonDialog(true)}
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        筛选成员
                      </Button>
                    </div>
                  ) : (
                    <Card className="card">
                      <CardHeader className="pb-2 card-header">
                        <CardTitle className="text-base font-medium card-title">
                          {selectedMembers.map((memberId) => getMemberName(memberId)).join(" vs ")} -{" "}
                          {comparisonMetric === "performance"
                            ? "绩效评分"
                            : comparisonMetric === "skills"
                              ? "技能水平"
                              : comparisonMetric === "productivity"
                                ? "生产力"
                                : "任务完成情况"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comparisonMetric === "performance" && (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={teamMembers.filter((m) => selectedMembers.includes(m.id))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="performance" fill={currentTemplate.colors.primary} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {comparisonMetric === "skills" && (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={teamMembers.filter((m) => selectedMembers.includes(m.id))}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                  name="张明"
                                  dataKey="skills.技术"
                                  stroke={currentTemplate.colors.primary}
                                  fill={currentTemplate.colors.primary}
                                  fillOpacity={0.6}
                                />
                                <Legend />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {comparisonMetric === "productivity" && (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={teamMembers.filter((m) => selectedMembers.includes(m.id))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="productivity" fill={currentTemplate.colors.primary} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {comparisonMetric === "tasks" && (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={teamMembers.filter((m) => selectedMembers.includes(m.id))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="tasks.completed" name="已完成" fill={currentTemplate.colors.primary} />
                                <Bar dataKey="tasks.inProgress" name="进行中" fill={currentTemplate.colors.secondary} />
                                <Bar dataKey="tasks.overdue" name="已逾期" fill={currentTemplate.colors.danger} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* 部门分析标签页 */}
                <TabsContent value="departments">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">部门分析报告</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {departments.map((department) => (
                      <Card key={department.id} className="card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 card-header">
                          <CardTitle className="text-base font-medium card-title">{department.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">团队规模</span>
                              <span className="text-sm">{department.headCount} 人</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">部门绩效</span>
                              <span className="text-sm">{department.performance}%</span>
                            </div>
                            <Progress
                              value={department.performance}
                              className="h-2"
                              style={
                                {
                                  backgroundColor: currentTemplate.colors.border,
                                  "--progress-color": currentTemplate.colors.primary,
                                } as React.CSSProperties
                              }
                            />
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">项目数量: </span>
                              {department.projects} 个
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500">预算分配: </span>
                              {formatCurrency(department.budget.allocated)}
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">预算支出: </span>
                              {formatCurrency(department.budget.spent)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>

      {/* 团队成员对比分析对话框 */}
      <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>选择要对比的团队成员</DialogTitle>
            <DialogDescription>选择至少两名团队成员进行对比分析。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`member-${member.id}`}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberSelectionChange(member.id)}
                />
                <Label htmlFor={`member-${member.id}`}>{member.name}</Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setShowComparisonDialog(false)} disabled={selectedMembers.length < 2}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加/编辑团队目标对话框 */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentGoal ? "编辑团队目标" : "添加团队目标"}</DialogTitle>
            <DialogDescription>{currentGoal ? "修改团队目标信息" : "创建新的团队目标"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                目标名称
              </Label>
              <Input id="name" value={currentGoal?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                目标描述
              </Label>
              <Input id="description" value={currentGoal?.description || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                目标类别
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择类别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">绩效</SelectItem>
                  <SelectItem value="revenue">收入</SelectItem>
                  <SelectItem value="innovation">创新</SelectItem>
                  <SelectItem value="quality">质量</SelectItem>
                  <SelectItem value="growth">增长</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetValue" className="text-right">
                目标值
              </Label>
              <Input id="targetValue" value={currentGoal?.targetValue || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentValue" className="text-right">
                当前值
              </Label>
              <Input id="currentValue" value={currentGoal?.currentValue || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                单位
              </Label>
              <Input id="unit" value={currentGoal?.unit || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                开始日期
              </Label>
              <Input type="date" id="startDate" value={currentGoal?.startDate || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                结束日期
              </Label>
              <Input type="date" id="endDate" value={currentGoal?.endDate || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                目标状态
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="at_risk">风险中</SelectItem>
                  <SelectItem value="overdue">已逾期</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                优先级
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setShowGoalDialog(false)}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
