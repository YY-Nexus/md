import { type NextRequest, NextResponse } from "next/server"
import { dataAccessControlService } from "@/lib/data-access-control-service"

export async function POST(request: NextRequest) {
  try {
    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 如果没有用户ID，返回未授权错误
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 解析请求体
    const body = await request.json()
    const { resource, data, context = {} } = body

    // 验证参数
    if (!resource || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // 处理数据访问控制
    const processedData = Array.isArray(data)
      ? await dataAccessControlService.processData(userId, resource, data, context)
      : await dataAccessControlService.applyFieldControls(userId, resource, data)

    // 返回结果
    return NextResponse.json({ data: processedData })
  } catch (error) {
    console.error("Error processing data access control:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
