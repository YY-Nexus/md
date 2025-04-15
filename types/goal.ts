// 目标类型定义
export interface Goal {
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
export interface HistoryEntry {
  date: string
  value: number
}

// 带历史记录的目标
export interface GoalWithHistory extends Goal {
  history: HistoryEntry[]
}

// 报告类型
export type ReportPeriod = "weekly" | "monthly" | "quarterly" | "yearly"

// 报告数据类型
export interface ReportData {
  overallCompletion: number
  categoryCompletion: Record<string, number>
  statusDistribution: Record<string, number>
  completionTrend: any[]
  topPerformingGoals: GoalWithHistory[]
  atRiskGoals: GoalWithHistory[]
  radarData: any[]
  heatmapData: any[]
  performanceMatrix: any[]
  goalDistribution: any[]
}
