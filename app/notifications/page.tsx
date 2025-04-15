"use client"

import { useState } from "react"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationItem } from "@/components/notification-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { NotificationStatus } from "@/types/notification"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationStatus>("unread")
  const { notifications, isLoading, markAllAsRead } = useNotifications({
    status: activeTab,
  })

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">通知中心</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          全部标为已读
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Tabs defaultValue="unread" onValueChange={(value) => setActiveTab(value as NotificationStatus)}>
              <TabsList>
                <TabsTrigger value="unread">未读通知</TabsTrigger>
                <TabsTrigger value="read">已读通知</TabsTrigger>
                <TabsTrigger value="archived">已归档</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-gray-500">
                暂无{activeTab === "unread" ? "未读" : activeTab === "read" ? "已读" : "归档"}通知
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
