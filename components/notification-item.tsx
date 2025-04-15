"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/types/notification"
import { useNotifications } from "@/hooks/use-notifications"
import Link from "next/link"

interface NotificationItemProps {
  notification: Notification
  showActions?: boolean
}

export function NotificationItem({ notification, showActions = true }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { markAsRead, deleteNotification } = useNotifications()
  const isUnread = notification.status === "unread"

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    markAsRead(notification.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteNotification(notification.id)
  }

  // 根据通知类型选择图标和颜色
  const getTypeStyles = () => {
    switch (notification.type) {
      case "success":
        return { bgColor: "bg-green-100", textColor: "text-green-800" }
      case "warning":
        return { bgColor: "bg-yellow-100", textColor: "text-yellow-800" }
      case "error":
        return { bgColor: "bg-red-100", textColor: "text-red-800" }
      case "permission":
        return { bgColor: "bg-purple-100", textColor: "text-purple-800" }
      default:
        return { bgColor: "bg-blue-100", textColor: "text-blue-800" }
    }
  }

  const { bgColor, textColor } = getTypeStyles()

  // 格式化时间
  const formattedTime = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: zhCN,
  })

  const content = (
    <div
      className={`flex w-full cursor-pointer items-start gap-3 p-3 ${isUnread ? "bg-gray-50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 通知类型指示器 */}
      <div className={`mt-1 h-2 w-2 rounded-full ${bgColor}`} />

      {/* 通知内容 */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-medium ${isUnread ? "font-semibold" : ""}`}>{notification.title}</h4>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
      </div>

      {/* 操作按钮 */}
      {showActions && isHovered && (
        <div className="flex items-center gap-1">
          {isUnread && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMarkAsRead} aria-label="标记为已读">
              <span className="sr-only">标记为已读</span>
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDelete} aria-label="删除通知">
            <span className="sr-only">删除通知</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )

  // 如果有链接，使用Link组件包装
  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>
  }

  return content
}
