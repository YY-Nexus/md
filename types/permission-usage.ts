// 权限使用统计类型
export interface PermissionUsageStats {
  permission: string
  count: number
  lastUsed: Date | null
  users: string[] // 使用该权限的用户ID列表
}

// 权限使用趋势类型
export interface PermissionUsageTrend {
  date: Date
  permission: string
  count: number
}

// 用户权限使用统计类型
export interface UserPermissionUsage {
  userId: string
  permission: string
  count: number
  lastUsed: Date | null
}
