"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Activity, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

interface MemoryData {
  name: string
  used: number
  free: number
  total: number
  percentUsed: number
}

export function MemoryMonitor() {
  const [memoryData, setMemoryData] = useState<MemoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMemoryData = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call to your backend
      // For demo purposes, we're generating mock data
      const mockData: MemoryData = {
        name: "System Memory",
        total: 32, // 32GB total
        used: Math.floor(Math.random() * 20) + 8, // Random between 8-28GB used
        free: 0, // Will be calculated
        percentUsed: 0, // Will be calculated
      }

      mockData.free = mockData.total - mockData.used
      mockData.percentUsed = Math.round((mockData.used / mockData.total) * 100)

      setMemoryData(mockData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch memory data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemoryData()
    const interval = setInterval(fetchMemoryData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (percentUsed: number) => {
    if (percentUsed < 50) return "text-green-500"
    if (percentUsed < 80) return "text-amber-500"
    return "text-red-500"
  }

  const getStatusIcon = (percentUsed: number) => {
    if (percentUsed < 50) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (percentUsed < 80) return <AlertTriangle className="h-5 w-5 text-amber-500" />
    return <AlertTriangle className="h-5 w-5 text-red-500" />
  }

  const getStatusText = (percentUsed: number) => {
    if (percentUsed < 50) return "内存使用正常"
    if (percentUsed < 80) return "内存使用较高"
    return "内存使用过高，建议关闭部分应用"
  }

  const chartData = memoryData
    ? [
        {
          name: "内存使用",
          已使用: memoryData.used,
          可用: memoryData.free,
        },
      ]
    : []

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">内存监控</h2>
        </div>
        <button
          onClick={fetchMemoryData}
          className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          刷新
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : memoryData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">总内存</div>
              <div className="text-2xl font-bold">{memoryData.total} GB</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">已使用</div>
              <div className="text-2xl font-bold">{memoryData.used} GB</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">可用内存</div>
              <div className="text-2xl font-bold">{memoryData.free} GB</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  memoryData.percentUsed < 50
                    ? "bg-green-500"
                    : memoryData.percentUsed < 80
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${memoryData.percentUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "GB", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="已使用" fill="#3b82f6" />
                <Bar dataKey="可用" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(memoryData.percentUsed)}
            <div className="ml-2">
              <div className={`font-medium ${getStatusColor(memoryData.percentUsed)}`}>
                {getStatusText(memoryData.percentUsed)}
              </div>
              <div className="text-sm text-gray-500">内存使用率: {memoryData.percentUsed}%</div>
            </div>
          </div>

          {lastUpdated && (
            <div className="text-xs text-gray-400 mt-4 text-right">上次更新: {lastUpdated.toLocaleTimeString()}</div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 py-12">无法获取内存数据</div>
      )}
    </div>
  )
}
