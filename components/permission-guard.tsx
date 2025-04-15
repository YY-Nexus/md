"use client"

import type { ReactNode } from "react"
import { usePermission } from "@/hooks/use-permission"
import type { PermissionAction, ResourceType } from "@/types/permission"

interface PermissionGuardProps {
  resource: ResourceType
  action: PermissionAction
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ resource, action, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission, isLoading } = usePermission({ resource, action })

  // 如果正在加载，可以显示加载状态或直接返回null
  if (isLoading) {
    return null
  }

  // 如果有权限，显示子组件，否则显示fallback
  return hasPermission ? <>{children}</> : <>{fallback}</>
}
