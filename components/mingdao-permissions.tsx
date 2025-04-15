"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface MingdaoPermissionsProps {
  customersWorksheetId: string
  opportunitiesWorksheetId: string
}

interface DataAccessPolicy {
  id: string
  name: string
  description: string
  resource: string
  requiredPermissions: string[]
  worksheetField?: string // 新增：关联的工作表字段
  worksheetValue?: string // 新增：字段值
}

export function MingdaoPermissions({ customersWorksheetId, opportunitiesWorksheetId }: MingdaoPermissionsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [policies, setPolicies] = useState<DataAccessPolicy[]>([])
  const { hasPermission, currentUser, updateUserPermissions } = useUser()
  const [showConfigAlert, setShowConfigAlert] = useState(
    customersWorksheetId === "your_customers_worksheet_id" ||
      opportunitiesWorksheetId === "your_opportunities_worksheet_id",
  )
  const [hasAccessCache, setHasAccessCache] = useState<{ [policyId: string]: boolean }>({})

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch data access policies from Mingdao
        const response = await fetch("/api/mingdao/policies")

        if (!response.ok) {
          throw new Error("Failed to fetch data access policies")
        }

        const data = await response.json()

        if (data.success) {
          setPolicies(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch data access policies")
        }
      } catch (err) {
        console.error("Error fetching data access policies:", err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [customersWorksheetId, opportunitiesWorksheetId])

  // 如果 worksheetId 是占位符，显示配置提示
  if (showConfigAlert) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>明道云数据权限</CardTitle>
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

  // 检查用户是否有访问此策略的权限
  const hasAccessToPolicy = useCallback(
    (policy: DataAccessPolicy): boolean => {
      if (!currentUser) return false

      // Check if the result is already cached
      if (hasAccessCache[policy.id] !== undefined) {
        return hasAccessCache[policy.id]
      }

      let hasAllPermissions = true
      for (const permission of policy.requiredPermissions) {
        if (!hasPermission(permission)) {
          hasAllPermissions = false
          break
        }
      }

      if (!hasAllPermissions) {
        setHasAccessCache((prevCache) => ({ ...prevCache, [policy.id]: false }))
        return false
      }

      if (policy.worksheetField && policy.worksheetValue) {
        const userData = localStorage.getItem("mingdao_user_data")
        if (userData) {
          const user = JSON.parse(userData)
          if (user[policy.worksheetField] !== policy.worksheetValue) {
            setHasAccessCache((prevCache) => ({ ...prevCache, [policy.id]: false }))
            return false
          }
        } else {
          setHasAccessCache((prevCache) => ({ ...prevCache, [policy.id]: false }))
          return false
        }
      }

      setHasAccessCache((prevCache) => ({ ...prevCache, [policy.id]: true }))
      return true
    },
    [currentUser, hasPermission, hasAccessCache],
  )

  // 动态分配权限
  useEffect(() => {
    async function assignPermissions() {
      if (!currentUser) return

      let assignedPermissions: string[] = []

      // 遍历所有策略，检查用户是否满足条件
      for (const policy of policies) {
        if (hasAccessToPolicy(policy)) {
          assignedPermissions = [...assignedPermissions, ...policy.requiredPermissions]
        }
      }

      // 更新用户权限
      updateUserPermissions(currentUser.id, assignedPermissions)
    }

    assignPermissions()
  }, [currentUser, policies, updateUserPermissions, hasAccessToPolicy])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>明道云数据权限</CardTitle>
        <CardDescription>基于明道云数据实现动态权限分配</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>加载中...</p>
        ) : error ? (
          <p className="text-red-500">加载数据权限时出错：{error}</p>
        ) : (
          <>
            <p>已成功集成明道云数据权限！</p>
            <ul>
              {policies.map((policy) => (
                <li key={policy.id}>
                  {policy.name} - {policy.description}
                  {hasAccessToPolicy(policy) ? (
                    <p>You have access to this policy.</p>
                  ) : (
                    <p>You do not have access to this policy.</p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
