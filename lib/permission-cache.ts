import type { Permission, PermissionCacheItem } from "@/types/permission"

// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 5 * 60 * 1000 // 5分钟

class PermissionCache {
  private cache: Map<string, PermissionCacheItem> = new Map()

  // 获取用户权限（如果缓存有效）
  getPermissions(userId: string): Permission[] | null {
    const cacheItem = this.cache.get(userId)

    // 如果缓存不存在或已过期，返回null
    if (!cacheItem || Date.now() - cacheItem.timestamp > CACHE_EXPIRY) {
      return null
    }

    return cacheItem.permissions
  }

  // 设置用户权限缓存
  setPermissions(userId: string, permissions: Permission[]): void {
    this.cache.set(userId, {
      permissions,
      timestamp: Date.now(),
    })
  }

  // 清除用户权限缓存
  clearPermissions(userId: string): void {
    this.cache.delete(userId)
  }

  // 清除所有缓存
  clearAll(): void {
    this.cache.clear()
  }

  // 获取缓存统计信息
  getStats(): { size: number; avgAge: number } {
    const now = Date.now()
    let totalAge = 0

    this.cache.forEach((item) => {
      totalAge += now - item.timestamp
    })

    const avgAge = this.cache.size > 0 ? totalAge / this.cache.size : 0

    return {
      size: this.cache.size,
      avgAge,
    }
  }
}

// 导出单例实例
export const permissionCache = new PermissionCache()
