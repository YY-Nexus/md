"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { NotificationPreferences } from "@/types/notification"

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchPreferences() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/notifications/preferences")
        if (!response.ok) {
          throw new Error("Failed to fetch notification preferences")
        }
        const data = await response.json()
        setPreferences(data.preferences)
      } catch (error) {
        console.error("Error fetching notification preferences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPreferences()
  }, [])

  const handleSavePreferences = async () => {
    if (!preferences) return

    try {
      setIsSaving(true)
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      })

      if (!response.ok) {
        throw new Error("Failed to save notification preferences")
      }

      // 可以添加成功提示
    } catch (error) {
      console.error("Error saving notification preferences:", error)
      // 可以添加错误提示
    } finally {
      setIsSaving(false)
    }
  }

  const handleChannelChange = (channel: keyof NotificationPreferences["channels"], value: boolean) => {
    if (!preferences) return

    setPreferences({
      ...preferences,
      channels: {
        ...preferences.channels,
        [channel]: value,
      },
    })
  }

  const handleTypeChange = (type: keyof NotificationPreferences["types"], value: boolean) => {
    if (!preferences) return

    setPreferences({
      ...preferences,
      types: {
        ...preferences.types,
        [type]: value,
      },
    })
  }

  const handlePriorityChange = (priority: keyof NotificationPreferences["priorities"], value: boolean) => {
    if (!preferences) return

    setPreferences({
      ...preferences,
      priorities: {
        ...preferences.priorities,
        [priority]: value,
      },
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-2xl font-bold">通知设置</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex h-40 items-center justify-center">
              <p className="text-gray-500">加载中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-2xl font-bold">通知设置</h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex h-40 items-center justify-center">
              <p className="text-red-500">加载通知设置失败</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">通知设置</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>通知渠道</CardTitle>
          <CardDescription>选择您希望接收通知的方式</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="inApp" className="flex-1">
                应用内通知
                <p className="text-sm text-gray-500">在应用内显示通知</p>
              </Label>
              <Switch
                id="inApp"
                checked={preferences.channels.inApp}
                onCheckedChange={(value) => handleChannelChange("inApp", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex-1">
                电子邮件通知
                <p className="text-sm text-gray-500">通过电子邮件接收通知</p>
              </Label>
              <Switch
                id="email"
                checked={preferences.channels.email}
                onCheckedChange={(value) => handleChannelChange("email", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="flex-1">
                推送通知
                <p className="text-sm text-gray-500">通过浏览器或移动设备接收推送通知</p>
              </Label>
              <Switch
                id="push"
                checked={preferences.channels.push}
                onCheckedChange={(value) => handleChannelChange("push", value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>通知类型</CardTitle>
          <CardDescription>选择您希望接收的通知类型</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="info" className="flex-1">
                信息通知
                <p className="text-sm text-gray-500">一般信息和系统公告</p>
              </Label>
              <Switch
                id="info"
                checked={preferences.types.info}
                onCheckedChange={(value) => handleTypeChange("info", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="success" className="flex-1">
                成功通知
                <p className="text-sm text-gray-500">操作成功的通知</p>
              </Label>
              <Switch
                id="success"
                checked={preferences.types.success}
                onCheckedChange={(value) => handleTypeChange("success", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="warning" className="flex-1">
                警告通知
                <p className="text-sm text-gray-500">需要注意的警告信息</p>
              </Label>
              <Switch
                id="warning"
                checked={preferences.types.warning}
                onCheckedChange={(value) => handleTypeChange("warning", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="error" className="flex-1">
                错误通知
                <p className="text-sm text-gray-500">错误和失败信息</p>
              </Label>
              <Switch
                id="error"
                checked={preferences.types.error}
                onCheckedChange={(value) => handleTypeChange("error", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="permission" className="flex-1">
                权限变更通知
                <p className="text-sm text-gray-500">权限变更和访问控制相关通知</p>
              </Label>
              <Switch
                id="permission"
                checked={preferences.types.permission}
                onCheckedChange={(value) => handleTypeChange("permission", value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>通知优先级</CardTitle>
          <CardDescription>选择您希望接收的通知优先级</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="low" className="flex-1">
                低优先级
                <p className="text-sm text-gray-500">不太重要的通知</p>
              </Label>
              <Switch
                id="low"
                checked={preferences.priorities.low}
                onCheckedChange={(value) => handlePriorityChange("low", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="medium" className="flex-1">
                中优先级
                <p className="text-sm text-gray-500">一般重要程度的通知</p>
              </Label>
              <Switch
                id="medium"
                checked={preferences.priorities.medium}
                onCheckedChange={(value) => handlePriorityChange("medium", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="high" className="flex-1">
                高优先级
                <p className="text-sm text-gray-500">重要通知</p>
              </Label>
              <Switch
                id="high"
                checked={preferences.priorities.high}
                onCheckedChange={(value) => handlePriorityChange("high", value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="urgent" className="flex-1">
                紧急优先级
                <p className="text-sm text-gray-500">需要立即关注的紧急通知</p>
              </Label>
              <Switch
                id="urgent"
                checked={preferences.priorities.urgent}
                onCheckedChange={(value) => handlePriorityChange("urgent", value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePreferences} disabled={isSaving}>
          {isSaving ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </div>
  )
}
