import { type NextRequest, NextResponse } from "next/server"
import { dataMaskingService } from "@/lib/data-masking-service"
import type { SensitiveDataType } from "@/types/data-security"

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const value = searchParams.get("value")
    const dataType = searchParams.get("dataType") as SensitiveDataType

    // 验证参数
    if (!value || !dataType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // 从请求中获取用户ID（根据您的认证系统调整）
    const userId = request.headers.get("x-user-id")

    // 应用数据脱敏
    const maskedValue = await dataMaskingService.maskData(value, dataType, userId || undefined)

    // 返回结果
    return NextResponse.json({ maskedValue })
  } catch (error) {
    console.error("Error masking data:", error)

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
