"use client"

import { useState, useEffect, useCallback } from "react"
import type { PermissionAction, ResourceType } from "@/types/permission"

interface UsePermissionOptions {
  resource: ResourceType
  action: PermissionAction
}

interface UsePermissionResult {
  hasPermission: boolean
  isLoading: boolean
  error: Error | null
  checkPermission: () => Promise<boolean>
}

export function usePermission({ resource, action }: UsePermissionOptions): UsePermissionResult {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const checkPermission = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 调用API检查权限
      const response = await fetch(`/api/permissions/check?resource=${resource}&action=${action}`)

      if (!response.ok) {
        throw new Error("Failed to check permission")
      }

      const data = await response.json()
      setHasPermission(data.granted)
      return data.granted
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setHasPermission(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [resource, action])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  return { hasPermission, isLoading, error, checkPermission }
}
