"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useUser } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Clock, Download, Search, Trash2, XCircle } from "lucide-react"

export default function AuditLogsPage() {
  const { currentUser, auditLogs, clearAuditLogs, hasPermission } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  // 检查当前用户是否有权限访问此页面
  if (!currentUser || !hasPermission("admin")) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>权限不足</CardTitle>
              <CardDescription>您没有权限访问此页面</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <XCircle className="mx-auto h-12 w-12 text-red-500" />
                  <h3 className="mt-2 text-lg font-medium">访问被拒绝</h3>
                  <p className="mt-1 text-sm text-gray-500">您需要管理员权限才能访问审计日志页面。</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // 获取所有用户
  const uniqueUsers = Array.from(new Set(auditLogs.map((log) => log.userId)))

  // 获取所有操作类型
  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)))

  // 获取所有日期（按天）
  const uniqueDates = Array.from(
    new Set(
      auditLogs.map((log) => {
        const date = new Date(log.timestamp)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      }),
    ),
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // 按日期降序排序

  // 过滤日志
  const filteredLogs = auditLogs.filter((log) => {
    // 搜索词过滤
    if (searchTerm && !log.details.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // 操作类型过滤
    if (actionFilter !== "all" && log.action !== actionFilter) {
      return false
    }

    // 用户过滤
    if (userFilter !== "all" && log.userId !== userFilter) {
      return false
    }

    // 日期过滤
    if (dateFilter !== "all") {
      const logDate = new Date(log.timestamp)
      const formattedDate = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, "0")}-${String(logDate.getDate()).padStart(2, "0")}`
      if (formattedDate !== dateFilter) {
        return false
      }
    }

    return true
  })

  // 导出日志为CSV
  const exportLogs = () => {
    // 创建CSV内容
    const headers = ["ID", "时间", "用户ID", "用户名", "操作", "详情", "IP地址", "资源"]
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.userId,
      log.userName,
      log.action,
      log.details,
      log.ipAddress || "",
      log.resource || "",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `audit-logs-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 获取操作类型名称
  const getActionName = (action: string) => {
    switch (action) {
      case "login":
        return "登录"
      case "logout":
        return "登出"
      case "permission_change":
        return "权限变更"
      case "access_denied":
        return "访问拒绝"
      case "role_change":
        return "角色变更"
      case "view_sensitive":
        return "查看敏感信息"
      default:
        return action
    }
  }

  // 获取操作类型颜色
  const getActionColor = (action: string) => {
    switch (action) {
      case "login":
        return "text-green-600"
      case "logout":
        return "text-blue-600"
      case "permission_change":
        return "text-amber-600"
      case "access_denied":
        return "text-red-600"
      case "role_change":
        return "text-purple-600"
      case "view_sensitive":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  // 格式化日期时间
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">审计日志</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-1" />
              导出日志
            </Button>
            <Button variant="outline" onClick={clearAuditLogs} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-1" />
              清除日志
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>日志筛选</CardTitle>
            <CardDescription>使用以下选项筛选审计日志</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">搜索</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="搜索日志内容..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="action-filter">操作类型</Label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger id="action-filter">
                    <SelectValue placeholder="选择操作类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有操作</SelectItem>
                    {uniqueActions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {getActionName(action)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user-filter">用户</Label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger id="user-filter">
                    <SelectValue placeholder="选择用户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有用户</SelectItem>
                    {uniqueUsers.map((userId) => {
                      const log = auditLogs.find((log) => log.userId === userId)
                      return (
                        <SelectItem key={userId} value={userId}>
                          {log?.userName || userId}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date-filter">日期</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger id="date-filter">
                    <SelectValue placeholder="选择日期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有日期</SelectItem>
                    {uniqueDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>审计日志列表</CardTitle>
              <div className="text-sm text-gray-500">
                显示 {filteredLogs.length} 条日志，共 {auditLogs.length} 条
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLogs.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">时间</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>操作</TableHead>
                      <TableHead className="w-full">详情</TableHead>
                      <TableHead>IP地址</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDateTime(log.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>{log.userName}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${getActionColor(log.action)}`}>{getActionName(log.action)}</div>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">未找到日志</h3>
                  <p className="mt-1 text-sm text-gray-500">没有符合筛选条件的审计日志，请尝试调整筛选条件</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
