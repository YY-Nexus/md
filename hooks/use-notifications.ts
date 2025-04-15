"use client"

import { useState, useEffect, useCallback } from "react"
import type { Notification, NotificationStatus } from "@/types/notification"

interface UseNotificationsOptions {
  status?: NotificationStatus
  limit?: number
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 构建查询参数
      const params = new URLSearchParams()
      if (options.status) {
        params.append("status", options.status)
      }
      if (options.limit) {
        params.append("limit", options.limit.toString())
      }

      // 获取通知
      const response = await fetch(`/api/notifications?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [options.status, options.limit])

  // 标记通知为已读
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
          method: "POST",
        })

        if (!response.ok) {
          throw new Error("Failed to mark notification as read")
        }

        // 更新本地状态
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: "read" as NotificationStatus }
              : notification,
          ),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (err) {
        console.error("Error marking notification as read:", err)
      }
    },
    [setNotifications, setUnreadCount],
  )

  // 标记所有通知为已读
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read")
      }

      // 更新本地状态
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, status: "read" as NotificationStatus })),
      )
      setUnreadCount(0)
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }, [setNotifications, setUnreadCount])

  // 删除通知
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete notification")
        }

        // 更新本地状态
        setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
        // 如果删除的是未读通知，更新未读计数
        const wasUnread = notifications.find((n) => n.id === notificationId)?.status === "unread"
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
      } catch (err) {
        console.error("Error deleting notification:", err)
      }
    },
    [notifications, setNotifications, setUnreadCount],
  )

  // 初始加载和轮询更新
  useEffect(() => {
    fetchNotifications()

    // 设置轮询间隔（每30秒检查一次新通知）
    const intervalId = setInterval(fetchNotifications, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
