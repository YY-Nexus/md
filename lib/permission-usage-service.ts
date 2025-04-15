import type { PermissionUsageStats, PermissionUsageTrend, UserPermissionUsage } from "@/types/permission-usage"

class PermissionUsageService {
  private usageStats: Map<string, PermissionUsageStats> = new Map()
  private usageTrends: Map<string, PermissionUsageTrend[]> = new Map()
  private userUsage: Map<string, UserPermissionUsage[]> = new Map()

  // 记录权限使用
  async logPermissionUsage(userId: string, permission: string): Promise<void> {
    const now = new Date()

    // 更新权限使用统计
    const statsKey = permission
    const currentStats = this.usageStats.get(statsKey)
    if (currentStats) {
      currentStats.count++
      currentStats.lastUsed = now
      if (!currentStats.users.includes(userId)) {
        currentStats.users.push(userId)
      }
    } else {
      this.usageStats.set(statsKey, {
        permission,
        count: 1,
        lastUsed: now,
        users: [userId],
      })
    }

    // 更新权限使用趋势
    const trendKey = `${permission}-${now.getFullYear()}-${now.getMonth() + 1}`
    let currentTrends = this.usageTrends.get(trendKey)
    if (!currentTrends) {
      currentTrends = []
    }
    currentTrends.push({
      date: now,
      permission,
      count: 1,
    })
    this.usageTrends.set(trendKey, currentTrends)

    // 更新用户权限使用统计
    let currentUserUsage = this.userUsage.get(userId)
    if (!currentUserUsage) {
      currentUserUsage = []
    }
    const permissionUsage = currentUserUsage.find((usage) => usage.permission === permission)
    if (permissionUsage) {
      permissionUsage.count++
      permissionUsage.lastUsed = now
    } else {
      currentUserUsage.push({
        userId,
        permission,
        count: 1,
        lastUsed: now,
      })
    }
    this.userUsage.set(userId, currentUserUsage)

    // 这里可以添加持久化存储逻辑，例如保存到数据库
    console.log(`Permission ${permission} used by ${userId} at ${now.toISOString()}`)
  }

  // 获取权限使用统计
  getPermissionUsageStats(options?: { limit?: number }): PermissionUsageStats[] {
    let stats = Array.from(this.usageStats.values())

    // 排序
    stats.sort((a, b) => b.count - a.count)

    // 限制数量
    if (options?.limit) {
      stats = stats.slice(0, options.limit)
    }

    return stats
  }

  // 获取权限使用趋势
  getPermissionUsageTrend(permission: string, options?: { limit?: number }): PermissionUsageTrend[] {
    let trends: PermissionUsageTrend[] = []

    // 遍历所有趋势数据，找到匹配的权限
    this.usageTrends.forEach((trendList) => {
      trendList.forEach((trend) => {
        if (trend.permission === permission) {
          trends.push(trend)
        }
      })
    })

    // 排序
    trends.sort((a, b) => a.date.getTime() - b.date.getTime())

    // 限制数量
    if (options?.limit) {
      trends = trends.slice(0, options.limit)
    }

    return trends
  }

  // 获取用户权限使用统计
  getUserPermissionUsage(userId: string, options?: { limit?: number }): UserPermissionUsage[] {
    let usage = this.userUsage.get(userId) || []

    // 排序
    usage.sort((a, b) => b.count - a.count)

    // 限制数量
    if (options?.limit) {
      usage = usage.slice(0, options.limit)
    }

    return usage
  }
}

// 导出单例实例
export const permissionUsageService = new PermissionUsageService()
