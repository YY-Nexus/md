import { type NextRequest, NextResponse } from "next/server"
import { createPermissionMiddleware } from "./middleware/permission-middleware"

// 定义需要权限检查的路由映射
const permissionRoutes = [
  {
    path: "/settings/permissions",
    middleware: createPermissionMiddleware({
      resource: "permission",
      action: "manage",
    }),
  },
  {
    path: "/settings/audit-logs",
    middleware: createPermissionMiddleware({
      resource: "audit_log",
      action: "read",
    }),
  },
  // 可以添加更多需要权限检查的路由
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 检查是否有匹配的权限路由
  for (const route of permissionRoutes) {
    if (pathname.startsWith(route.path)) {
      return route.middleware(req, { params: {} })
    }
  }

  // 如果没有匹配的权限路由，继续处理请求
  return NextResponse.next()
}

// 配置匹配的路由
export const config = {
  matcher: ["/settings/:path*", "/api/permissions/:path*", "/api/mingdao/:path*"],
}
