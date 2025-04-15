"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit,
  Flag,
  Loader2,
  Plus,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react"
import { format } from "date-fns"

// 目标类型定义
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

interface MingdaoGoalTrackerProps {
  customersWorksheetId: string
  opportunitiesWorksheetId: string
}

export function MingdaoGoalTracker({ customersWorksheetId, opportunitiesWorksheetId }: MingdaoGoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  // 新目标表单状态
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id" | "status" | "currentValue">>({
    name: "",
    description: "",
    metricType: "",
    targetValue: 0,
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 30天后
    category: "revenue",
  })

  // 加载目标数据
  const loadGoals = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 在实际应用中，这里应该从API获取目标数据
      // 这里使用模拟数据
      const mockGoals: Goal[] = [
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

  // 添加新目标
  const handleAddGoal = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const newGoalWithId: Goal = {
      ...newGoal,
      id,
      currentValue: 0,
      status: "active",
    }

    setGoals([...goals, newGoalWithId])
    setIsAddDialogOpen(false)
    resetNewGoalForm()
  }

  // 更新目标
  const handleUpdateGoal = () => {
    if (!selectedGoal) return

    const updatedGoals = goals.map((goal) => (goal.id === selectedGoal.id ? selectedGoal : goal))

    setGoals(updatedGoals)
    setIsEditDialogOpen(false)
    setSelectedGoal(null)
  }

  // 删除目标
  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id)
    setGoals(updatedGoals)
  }

  // 重置新目标表单
  const resetNewGoalForm = () => {
    setNewGoal({
      name: "",
      description: "",
      metricType: "",
      targetValue: 0,
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      category: "revenue",
    })
  }

  // 编辑目标
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setIsEditDialogOpen(true)
  }

  // 更新目标进度
  const handleUpdateProgress = (id: string, newValue: number) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const updatedGoal = { ...goal, currentValue: newValue }

        // 如果达到或超过目标，将状态更新为已完成
        if (newValue >= goal.targetValue) {
          updatedGoal.status = "completed"
        }

        return updatedGoal
      }
      return goal
    })

    setGoals(updatedGoals)
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

  // 获取目标状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-blue-600" />
    }
  }

  // 格式化目标值
  const formatGoalValue = (goal: Goal) => {
    if (goal.metricType === "销售收入") {
      return formatCurrency(goal.currentValue) + " / " + formatCurrency(goal.targetValue)
    } else if (goal.metricType === "满意度") {
      return formatPercent(goal.currentValue) + " / " + formatPercent(goal.targetValue)
    } else {
      return `${goal.currentValue} / ${goal.targetValue}`
    }
  }

  // 过滤目标
  const filteredGoals = goals.filter((goal) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return goal.status === "active"
    if (activeTab === "completed") return goal.status === "completed"
    if (activeTab === "overdue") return goal.status === "overdue"
    return goal.category === activeTab
  })

  // 如果 worksheetId 是占位符，显示配置提示
  if (
    customersWorksheetId === "your_customers_worksheet_id" ||
    opportunitiesWorksheetId === "your_opportunities_worksheet_id"
  ) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>业务目标跟踪</CardTitle>
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
          <CardTitle>业务目标跟踪</CardTitle>
          <CardDescription>设置、跟踪和管理您的业务目标</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              添加目标
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>添加新目标</DialogTitle>
              <DialogDescription>创建一个新的业务目标来跟踪您的进度</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  目标名称
                </Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  描述
                </Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  类别
                </Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value as any })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">收入</SelectItem>
                    <SelectItem value="customers">客户</SelectItem>
                    <SelectItem value="opportunities">商机</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="metricType" className="text-right">
                  指标类型
                </Label>
                <Input
                  id="metricType"
                  value={newGoal.metricType}
                  onChange={(e) => setNewGoal({ ...newGoal, metricType: e.target.value })}
                  className="col-span-3"
                  placeholder="例如：销售收入、客户数量"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetValue" className="text-right">
                  目标值
                </Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  开始日期
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newGoal.startDate}
                  onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  结束日期
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newGoal.endDate}
                  onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAddGoal}>创建目标</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 编辑目标对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>编辑目标</DialogTitle>
              <DialogDescription>更新业务目标信息</DialogDescription>
            </DialogHeader>
            {selectedGoal && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    目标名称
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedGoal.name}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    描述
                  </Label>
                  <Input
                    id="edit-description"
                    value={selectedGoal.description}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    类别
                  </Label>
                  <Select
                    value={selectedGoal.category}
                    onValueChange={(value) => setSelectedGoal({ ...selectedGoal, category: value as any })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">收入</SelectItem>
                      <SelectItem value="customers">客户</SelectItem>
                      <SelectItem value="opportunities">商机</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-metricType" className="text-right">
                    指标类型
                  </Label>
                  <Input
                    id="edit-metricType"
                    value={selectedGoal.metricType}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, metricType: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-targetValue" className="text-right">
                    目标值
                  </Label>
                  <Input
                    id="edit-targetValue"
                    type="number"
                    value={selectedGoal.targetValue}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, targetValue: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-currentValue" className="text-right">
                    当前值
                  </Label>
                  <Input
                    id="edit-currentValue"
                    type="number"
                    value={selectedGoal.currentValue}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, currentValue: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startDate" className="text-right">
                    开始日期
                  </Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={selectedGoal.startDate}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, startDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-endDate" className="text-right">
                    结束日期
                  </Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={selectedGoal.endDate}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, endDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    状态
                  </Label>
                  <Select
                    value={selectedGoal.status}
                    onValueChange={(value) => setSelectedGoal({ ...selectedGoal, status: value as any })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="overdue">已逾期</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleUpdateGoal}>更新目标</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="active">进行中</TabsTrigger>
              <TabsTrigger value="completed">已完成</TabsTrigger>
              <TabsTrigger value="revenue">收入</TabsTrigger>
              <TabsTrigger value="customers">客户</TabsTrigger>
              <TabsTrigger value="opportunities">商机</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="p-1.5 bg-gray-100 rounded-full mr-2">{getGoalIcon(goal.category)}</div>
                          <CardTitle className="text-base font-medium">{goal.name}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditGoal(goal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="mt-1">{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{goal.metricType}</span>
                            <span className="text-sm font-medium">{formatGoalValue(goal)}</span>
                          </div>
                          <Progress value={calculateProgress(goal.currentValue, goal.targetValue)} className="h-2" />
                        </div>

                        <div className="flex justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            {getStatusIcon(goal.status)}
                            <span className="ml-1">
                              {goal.status === "active" ? "进行中" : goal.status === "completed" ? "已完成" : "已逾期"}
                            </span>
                          </div>
                          <span>
                            {goal.startDate} 至 {goal.endDate}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full">
                        <Label htmlFor={`progress-${goal.id}`} className="text-xs text-gray-500">
                          更新进度
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id={`progress-${goal.id}`}
                            type="number"
                            value={goal.currentValue}
                            onChange={(e) => handleUpdateProgress(goal.id, Number(e.target.value))}
                            className="h-8"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateProgress(goal.id, goal.currentValue + 1)}
                            className="h-8"
                          >
                            +1
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredGoals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>没有找到符合条件的目标</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
