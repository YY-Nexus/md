// 权限类型定义
export type PermissionAction = "create" | "read" | "update" | "delete" | "manage" | "approve"

export type ResourceType =
  | "user"
  | "role"
  | "permission"
  | "report"
  | "dashboard"
  | "worksheet"
  | "record"
  | "audit_log"
  | "setting"

// 权限定义，例如: "user:read", "report:create"
export type Permission = `${ResourceType}:${PermissionAction}`

// 角色定义
export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem?: boolean
}

// 权限组定义
export interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: Permission[]
  parentGroups?: string[] // 继承的权限组ID
}

// 用户权限定义
export interface UserPermissions {
  userId: string
  roles: string[] // 角色ID列表
  groups: string[] // 权限组ID列表
  directPermissions: Permission[] // 直接分配的权限
  effectivePermissions?: Permission[] // 计算后的有效权限（包括继承的）
  lastUpdated: number // 上次更新时间戳，用于缓存验证
}

// 权限检查结果
export interface PermissionCheckResult {
  granted: boolean
  reason?: string
}

// 权限缓存项
export interface PermissionCacheItem {
  permissions: Permission[]
  timestamp: number
}
