import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notification-service"

export async function GET(request: NextRequest) {
  try {
    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 如果没有用户ID，返回未授权错误
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 获取用户通知偏好设置
    const preferences = notificationService.getUserPreferences(userId)

    // 返回结果
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error fetching notification preferences:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 如果没有用户ID，返回未授权错误
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 解析请求体
    const body = await request.json()
    const { preferences } = body

    // 验证参数
    if (!preferences) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // 更新用户通知偏好设置
    notificationService.updateUserPreferences(userId, preferences)

    // 返回成功结果
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating notification preferences:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
