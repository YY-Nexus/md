"use client"

import { useState, useEffect, useCallback } from "react"
import type { PermissionUsageStats, PermissionUsageTrend, UserPermissionUsage } from "@/types/permission-usage"

interface UsePermissionUsageOptions {
  limit?: number
  token?: string | null
}

interface UsePermissionUsageResult {
  permissionStats: PermissionUsageStats[]
  permissionTrend: (permission: string) => PermissionUsageTrend[]
  userUsage: (userId: string) => UserPermissionUsage[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function usePermissionUsage(options: UsePermissionUsageOptions): UsePermissionUsageResult {
  const [permissionStats, setPermissionStats] = useState<PermissionUsageStats[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPermissionUsage = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 获取权限使用统计
      const response = await fetch(`/api/permission-usage/stats?limit=${options.limit || 10}`, {
        headers: {
          Authorization: options.token ? `Bearer ${options.token}` : "",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to fetch permission usage stats:", response.status, errorText)
        throw new Error(`Failed to fetch permission usage stats: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      setPermissionStats(data.stats)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error("Error in fetchPermissionUsage:", error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [options.limit, options.token])

  // 获取权限使用趋势
  const getPermissionTrend = useCallback((permission: string): PermissionUsageTrend[] => {
    // 这里应该是从API获取权限使用趋势数据
    // 示例实现，实际项目中需要替换为真实数据源
    return []
  }, [])

  // 获取用户权限使用统计
  const getUserUsage = useCallback((userId: string): UserPermissionUsage[] => {
    // 这里应该是从API获取用户权限使用统计数据
    // 示例实现，实际项目中需要替换为真实数据源
    return []
  }, [])

  useEffect(() => {
    if (options.token) {
      fetchPermissionUsage()
    }
  }, [fetchPermissionUsage, options.token])

  return {
    permissionStats,
    permissionTrend: getPermissionTrend,
    userUsage: getUserUsage,
    isLoading,
    error,
    refresh: fetchPermissionUsage,
  }
}
