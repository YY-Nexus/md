import { type NextRequest, NextResponse } from "next/server"
import { permissionService } from "@/lib/permission-service"
import { permissionUsageService } from "@/lib/permission-usage-service"
import type { PermissionAction, ResourceType } from "@/types/permission"

// 权限中间件配置
export interface PermissionMiddlewareConfig {
  resource: ResourceType
  action: PermissionAction
  // 可选的自定义错误处理
  onDenied?: (req: NextRequest) => NextResponse | Promise<NextResponse>
}

// 创建权限中间件
export function createPermissionMiddleware(config: PermissionMiddlewareConfig) {
  return async function permissionMiddleware(
    req: NextRequest,
    { params }: { params: Record<string, string | string[]> },
  ) {
    try {
      // 从请求中获取用户ID（根据您的认证系统调整）
      // 这里假设用户ID在请求头中
      const userId = req.headers.get("x-user-id")

      // 如果没有用户ID，重定向到登录页面
      if (!userId) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }

      // 检查权限
      const { resource, action } = config
      const permission = `${resource}:${action}`
      const result = await permissionService.hasPermission(userId, resource, action)

      // 如果没有权限
      if (!result.granted) {
        // 记录权限拒绝
        console.warn(`Permission denied: ${userId} attempted to ${action} ${resource}`)

        // 使用自定义错误处理或默认处理
        if (config.onDenied) {
          return config.onDenied(req)
        }

        // 默认返回403错误
        return new NextResponse(
          JSON.stringify({
            error: "Permission denied",
            message: result.reason || "You do not have permission to access this resource",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        )
      }

      // 记录权限使用
      await permissionUsageService.logPermissionUsage(userId, permission)

      // 权限验证通过，继续处理请求
      return NextResponse.next()
    } catch (error) {
      console.error("Error in permission middleware:", error)

      // 返回500错误
      return new NextResponse(
        JSON.stringify({
          error: "Internal server error",
          message: "An error occurred while checking permissions",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }
  }
}
