// 通知类型
export type NotificationType = "info" | "success" | "warning" | "error" | "permission"

// 通知优先级
export type NotificationPriority = "low" | "medium" | "high" | "urgent"

// 通知状态
export type NotificationStatus = "unread" | "read" | "archived"

// 通知目标类型
export type NotificationTarget = "user" | "role" | "group" | "all"

// 通知基本接口
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: Date
  priority: NotificationPriority
  status: NotificationStatus
  targetType: NotificationTarget
  targetId: string
  link?: string
  metadata?: Record<string, any>
}

// 权限变更通知
export interface PermissionChangeNotification extends Notification {
  type: "permission"
  metadata: {
    changeType: "added" | "removed" | "modified"
    permissions?: string[]
    roles?: string[]
    groups?: string[]
    changedBy: string
    reason?: string
  }
}

// 通知偏好设置
export interface NotificationPreferences {
  userId: string
  channels: {
    inApp: boolean
    email: boolean
    push: boolean
  }
  types: {
    [key in NotificationType]: boolean
  }
  priorities: {
    [key in NotificationPriority]: boolean
  }
}
