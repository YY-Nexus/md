import { type NextRequest, NextResponse } from "next/server"
import { permissionUsageService } from "@/lib/permission-usage-service"

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
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined

    // 获取权限使用统计
    const stats = permissionUsageService.getPermissionUsageStats({ limit })

    // 返回结果
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching permission usage stats:", error)
    return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500 })
  }
}
