import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notification-service"
import type { NotificationStatus } from "@/types/notification"

export async function GET(request: NextRequest) {
  try {
    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 如果没有用户ID，返回未授权错误
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") as NotificationStatus | undefined
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined

    // 获取通知
    const notifications = notificationService.getNotifications(userId, { status, limit })
    const unreadCount = notificationService.getUnreadCount(userId)

    // 返回结果
    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error("Error fetching notifications:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
