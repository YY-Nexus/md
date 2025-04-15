import { NextResponse, type NextRequest } from "next/server"

// 明道云 API 配置
const apiKey = process.env.MINGDAO_API_KEY
const apiSecret = process.env.MINGDAO_API_SECRET
const baseUrl = process.env.MINGDAO_BASE_URL || "https://api.mingdao.com/v2"

export async function GET(req: NextRequest, { params }: { params: { worksheetId: string } }) {
  try {
    const { worksheetId } = params

    // 验证 API 凭证是否存在
    if (!apiKey || !apiSecret) {
      return NextResponse.json({ message: "明道云 API 凭证未配置" }, { status: 500 })
    }

    // 设置请求头
    const headers = {
      "X-MD-API-KEY": apiKey,
      "X-MD-API-SECRET": apiSecret,
      "Content-Type": "application/json",
    }

    // 从请求中获取查询参数
    const { searchParams } = new URL(req.url)
    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("page_size") || "10"
    const search = searchParams.get("search") || ""
    const filters = searchParams.get("filters") || ""
    const sort_field = searchParams.get("sort_field") || ""
    const sort_order = searchParams.get("sort_order") || ""

    // 构建明道云 API 查询参数
    const queryParams = new URLSearchParams({
      page,
      page_size: pageSize,
      search,
      filters,
      sort_field,
      sort_order,
    })

    // 调用明道云 API 获取记录
    const response = await fetch(`${baseUrl}/worksheets/${worksheetId}/records?${queryParams.toString()}`, {
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("明道云 API 请求失败:", error)
    return NextResponse.json({ message: "服务器错误", error: error.message }, { status: 500 })
  }
}
