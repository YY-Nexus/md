"use client"

import { useState, useEffect, useCallback } from "react"
import type { SensitiveDataType } from "@/types/data-security"

interface UseDataMaskingOptions {
  value: string
  dataType: SensitiveDataType
}

export function useDataMasking({ value, dataType }: UseDataMaskingOptions) {
  const [maskedValue, setMaskedValue] = useState<string>(value)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const maskData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // 调用API进行数据脱敏
      const response = await fetch(`/api/data-security/mask?value=${encodeURIComponent(value)}&dataType=${dataType}`)

      if (!response.ok) {
        throw new Error("Failed to mask data")
      }

      const data = await response.json()
      setMaskedValue(data.maskedValue)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      // 出错时使用默认脱敏（显示星号）
      setMaskedValue("******")
    } finally {
      setIsLoading(false)
    }
  }, [value, dataType])

  useEffect(() => {
    maskData()
  }, [maskData])

  return { maskedValue, isLoading, error, refresh: maskData }
}
