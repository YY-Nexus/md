"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Clock, Flag, Plus, Target, TrendingUp, Users } from "lucide-react"
import { format } from "date-fns"
import { useTemplate } from "../contexts/template-context"

// 团队目标类型
interface TeamGoal {
  id: string
  name: string
  description: string
  category: "performance" | "development" | "innovation" | "collaboration" | "other"
  targetValue: number
  currentValue: number
  unit: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "overdue"
  assignees: string[] // 团队成员ID
  milestones: {
    id: string
    name: string
    dueDate: string
    completed: boolean
  }[]
}

// 团队成员类型
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  department: string
}

interface TeamGoalTrackerProps {
  teamId: string
  teamMembers: TeamMember[]
}

export function TeamGoalTracker({ teamId, teamMembers }: TeamGoalTrackerProps) {
  const [goals, setGoals] = useState<TeamGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<TeamGoal | null>(null)
  const { currentTemplate } = useTemplate()

  // 新目标表单状态
  const [newGoal, setNewGoal] = useState<Omit<TeamGoal, "id" | "status" | "currentValue" | "milestones">>({
    name: "",
    description: "",
    category: "performance",
    targetValue: 0,
    unit: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 30天后
    assignees: [],
  })

  // 加载团队目标数据
  const loadGoals = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 在实际应用中，这里应该从API获取团队目标数据
      // 这里使用模拟数据
      const mockGoals: TeamGoal[] = [
        {
          id: "1",
          name: "提高团队生产力",
          description: "在本季度内将团队整体生产力提高15%",
          category: "performance",
          targetValue: 15,
          currentValue: 8,
          unit: "%",
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          assignees: ["1", "2", "4"],
          milestones: [
            {
              id: "1-1",
              name: "完成生产力基准测量",
              dueDate: "2023-04-15",
              completed: true,
            },
            {
              id: "1-2",
              name: "实施新工作流程",
              dueDate: "2023-05-01",
              completed: true,
            },
            {
              id: "1-3",
              name: "中期评估",
              dueDate: "2023-05-15",
              completed: false,
            },
            {
              id: "1-4",
              name: "最终评估",
              dueDate: "2023-06-25",
              completed: false,
            },
          ],
        },
        {
          id: "2",
          name: "减少项目交付延迟",
          description: "将项目交付延迟率从15%降低到5%以下",
          category: "performance",
          targetValue: 5,
          currentValue: 10,
          unit: "%",
          startDate: "2023-04-01",
          endDate: "2023-06-30",
          status: "active",
          assignees: ["1", "3", "5"],
          milestones: [
            {
              id: "2-1",
              name: "分析当前延迟原因",
              dueDate: "2023-04-10",
              completed: true,
            },
            {
              id: "2-2",
              name: "制定改进计划",
              dueDate: "2023-04-20",
              completed: true,
            },
            {
              id: "2-3",
              name: "实施改进措施",
              dueDate: "2023-05-05",
              completed: true,
            },
            {
              id: "2-4",
              name: "评估改进效果",
              dueDate: "2023-06-15",
              completed: false,
            },
          ],
        },
        {
          id: "3",
          name: "提高团队技能多样性",
          description: "确保每个团队成员至少掌握两个新技能",
          category: "development",
          targetValue: 2,
          currentValue: 1,
          unit: "技能/人",
          startDate: "2023-04-01",
          endDate: "2023-09-30",
          status: "active",
          assignees: ["2", "3", "4", "5"],
          milestones: [
            {
              id: "3-1",
              name: "完成技能评估",
              dueDate: "2023-04-15",
              completed: true,
            },
            {
              id: "3-2",
              name: "制定个人发展计划",
              dueDate: "2023-04-30",
              completed: true,
            },
            {
              id: "3-3",
              name: "完成第一阶段培训",
              dueDate: "2023-06-30",
              completed: false,
            },
            {
              id: "3-4",
              name: "完成第二阶段培训",
              dueDate: "2023-08-31",
              completed: false,
            },
          ],
        },
        {
          id: "4",
          name: "开发创新解决方案",
          description: "开发至少3个创新解决方案以解决客户痛点",
          category: "innovation",
          targetValue: 3,
          currentValue: 1,
          unit: "解决方案",
          startDate: "2023-05-01",
          endDate: "2023-10-31",
          status: "active",
          assignees: ["1", "2", "3"],
          milestones: [
            {
              id: "4-1",
              name: "完成市场研究",
              dueDate: "2023-05-31",
              completed: true,
            },
            {
              id: "4-2",
              name: "提出创新概念",
              dueDate: "2023-06-30",
              completed: false,
            },
            {
              id: "4-3",
              name: "开发原型",
              dueDate: "2023-08-31",
              completed: false,
            },
            {
              id: "4-4",
              name: "测试与验证",
              dueDate: "2023-10-15",
              completed: false,
            },
          ],
        },
        {
          id: "5",
          name: "提高团队协作效率",
          description: "通过改进沟通和协作流程，减少30%的会议时间",
          category: "collaboration",
          targetValue: 30,
          currentValue: 15,
          unit: "%",
          startDate: "2023-04-15",
          endDate: "2023-07-15",
          status: "active",
          assignees: ["1", "4", "5"],
          milestones: [
            {
              id: "5-1",
              name: "评估当前会议效率",
              dueDate: "2023-04-30",
              completed: true,
            },
            {
              id: "5-2",
              name: "实施新会议准则",
              dueDate: "2023-05-15",
              completed: true,
            },
            {
              id: "5-3",
              name: "引入协作工具",
              dueDate: "2023-05-31",
              completed: false,
            },
            {
              id: "5-4",
              name: "评估改进效果",
              dueDate: "2023-07-05",
              completed: false,
            },
          ],
        },
      ]

      setGoals(mockGoals)
    } catch (err) {
      console.error("Error loading team goals:", err)
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
    const newGoalWithId: TeamGoal = {
      ...newGoal,
      id,
      currentValue: 0,
      status: "active",
      milestones: [],
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
      category: "performance",
      targetValue: 0,
      unit: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      assignees: [],
    })
  }

  // 编辑目标
  const handleEditGoal = (goal: TeamGoal) => {
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

  // 切换里程碑完成状态
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map((milestone) => {
          if (milestone.id === milestoneId) {
            return { ...milestone, completed: !milestone.completed }
          }
          return milestone
        })
        return { ...goal, milestones: updatedMilestones }
      }
      return goal
    })

    setGoals(updatedGoals)
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
      case "performance":
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case "development":
        return <Users className="h-5 w-5 text-green-600" />
      case "innovation":
        return <Target className="h-5 w-5 text-purple-600" />
      case "collaboration":
        return <Users className="h-5 w-5 text-amber-600" />
      default:
        return <Flag className="h-5 w-5 text-gray-600" />
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

  // 获取目标类别名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case "performance":
        return "绩效目标"
      case "development":
        return "发展目标"
      case "innovation":
        return "创新目标"
      case "collaboration":
        return "协作目标"
      default:
        return "其他目标"
    }
  }

  // 获取目标状态名称
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

  // 过滤目标
  const filteredGoals = goals.filter((goal) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return goal.status === "active"
    if (activeTab === "completed") return goal.status === "completed"
    if (activeTab === "overdue") return goal.status === "overdue"
    return goal.category === activeTab
  })

  // 如果 teamId 是无效的，显示配置提示
  if (!teamId || teamId === "invalid_team_id") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>团队目标跟踪</CardTitle>
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>团队目标跟踪</CardTitle>
          <CardDescription>设置、跟踪和管理团队目标</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              添加目标
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>添加新团队目标</DialogTitle>
              <DialogDescription>创建一个新的团队目标来跟踪团队进度</DialogDescription>
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
                    <SelectItem value="performance">绩效目标</SelectItem>
                    <SelectItem value="development">发展目标</SelectItem>
                    <SelectItem value="innovation">创新目标</SelectItem>
                    <SelectItem value="collaboration">协作目标</SelectItem>
                    <SelectItem value="other">其他目标</SelectItem>
                  </SelectContent>
                </Select>
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
                  className="col-span-2"
                />
                <Input
                  id="unit"
                  placeholder="单位"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  className="col-span-1"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignees" className="text-right">
                  分配成员
                </Label>
                <Select value={newGoal.assignees.length > 0 ? "selected" : ""} onValueChange={() => {}}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择团队成员" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center p-2">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          checked={newGoal.assignees.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewGoal({ ...newGoal, assignees: [...newGoal.assignees, member.id] })
                            } else {
                              setNewGoal({
                                ...newGoal,
                                assignees: newGoal.assignees.filter((id) => id !== member.id),
                              })
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`member-${member.id}`} className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          {member.name} ({member.role})
                        </label>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>编辑团队目标</DialogTitle>
              <DialogDescription>更新团队目标信息</DialogDescription>
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
                      <SelectItem value="performance">绩效目标</SelectItem>
                      <SelectItem value="development">发展目标</SelectItem>
                      <SelectItem value="innovation">创新目标</SelectItem>
                      <SelectItem value="collaboration">协作目标</SelectItem>
                      <SelectItem value="other">其他目标</SelectItem>
                    </SelectContent>
                  </Select>
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
                    className="col-span-2"
                  />
                  <Input
                    id="edit-unit"
                    placeholder="单位"
                    value={selectedGoal.unit}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, unit: e.target.value })}
                    className="col-span-1"
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-assignees" className="text-right">
                    分配成员
                  </Label>
                  <Select value={selectedGoal.assignees.length > 0 ? "selected" : ""} onValueChange={() => {}}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择团队成员" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center p-2">
                          <input
                            type="checkbox"
                            id={`edit-member-${member.id}`}
                            checked={selectedGoal.assignees.includes(member.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGoal({
                                  ...selectedGoal,
                                  assignees: [...selectedGoal.assignees, member.id],
                                })
                              } else {
                                setSelectedGoal({
                                  ...selectedGoal,
                                  assignees: selectedGoal.assignees.filter((id) => id !== member.id),
                                })
                              }
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`edit-member-${member.id}`} className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            {member.name} ({member.role})
                          </label>
                        </div>
                      ))}
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
        {isLoading && <p>加载中...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!isLoading && !error && (
          <div>
            {/* 目标状态筛选标签 */}
            <div className="mb-4 flex items-center space-x-2">
              <Button
                variant={activeTab === "all" ? "default" : "outline"}
                onClick={() => setActiveTab("all")}
                size="sm"
              >
                全部
              </Button>
              <Button
                variant={activeTab === "active" ? "default" : "outline"}
                onClick={() => setActiveTab("active")}
                size="sm"
              >
                进行中
              </Button>
              <Button
                variant={activeTab === "completed" ? "default" : "outline"}
                onClick={() => setActiveTab("completed")}
                size="sm"
              >
                已完成
              </Button>
              <Button
                variant={activeTab === "overdue" ? "default" : "outline"}
                onClick={() => setActiveTab("overdue")}
                size="sm"
              >
                已逾期
              </Button>
              <Button
                variant={activeTab === "performance" ? "default" : "outline"}
                onClick={() => setActiveTab("performance")}
                size="sm"
              >
                绩效目标
              </Button>
              <Button
                variant={activeTab === "development" ? "default" : "outline"}
                onClick={() => setActiveTab("development")}
                size="sm"
              >
                发展目标
              </Button>
              <Button
                variant={activeTab === "innovation" ? "default" : "outline"}
                onClick={() => setActiveTab("innovation")}
                size="sm"
              >
                创新目标
              </Button>
              <Button
                variant={activeTab === "collaboration" ? "default" : "outline"}
                onClick={() => setActiveTab("collaboration")}
                size="sm"
              >
                协作目标
              </Button>
            </div>

            {/* 目标列表 */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      {getGoalIcon(goal.category)}
                      <span>{goal.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(goal.status)}
                      <span className="text-xs text-gray-500">{getStatusName(goal.status)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>进度</span>
                        <span>
                          {goal.currentValue} / {goal.targetValue} {goal.unit} (
                          {calculateProgress(goal.currentValue, goal.targetValue).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full absolute top-0 left-0"
                          style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">里程碑</h4>
                      <ul>
                        {goal.milestones.map((milestone) => (
                          <li key={milestone.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`milestone-${milestone.id}`}
                              checked={milestone.completed}
                              onChange={() => handleToggleMilestone(goal.id, milestone.id)}
                            />
                            <label htmlFor={`milestone-${milestone.id}`} className="text-xs">
                              {milestone.name} ({milestone.dueDate})
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="xs" onClick={() => handleEditGoal(goal)}>
                        编辑
                      </Button>
                      <div>
                        <Input
                          type="number"
                          placeholder="更新进度"
                          className="w-24 text-xs"
                          onChange={(e) => handleUpdateProgress(goal.id, Number(e.target.value))}
                        />
                        <Button variant="destructive" size="xs" onClick={() => handleDeleteGoal(goal.id)}>
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
