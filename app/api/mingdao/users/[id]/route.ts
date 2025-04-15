import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // 模拟从明道云获取用户数据
    const mockUserData = {
      id: id,
      name: `用户${id}`,
      department: id === "1" ? "技术部" : id === "2" ? "项目部" : "其他部门",
      // 更多用户信息...
    }

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 返回JSON数据
    return NextResponse.json(mockUserData)
  } catch (error) {
    console.error("Error fetching user data from Mingdao:", error)
    return NextResponse.json({ message: "Failed to fetch user data", error: error.message }, { status: 500 })
  }
}
