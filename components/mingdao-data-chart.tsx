"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface MingdaoDataChartProps {
  worksheetId: string
  title: string
}

// 图表颜色
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#4CAF50", "#F44336", "#9C27B0", "#3F51B5"]

export function MingdaoDataChart({ worksheetId, title }: MingdaoDataChartProps) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("pie")

  // 图表配置
  const [pieField, setPieField] = useState<string>("")
  const [barXField, setBarXField] = useState<string>("")
  const [barYField, setBarYField] = useState<string>("")
  const [lineXField, setLineXField] = useState<string>("")
  const [lineYField, setLineYField] = useState<string>("")

  // 可用字段
  const [availableFields, setAvailableFields] = useState<string[]>([])
  const [numericFields, setNumericFields] = useState<string[]>([])
  const [categoryFields, setCategoryFields] = useState<string[]>([])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 检查 worksheetId 是否有效
      if (
        !worksheetId ||
        worksheetId === "your_customers_worksheet_id" ||
        worksheetId === "your_opportunities_worksheet_id"
      ) {
        throw new Error("请提供有效的工作表 ID")
      }

      // 获取所有数据用于图表
      const queryParams = new URLSearchParams()
      queryParams.append("pageSize", "100") // 获取更多数据用于图表

      const response = await fetch(`/api/mingdao/worksheets/${worksheetId}/records?${queryParams.toString()}`)

      if (!response.ok) {
        let errorMessage = `HTTP 错误: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
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

      if (result.records && result.records.length > 0) {
        setData(result.records)

        // 分析字段类型
        const fields = Object.keys(result.records[0]).filter((key) => !key.startsWith("_"))
        setAvailableFields(fields)

        // 识别数字字段和分类字段
        const numeric: string[] = []
        const category: string[] = []

        fields.forEach((field) => {
          const value = result.records[0][field]
          if (typeof value === "number") {
            numeric.push(field)
          } else {
            category.push(field)
          }
        })

        setNumericFields(numeric)
        setCategoryFields(category)

        // 设置默认字段
        if (category.length > 0) {
          setPieField(category[0])
          setBarXField(category[0])
          setLineXField(category[0])
        }

        if (numeric.length > 0) {
          setBarYField(numeric[0])
          setLineYField(numeric[0])
        }
      } else {
        setData([])
        setAvailableFields([])
        setNumericFields([])
        setCategoryFields([])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [worksheetId])

  // 为饼图准备数据
  const preparePieData = () => {
    if (!pieField || data.length === 0) return []

    // 按所选字段分组并计数
    const counts = data.reduce((acc, record) => {
      const value = record[pieField] || "未知"
      acc[value] = (acc[value] || 0) + 1
      return acc
    }, {})

    // 转换为图表数据格式
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }

  // 为柱状图准备数据
  const prepareBarData = () => {
    if (!barXField || !barYField || data.length === 0) return []

    // 按X轴字段分组并计算Y轴字段的总和
    const grouped = data.reduce((acc, record) => {
      const xValue = record[barXField] || "未知"
      const yValue = Number(record[barYField]) || 0

      if (!acc[xValue]) {
        acc[xValue] = { [barXField]: xValue, [barYField]: 0 }
      }

      acc[xValue][barYField] += yValue
      return acc
    }, {})

    // 转换为图表数据格式
    return Object.values(grouped)
  }

  // 为折线图准备数据
  const prepareLineData = () => {
    if (!lineXField || !lineYField || data.length === 0) return []

    // 按X轴字段分组并计算Y轴字段的总和
    const grouped = data.reduce((acc, record) => {
      const xValue = record[lineXField] || "未知"
      const yValue = Number(record[lineYField]) || 0

      if (!acc[xValue]) {
        acc[xValue] = { [lineXField]: xValue, [lineYField]: 0 }
      }

      acc[xValue][lineYField] += yValue
      return acc
    }, {})

    // 转换为图表数据格式并排序
    return Object.values(grouped).sort((a, b) => {
      // 尝试按数字排序
      const aVal = a[lineXField]
      const bVal = b[lineXField]

      if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
        return Number(aVal) - Number(bVal)
      }

      // 否则按字符串排序
      return String(aVal).localeCompare(String(bVal))
    })
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>加载数据时出错：{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            <p>没有找到数据</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pie">饼图</TabsTrigger>
              <TabsTrigger value="bar">柱状图</TabsTrigger>
              <TabsTrigger value="line">折线图</TabsTrigger>
            </TabsList>

            <TabsContent value="pie" className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">分类字段:</span>
                <Select value={pieField} onValueChange={setPieField}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择字段" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryFields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {preparePieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="bar" className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">X轴字段:</span>
                  <Select value={barXField} onValueChange={setBarXField}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择X轴字段" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Y轴字段:</span>
                  <Select value={barYField} onValueChange={setBarYField}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择Y轴字段" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareBarData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={barXField} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={barYField} fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="line" className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">X轴字段:</span>
                  <Select value={lineXField} onValueChange={setLineXField}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择X轴字段" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Y轴字段:</span>
                  <Select value={lineYField} onValueChange={setLineYField}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择Y轴字段" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareLineData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={lineXField} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={lineYField} stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
