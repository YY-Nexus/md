"use client"

import { useState, useEffect } from "react"
import { MaskedData } from "@/components/masked-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface SecureDataTableProps {
  resource: string
  title: string
  context?: Record<string, any>
}

export function SecureDataTable({ resource, title, context = {} }: SecureDataTableProps) {
  const [data, setData] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // 这里应该是从您的API获取数据
        // 示例实现，实际项目中需要替换为真实数据源
        const response = await fetch(`/api/data/${resource}`)
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const rawData = await response.json()

        // 应用数据访问控制
        const secureResponse = await fetch("/api/data-security/access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resource,
            data: rawData,
            context,
          }),
        })

        if (!secureResponse.ok) {
          throw new Error("Failed to apply data security")
        }

        const secureData = await secureResponse.json()
        setData(secureData.data)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resource, context])

  // 如果没有数据，显示空状态
  if (!loading && data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">没有可显示的数据</p>
        </CardContent>
      </Card>
    )
  }

  // 获取表格列（从第一行数据中提取）
  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
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
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={`${rowIndex}-${column}`}>
                        {/* 根据字段类型应用脱敏 */}
                        {column.includes("email") ? (
                          <MaskedData value={row[column]} dataType="email" showToggle />
                        ) : column.includes("phone") ? (
                          <MaskedData value={row[column]} dataType="phone" showToggle />
                        ) : column.includes("id_card") || column.includes("personal_id") ? (
                          <MaskedData value={row[column]} dataType="personal_id" showToggle />
                        ) : column.includes("address") ? (
                          <MaskedData value={row[column]} dataType="address" showToggle />
                        ) : column.includes("financial") || column.includes("account") ? (
                          <MaskedData value={row[column]} dataType="financial" showToggle />
                        ) : (
                          row[column]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
