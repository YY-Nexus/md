import { type NextRequest, NextResponse } from "next/server"
import { permissionService } from "@/lib/permission-service"
import type { PermissionAction, ResourceType } from "@/types/permission"

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const resource = searchParams.get("resource") as ResourceType
    const action = searchParams.get("action") as PermissionAction

    // 验证参数
    if (!resource || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 如果没有用户ID，返回未授权错误
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 检查权限
    const result = await permissionService.hasPermission(userId, resource, action)

    // 返回结果
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking permission:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
