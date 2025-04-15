"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { dataAccessControlService } from "@/lib/data-access-control-service"

// 定义用户角色类型
export type UserRole = "admin" | "manager" | "developer" | "viewer" | "marketing" | "hr"

// 定义用户信息接口
export interface User {
  id: string
  name: string
  role: UserRole
  avatar?: string
  email?: string
  department?: string
  permissions?: string[] // 直接分配的权限
  createdAt?: string
  lastLogin?: string
}

// 权限组/继承接口
export interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: string[]
  parentGroups?: string[] // 继承自哪些权限组
}

// 审计日志条目
export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: "login" | "logout" | "permission_change" | "access_denied" | "role_change" | "view_sensitive"
  details: string
  ipAddress?: string
  resource?: string
}

// 定义上下文接口
interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User) => void
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  logout: () => void
  availableUsers: User[]
  switchUser: (userId: string) => void
  permissionGroups: PermissionGroup[]
  addPermissionGroup: (group: Omit<PermissionGroup, "id">) => void
  updatePermissionGroup: (id: string, updates: Partial<Omit<PermissionGroup, "id">>) => void
  deletePermissionGroup: (id: string) => void
  auditLogs: AuditLogEntry[]
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void
  clearAuditLogs: () => void
  getAllPermissions: () => string[]
  getUserPermissions: (userId: string) => string[]
  updateUserPermissions: (userId: string, permissions: string[]) => void
  updateUserRole: (userId: string, role: UserRole) => void
}

// 创建上下文
const UserContext = createContext<UserContextType | undefined>(undefined)

// 预定义的用户列表
const predefinedUsers: User[] = [
  {
    id: "1",
    name: "管理员",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "admin@example.com",
    department: "技术部",
    createdAt: "2023-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "2",
    name: "项目经理",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "manager@example.com",
    department: "项目部",
    createdAt: "2023-01-15T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "3",
    name: "开发人员",
    role: "developer",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "developer@example.com",
    department: "技术部",
    createdAt: "2023-02-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "4",
    name: "访客",
    role: "viewer",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "viewer@example.com",
    department: "外部",
    createdAt: "2023-03-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "5",
    name: "营销专员",
    role: "marketing",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "marketing@example.com",
    department: "营销部",
    createdAt: "2023-02-15T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "6",
    name: "人力资源",
    role: "hr",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "hr@example.com",
    department: "人力资源部",
    createdAt: "2023-01-20T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
]

// 基础角色权限映射
const baseRolePermissions: Record<UserRole, string[]> = {
  admin: ["admin", "manage_users", "manage_projects", "view_reports", "edit_navigation", "access_settings", "view_all"],
  manager: ["manage_projects", "view_reports", "view_team", "edit_goals", "view_analytics"],
  developer: ["view_projects", "update_tasks", "view_team", "view_personal_goals"],
  viewer: ["view_dashboard", "view_public_reports"],
  marketing: ["view_marketing_data", "edit_campaigns", "view_analytics", "view_dashboard"],
  hr: ["view_employee_data", "manage_recruitment", "view_team", "view_dashboard"],
}

// 预定义的权限组
const predefinedPermissionGroups: PermissionGroup[] = [
  {
    id: "pg1",
    name: "基础用户",
    description: "所有用户都应该拥有的基础权限",
    permissions: ["view_dashboard", "view_profile"],
  },
  {
    id: "pg2",
    name: "营销基础",
    description: "营销部门基础权限",
    permissions: ["view_marketing_data", "view_campaigns"],
    parentGroups: ["pg1"], // 继承基础用户权限
  },
  {
    id: "pg3",
    name: "营销高级",
    description: "营销部门高级权限",
    permissions: ["edit_campaigns", "view_marketing_analytics"],
    parentGroups: ["pg2"], // 继承营销基础权限
  },
  {
    id: "pg4",
    name: "管理基础",
    description: "管理层基础权限",
    permissions: ["view_team", "view_reports"],
    parentGroups: ["pg1"], // 继承基础用户权限
  },
  {
    id: "pg5",
    name: "管理高级",
    description: "管理层高级权限",
    permissions: ["manage_projects", "edit_goals"],
    parentGroups: ["pg4"], // 继承管理基础权限
  },
]

// 提供者组件
export function UserProvider({ children }: { children: ReactNode }) {
  // 默认使用管理员用户
  const [currentUser, setCurrentUser] = useState<User | null>(predefinedUsers[0])
  const [users, setUsers] = useState<User[]>(predefinedUsers)
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(predefinedPermissionGroups)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [mingdaoError, setMingdaoError] = useState<string | null>(null)

  // 初始化时添加登录日志
  useEffect(() => {
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: "login",
        details: `用户 ${currentUser.name} (${currentUser.role}) 登录系统`,
      })
    }
  }, [])

  // 获取用户所有权限（包括继承的）
  const getUserPermissions = (userId: string): string[] => {
    const user = users.find((u) => u.id === userId)
    if (!user) return []

    // 基础角色权限
    const rolePermissions = baseRolePermissions[user.role] || []

    // 用户直接分配的权限
    const directPermissions = user.permissions || []

    // 合并权限
    const allPermissions = new Set([...rolePermissions, ...directPermissions])

    return Array.from(allPermissions)
  }

  // 获取所有可用权限
  const getAllPermissions = (): string[] => {
    const allPermissions = new Set<string>()

    // 收集所有角色权限
    Object.values(baseRolePermissions).forEach((permissions) => {
      permissions.forEach((permission) => allPermissions.add(permission))
    })

    // 收集所有权限组权限
    permissionGroups.forEach((group) => {
      group.permissions.forEach((permission) => allPermissions.add(permission))
    })

    return Array.from(allPermissions).sort()
  }

  // 递归获取权限组的所有权限（包括继承的）
  const getPermissionGroupAllPermissions = (groupId: string, visited = new Set<string>()): string[] => {
    // 防止循环依赖
    if (visited.has(groupId)) return []
    visited.add(groupId)

    const group = permissionGroups.find((g) => g.id === groupId)
    if (!group) return []

    // 直接权限
    const directPermissions = [...group.permissions]

    // 继承权限
    const inheritedPermissions = (group.parentGroups || []).flatMap((parentId) =>
      getPermissionGroupAllPermissions(parentId, visited),
    )

    // 合并去重
    return Array.from(new Set([...directPermissions, ...inheritedPermissions]))
  }

  // 检查用户是否有特定权限
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false

    // 管理员拥有所有权限
    if (currentUser.role === "admin") return true

    // 获取用户所有权限
    const userPermissions = getUserPermissions(currentUser.id)

    return userPermissions.includes(permission)
  }

  // 更新用户权限
  const updateUserPermissions = (userId: string, permissions: string[]) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, permissions } : user)))

    // 记录审计日志
    const user = users.find((u) => u.id === userId)
    if (user) {
      addAuditLog({
        userId: currentUser?.id || "system",
        userName: currentUser?.name || "系统",
        action: "permission_change",
        details: `更新了用户 ${user.name} 的权限`,
        resource: `user:${userId}`,
      })
    }
  }

  // 更新用户角色
  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          // 记录审计日志
          addAuditLog({
            userId: currentUser?.id || "system",
            userName: currentUser?.name || "系统",
            action: "role_change",
            details: `将用户 ${user.name} 的角色从 ${user.role} 更改为 ${role}`,
            resource: `user:${userId}`,
          })

          return { ...user, role }
        }
        return user
      }),
    )
  }

  // 登出
  const logout = () => {
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: "logout",
        details: `用户 ${currentUser.name} 登出系统`,
      })
    }
    setCurrentUser(null)
  }

  // 切换用户
  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      // 记录当前用户登出
      if (currentUser) {
        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: "logout",
          details: `用户 ${currentUser.name} 登出系统`,
        })
      }

      // 更新用户最后登录时间
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, lastLogin: new Date().toISOString() } : u)),
      )

      setCurrentUser(user)

      // 记录新用户登录
      addAuditLog({
        userId: user.id,
        userName: user.name,
        action: "login",
        details: `用户 ${user.name} (${user.role}) 登录系统`,
      })
    }
  }

  useEffect(() => {
    if (currentUser) {
      // Fetch user data from Mingdao and apply data access policies
      const fetchData = async () => {
        try {
          setMingdaoError(null)
          // Fetch user data from Mingdao (replace with your actual API call)
          const response = await fetch(`/api/mingdao/users/${currentUser.id}`)
          if (!response.ok) {
            // Handle non-JSON responses
            const errorText = await response.text()
            console.error("Mingdao API error:", errorText)
            setMingdaoError(`Mingdao API error: ${response.status} - ${errorText.substring(0, 200)}...`)
            return
          }

          const userData = await response.json()

          // Apply data access policies
          const processedData = await dataAccessControlService.applyFieldControls(currentUser.id, "user", userData)

          // Update user context with processed data
          setCurrentUser({ ...currentUser, ...processedData })
        } catch (error) {
          console.error("Error fetching or processing user data:", error)
          setMingdaoError(`Error fetching or processing user data: ${error.message}`)
        }
      }

      fetchData()
    }
  }, [currentUser])

  // 添加权限组
  const addPermissionGroup = (group: Omit<PermissionGroup, "id">) => {
    const newGroup: PermissionGroup = {
      ...group,
      id: `pg${Date.now()}`,
    }

    setPermissionGroups((prev) => [...prev, newGroup])

    // 记录审计日志
    addAuditLog({
      userId: currentUser?.id || "system",
      userName: currentUser?.name || "系统",
      action: "permission_change",
      details: `创建了新的权限组: ${group.name}`,
      resource: `permission_group:${newGroup.id}`,
    })
  }

  // 更新权限组
  const updatePermissionGroup = (id: string, updates: Partial<Omit<PermissionGroup, "id">>) => {
    setPermissionGroups((prev) => prev.map((group) => (group.id === id ? { ...group, ...updates } : group)))

    // 记录审计日志
    const group = permissionGroups.find((g) => g.id === id)
    if (group) {
      addAuditLog({
        userId: currentUser?.id || "system",
        userName: currentUser?.name || "系统",
        action: "permission_change",
        details: `更新了权限组: ${group.name}`,
        resource: `permission_group:${id}`,
      })
    }
  }

  // 删除权限组
  const deletePermissionGroup = (id: string) => {
    // 记录审计日志
    const group = permissionGroups.find((g) => g.id === id)
    if (group) {
      addAuditLog({
        userId: currentUser?.id || "system",
        userName: currentUser?.name || "系统",
        action: "permission_change",
        details: `删除了权限组: ${group.name}`,
        resource: `permission_group:${id}`,
      })
    }

    setPermissionGroups((prev) => prev.filter((group) => group.id !== id))
  }

  // 添加审计日志
  const addAuditLog = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1", // 模拟IP地址
    }

    setAuditLogs((prev) => [newEntry, ...prev])
  }

  // 清除审计日志
  const clearAuditLogs = () => {
    if (currentUser?.role === "admin") {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: "permission_change",
        details: "清除了所有审计日志",
      })
      setAuditLogs([])
    }
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated: !!currentUser,
        hasPermission,
        logout,
        availableUsers: users,
        switchUser,
        permissionGroups,
        addPermissionGroup,
        updatePermissionGroup,
        deletePermissionGroup,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        getAllPermissions,
        getUserPermissions,
        updateUserPermissions,
        updateUserRole,
      }}
    >
      {mingdaoError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">明道云集成错误!</strong>
          <span className="block sm:inline">{mingdaoError}</span>
        </div>
      )}
      {children}
    </UserContext.Provider>
  )
}

// 使用上下文的钩子
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
