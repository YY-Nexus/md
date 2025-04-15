import type {
  Permission,
  PermissionCheckResult,
  Role,
  PermissionGroup,
  UserPermissions,
  ResourceType,
  PermissionAction,
} from "@/types/permission"
import { permissionCache } from "./permission-cache"
import { notificationService } from "./notification-service"

export class PermissionService {
  // 从数据库获取用户权限
  // 在实际应用中，这里应该从数据库或API获取数据
  async getUserPermissionsFromDB(userId: string): Promise<UserPermissions | null> {
    // 这里应该是实际的数据库查询
    // 示例实现，实际项目中需要替换为真实数据源
    console.log(`Fetching permissions for user ${userId} from database`)

    // 模拟数据库延迟
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 返回模拟数据
    return {
      userId,
      roles: ["user"],
      groups: ["basic_users"],
      directPermissions: ["dashboard:read"],
      lastUpdated: Date.now(),
    }
  }

  // 从数据库获取角色
  async getRoleFromDB(roleId: string): Promise<Role | null> {
    // 模拟数据库查询
    console.log(`Fetching role ${roleId} from database`)

    // 模拟数据库延迟
    await new Promise((resolve) => setTimeout(resolve, 50))

    // 返回模拟数据
    if (roleId === "admin") {
      return {
        id: "admin",
        name: "管理员",
        description: "系统管理员",
        permissions: ["user:manage", "role:manage", "permission:manage", "audit_log:read"],
        isSystem: true,
      }
    } else if (roleId === "user") {
      return {
        id: "user",
        name: "普通用户",
        description: "普通用户",
        permissions: ["dashboard:read", "report:read", "worksheet:read"],
      }
    }

    return null
  }

  // 从数据库获取权限组
  async getPermissionGroupFromDB(groupId: string): Promise<PermissionGroup | null> {
    // 模拟数据库查询
    console.log(`Fetching permission group ${groupId} from database`)

    // 模拟数据库延迟
    await new Promise((resolve) => setTimeout(resolve, 50))

    // 返回模拟数据
    if (groupId === "basic_users") {
      return {
        id: "basic_users",
        name: "基础用户组",
        description: "基础用户权限",
        permissions: ["record:read"],
      }
    }

    return null
  }

  // 计算用户的有效权限（包括角色、组和直接权限）
  async calculateEffectivePermissions(userId: string): Promise<Permission[]> {
    // 首先检查缓存
    const cachedPermissions = permissionCache.getPermissions(userId)
    if (cachedPermissions) {
      console.log(`Using cached permissions for user ${userId}`)
      return cachedPermissions
    }

    console.log(`Calculating effective permissions for user ${userId}`)

    // 从数据库获取用户权限
    const userPermissions = await this.getUserPermissionsFromDB(userId)
    if (!userPermissions) {
      return []
    }

    // 收集所有权限
    const allPermissions = new Set<Permission>(userPermissions.directPermissions || [])

    // 添加角色权限
    for (const roleId of userPermissions.roles || []) {
      const role = await this.getRoleFromDB(roleId)
      if (role) {
        role.permissions.forEach((perm) => allPermissions.add(perm))
      }
    }

    // 添加权限组权限
    for (const groupId of userPermissions.groups || []) {
      const group = await this.getPermissionGroupFromDB(groupId)
      if (group) {
        group.permissions.forEach((perm) => allPermissions.add(perm))
      }
    }

    // 转换为数组
    const effectivePermissions = Array.from(allPermissions)

    // 更新缓存
    permissionCache.setPermissions(userId, effectivePermissions)

    return effectivePermissions
  }

  // 检查用户是否有特定权限
  async hasPermission(
    userId: string,
    resource: ResourceType,
    action: PermissionAction,
  ): Promise<PermissionCheckResult> {
    const permission: Permission = `${resource}:${action}`
    const permissions = await this.calculateEffectivePermissions(userId)

    // 检查特定权限
    if (permissions.includes(permission)) {
      return { granted: true }
    }

    // 检查管理权限（manage 包含所有其他权限）
    if (permissions.includes(`${resource}:manage`)) {
      return { granted: true }
    }

    // 检查全局管理权限
    if (permissions.includes("*:manage")) {
      return { granted: true }
    }

    return {
      granted: false,
      reason: `User ${userId} does not have permission ${permission}`,
    }
  }

  // 清除用户权限缓存
  clearUserCache(userId: string): void {
    permissionCache.clearPermissions(userId)
  }

  // 清除所有缓存
  clearAllCache(): void {
    permissionCache.clearAll()
  }

  // 添加新方法：更新用户权限并发送通知
  async updateUserPermissions(
    userId: string,
    updates: {
      addRoles?: string[]
      removeRoles?: string[]
      addGroups?: string[]
      removeGroups?: string[]
      addPermissions?: Permission[]
      removePermissions?: Permission[]
    },
    options: {
      changedBy: string
      reason?: string
      sendNotification?: boolean
    },
  ): Promise<UserPermissions> {
    // 获取当前用户权限
    const currentPermissions = await this.getUserPermissionsFromDB(userId)
    if (!currentPermissions) {
      throw new Error(`User ${userId} not found`)
    }

    // 创建更新后的权限对象
    const updatedPermissions: UserPermissions = {
      ...currentPermissions,
      roles: [...currentPermissions.roles],
      groups: [...currentPermissions.groups],
      directPermissions: [...currentPermissions.directPermissions],
      lastUpdated: Date.now(),
    }

    // 应用角色更新
    if (updates.addRoles) {
      for (const roleId of updates.addRoles) {
        if (!updatedPermissions.roles.includes(roleId)) {
          updatedPermissions.roles.push(roleId)
        }
      }
    }
    if (updates.removeRoles) {
      updatedPermissions.roles = updatedPermissions.roles.filter((roleId) => !updates.removeRoles?.includes(roleId))
    }

    // 应用权限组更新
    if (updates.addGroups) {
      for (const groupId of updates.addGroups) {
        if (!updatedPermissions.groups.includes(groupId)) {
          updatedPermissions.groups.push(groupId)
        }
      }
    }
    if (updates.removeGroups) {
      updatedPermissions.groups = updatedPermissions.groups.filter(
        (groupId) => !updates.removeGroups?.includes(groupId),
      )
    }

    // 应用直接权限更新
    if (updates.addPermissions) {
      for (const permission of updates.addPermissions) {
        if (!updatedPermissions.directPermissions.includes(permission)) {
          updatedPermissions.directPermissions.push(permission)
        }
      }
    }
    if (updates.removePermissions) {
      updatedPermissions.directPermissions = updatedPermissions.directPermissions.filter(
        (permission) => !updates.removePermissions?.includes(permission),
      )
    }

    // 保存更新后的权限
    // 这里应该是实际的数据库更新操作
    console.log(`Updating permissions for user ${userId}:`, updatedPermissions)

    // 清除缓存
    this.clearUserCache(userId)

    // 发送通知
    if (options.sendNotification !== false) {
      await this.sendPermissionChangeNotification(userId, currentPermissions, updatedPermissions, options)
    }

    return updatedPermissions
  }

  // 发送权限变更通知
  private async sendPermissionChangeNotification(
    userId: string,
    oldPermissions: UserPermissions,
    newPermissions: UserPermissions,
    options: {
      changedBy: string
      reason?: string
    },
  ): Promise<void> {
    // 确定变更类型
    const addedRoles = newPermissions.roles.filter((role) => !oldPermissions.roles.includes(role))
    const removedRoles = oldPermissions.roles.filter((role) => !newPermissions.roles.includes(role))

    const addedGroups = newPermissions.groups.filter((group) => !oldPermissions.groups.includes(group))
    const removedGroups = oldPermissions.groups.filter((group) => !newPermissions.groups.includes(group))

    const addedPermissions = newPermissions.directPermissions.filter(
      (perm) => !oldPermissions.directPermissions.includes(perm),
    )
    const removedPermissions = oldPermissions.directPermissions.filter(
      (perm) => !newPermissions.directPermissions.includes(perm),
    )

    // 如果没有变化，不发送通知
    if (
      addedRoles.length === 0 &&
      removedRoles.length === 0 &&
      addedGroups.length === 0 &&
      removedGroups.length === 0 &&
      addedPermissions.length === 0 &&
      removedPermissions.length === 0
    ) {
      return
    }

    // 确定主要变更类型
    let changeType: "added" | "removed" | "modified" = "modified"
    if (
      addedRoles.length > 0 ||
      addedGroups.length > 0 ||
      (addedPermissions.length > 0 &&
        removedRoles.length === 0 &&
        removedGroups.length === 0 &&
        removedPermissions.length === 0)
    ) {
      changeType = "added"
    } else if (
      removedRoles.length > 0 ||
      removedGroups.length > 0 ||
      (removedPermissions.length > 0 &&
        addedRoles.length === 0 &&
        addedGroups.length === 0 &&
        addedPermissions.length === 0)
    ) {
      changeType = "removed"
    }

    // 创建通知
    await notificationService.createPermissionChangeNotification(userId, {
      changeType,
      permissions: [...addedPermissions, ...removedPermissions],
      roles: [...addedRoles, ...removedRoles],
      groups: [...addedGroups, ...removedGroups],
      changedBy: options.changedBy,
      reason: options.reason,
    })
  }
}

// 导出单例实例
export const permissionService = new PermissionService()
