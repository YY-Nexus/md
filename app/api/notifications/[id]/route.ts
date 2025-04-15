import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notification-service"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id

    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 如果没有用户ID，返回未授权错误
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 删除通知
    notificationService.deleteNotification(userId, notificationId)

    // 返回成功结果
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting notification:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
