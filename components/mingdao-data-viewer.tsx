"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface MingdaoDataViewerProps {
  worksheetId: string
  title: string
}

export function MingdaoDataViewer({ worksheetId, title }: MingdaoDataViewerProps) {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      if (searchTerm) {
        queryParams.append("search", searchTerm)
      }

      // 添加分页参数
      queryParams.append("page", currentPage.toString())
      queryParams.append("pageSize", pageSize.toString())

      // 检查 worksheetId 是否有效
      if (
        !worksheetId ||
        worksheetId === "your_customers_worksheet_id" ||
        worksheetId === "your_opportunities_worksheet_id"
      ) {
        throw new Error("请提供有效的工作表 ID")
      }

      const response = await fetch(`/api/mingdao/worksheets/${worksheetId}/records?${queryParams.toString()}`)

      if (!response.ok) {
        // 尝试解析错误响应
        let errorMessage = `HTTP 错误: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // 如果响应不是 JSON，尝试获取文本
          const text = await response.text()
          if (text.includes("<!DOCTYPE html>")) {
            errorMessage = "API 端点返回了 HTML 而不是 JSON，可能是路由不存在"
          } else {
            errorMessage = `无法解析错误响应: ${text.substring(0, 100)}...`
          }
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      // 更新总记录数和总页数
      setTotalRecords(result.total || 0)
      setTotalPages(Math.ceil((result.total || 0) / pageSize))

      if (result.records && result.records.length > 0) {
        // Extract column names from the first record
        setColumns(
          Object.keys(result.records[0]).filter(
            (key) =>
              // Filter out internal fields if needed
              !key.startsWith("_"),
          ),
        )
        setData(result.records)
      } else {
        setColumns([])
        setData([])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // 当页码、每页记录数或搜索条件变化时重新获取数据
  useEffect(() => {
    fetchData()
  }, [worksheetId, currentPage, pageSize])

  // 当搜索条件变化时，重置到第一页
  const handleSearch = () => {
    setCurrentPage(1)
    fetchData()
  }

  // 页码变化处理函数
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // 每页记录数变化处理函数
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1) // 重置到第一页
  }

  // 如果 worksheetId 是占位符，显示配置提示
  if (worksheetId === "your_customers_worksheet_id" || worksheetId === "your_opportunities_worksheet_id") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-4 bg-amber-50 text-amber-800 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">配置需要更新</p>
              <p className="text-sm mt-1">
                请在 <code className="bg-amber-100 px-1 py-0.5 rounded">app/mingdao-dashboard/page.tsx</code>{" "}
                文件中更新工作表 ID
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>搜索</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>加载数据时出错：{error}</p>
            <Button variant="outline" onClick={fetchData} className="mt-2">
              重试
            </Button>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            <p>没有找到数据</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((record, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column}>
                          {typeof record[column] === "object"
                            ? JSON.stringify(record[column])
                            : String(record[column] || "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 分页控件 */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">每页显示</p>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={pageSize.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">条记录</p>
              </div>

              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">
                  第 {currentPage} 页，共 {totalPages} 页，总计 {totalRecords} 条记录
                </p>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
