import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.MINGDAO_API_KEY
    const apiSecret = process.env.MINGDAO_API_SECRET
    const baseUrl = process.env.MINGDAO_BASE_URL

    if (!apiKey || !apiSecret || !baseUrl) {
      return NextResponse.json({ error: "缺少API凭证" }, { status: 500 })
    }

    // 向明道云API发送简单请求
    const headers = {
      "X-MD-API-KEY": apiKey,
      "X-MD-API-SECRET": apiSecret,
      "Content-Type": "application/json",
    }

    // 此端点应返回基本账户信息
    const response = await fetch(`${baseUrl}/account`, {
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: "API连接失败", details: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      message: "成功连接到明道云API",
      data,
    })
  } catch (error) {
    console.error("API测试失败:", error)
    return NextResponse.json({ error: "API测试失败", message: error.message }, { status: 500 })
  }
}
