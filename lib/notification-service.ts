import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationTarget,
  PermissionChangeNotification,
  NotificationPreferences,
} from "@/types/notification"
import { v4 as uuidv4 } from "uuid"

export class NotificationService {
  private notifications: Map<string, Notification[]> = new Map()
  private preferences: Map<string, NotificationPreferences> = new Map()
  private subscribers: Map<string, ((notifications: Notification[]) => void)[]> = new Map()

  constructor() {
    // 初始化
  }

  // 创建通知
  async createNotification(
    targetType: NotificationTarget,
    targetId: string,
    {
      type,
      title,
      message,
      priority = "medium",
      link,
      metadata,
    }: {
      type: NotificationType
      title: string
      message: string
      priority?: NotificationPriority
      link?: string
      metadata?: Record<string, any>
    },
  ): Promise<Notification> {
    const notification: Notification = {
      id: uuidv4(),
      type,
      title,
      message,
      createdAt: new Date(),
      priority,
      status: "unread",
      targetType,
      targetId,
      link,
      metadata,
    }

    // 存储通知
    this.storeNotification(notification)

    // 如果是权限变更通知，记录到审计日志
    if (type === "permission") {
      await this.logPermissionChange(notification as PermissionChangeNotification)
    }

    // 通知订阅者
    this.notifySubscribers(targetId)

    // 发送通知（根据用户偏好）
    await this.sendNotification(notification)

    return notification
  }

  // 创建权限变更通知
  async createPermissionChangeNotification(
    userId: string,
    {
      changeType,
      permissions,
      roles,
      groups,
      changedBy,
      reason,
      title,
      message,
    }: {
      changeType: "added" | "removed" | "modified"
      permissions?: string[]
      roles?: string[]
      groups?: string[]
      changedBy: string
      reason?: string
      title?: string
      message?: string
    },
  ): Promise<PermissionChangeNotification> {
    // 根据变更类型生成默认标题
    const defaultTitle = `权限${changeType === "added" ? "已添加" : changeType === "removed" ? "已移除" : "已修改"}`

    // 生成默认消息
    let defaultMessage = `您的权限已${changeType === "added" ? "增加" : changeType === "removed" ? "减少" : "变更"}`
    if (permissions && permissions.length > 0) {
      defaultMessage += `，涉及权限: ${permissions.join(", ")}`
    }
    if (roles && roles.length > 0) {
      defaultMessage += `，涉及角色: ${roles.join(", ")}`
    }
    if (groups && groups.length > 0) {
      defaultMessage += `，涉及权限组: ${groups.join(", ")}`
    }

    const notification = (await this.createNotification("user", userId, {
      type: "permission",
      title: title || defaultTitle,
      message: message || defaultMessage,
      priority: "high", // 权限变更通常是高优先级
      link: "/settings/permissions",
      metadata: {
        changeType,
        permissions,
        roles,
        groups,
        changedBy,
        reason,
      },
    })) as PermissionChangeNotification

    return notification
  }

  // 存储通知
  private storeNotification(notification: Notification): void {
    const { targetId } = notification
    const userNotifications = this.notifications.get(targetId) || []
    userNotifications.push(notification)
    this.notifications.set(targetId, userNotifications)

    // 这里可以添加持久化存储逻辑，例如保存到数据库
    console.log(`Notification stored for ${targetId}:`, notification)
  }

  // 记录权限变更到审计日志
  private async logPermissionChange(notification: PermissionChangeNotification): Promise<void> {
    // 这里应该调用审计日志服务记录权限变更
    // 示例实现，实际项目中需要替换为真实审计日志服务
    console.log("Permission change logged to audit:", notification)
  }

  // 发送通知（根据用户偏好）
  private async sendNotification(notification: Notification): Promise<void> {
    const { targetId, type, priority } = notification
    const preferences = this.getUserPreferences(targetId)

    // 检查用户是否启用了此类型和优先级的通知
    if (!preferences.types[type] || !preferences.priorities[priority]) {
      console.log(`Notification skipped due to user preferences: ${targetId}`)
      return
    }

    // 发送应用内通知（已通过存储和订阅实现）

    // 发送电子邮件通知
    if (preferences.channels.email) {
      await this.sendEmailNotification(notification)
    }

    // 发送推送通知
    if (preferences.channels.push) {
      await this.sendPushNotification(notification)
    }
  }

  // 发送电子邮件通知
  private async sendEmailNotification(notification: Notification): Promise<void> {
    // 这里应该实现发送电子邮件的逻辑
    // 示例实现，实际项目中需要替换为真实邮件服务
    console.log(`Email notification would be sent to ${notification.targetId}:`, notification)
  }

  // 发送推送通知
  private async sendPushNotification(notification: Notification): Promise<void> {
    // 这里应该实现发送推送通知的逻辑
    // 示例实现，实际项目中需要替换为真实推送服务
    console.log(`Push notification would be sent to ${notification.targetId}:`, notification)
  }

  // 获取用户通知
  getNotifications(userId: string, options?: { status?: string; limit?: number }): Notification[] {
    const userNotifications = this.notifications.get(userId) || []

    // 过滤和排序
    let filteredNotifications = userNotifications

    // 按状态过滤
    if (options?.status) {
      filteredNotifications = filteredNotifications.filter((n) => n.status === options.status)
    }

    // 按时间排序（最新的在前）
    filteredNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // 限制数量
    if (options?.limit) {
      filteredNotifications = filteredNotifications.slice(0, options.limit)
    }

    return filteredNotifications
  }

  // 获取未读通知数量
  getUnreadCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || []
    return userNotifications.filter((n) => n.status === "unread").length
  }

  // 标记通知为已读
  markAsRead(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || []
    const notification = userNotifications.find((n) => n.id === notificationId)

    if (notification) {
      notification.status = "read"
      this.notifySubscribers(userId)
    }
  }

  // 标记所有通知为已读
  markAllAsRead(userId: string): void {
    const userNotifications = this.notifications.get(userId) || []
    userNotifications.forEach((notification) => {
      notification.status = "read"
    })
    this.notifySubscribers(userId)
  }

  // 归档通知
  archiveNotification(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || []
    const notification = userNotifications.find((n) => n.id === notificationId)

    if (notification) {
      notification.status = "archived"
      this.notifySubscribers(userId)
    }
  }

  // 删除通知
  deleteNotification(userId: string, notificationId: string): void {
    const userNotifications = this.notifications.get(userId) || []
    const index = userNotifications.findIndex((n) => n.id === notificationId)

    if (index !== -1) {
      userNotifications.splice(index, 1)
      this.notifications.set(userId, userNotifications)
      this.notifySubscribers(userId)
    }
  }

  // 获取用户通知偏好设置
  getUserPreferences(userId: string): NotificationPreferences {
    // 如果用户没有设置偏好，返回默认设置
    if (!this.preferences.has(userId)) {
      const defaultPreferences: NotificationPreferences = {
        userId,
        channels: {
          inApp: true,
          email: true,
          push: false,
        },
        types: {
          info: true,
          success: true,
          warning: true,
          error: true,
          permission: true,
        },
        priorities: {
          low: true,
          medium: true,
          high: true,
          urgent: true,
        },
      }
      this.preferences.set(userId, defaultPreferences)
      return defaultPreferences
    }

    return this.preferences.get(userId)!
  }

  // 更新用户通知偏好设置
  updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const currentPreferences = this.getUserPreferences(userId)
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
      channels: {
        ...currentPreferences.channels,
        ...(preferences.channels || {}),
      },
      types: {
        ...currentPreferences.types,
        ...(preferences.types || {}),
      },
      priorities: {
        ...currentPreferences.priorities,
        ...(preferences.priorities || {}),
      },
    }
    this.preferences.set(userId, updatedPreferences)
  }

  // 订阅通知更新
  subscribe(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const userSubscribers = this.subscribers.get(userId) || []
    userSubscribers.push(callback)
    this.subscribers.set(userId, userSubscribers)

    // 返回取消订阅函数
    return () => {
      const subscribers = this.subscribers.get(userId) || []
      const index = subscribers.indexOf(callback)
      if (index !== -1) {
        subscribers.splice(index, 1)
        this.subscribers.set(userId, subscribers)
      }
    }
  }

  // 通知订阅者
  private notifySubscribers(userId: string): void {
    const subscribers = this.subscribers.get(userId) || []
    const notifications = this.getNotifications(userId)

    subscribers.forEach((callback) => {
      try {
        callback(notifications)
      } catch (error) {
        console.error("Error in notification subscriber callback:", error)
      }
    })
  }
}

// 导出单例实例
export const notificationService = new NotificationService()
