"use client"

import { useState } from "react"
import { useDataMasking } from "@/hooks/use-data-masking"
import type { SensitiveDataType } from "@/types/data-security"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface MaskedDataProps {
  value: string
  dataType: SensitiveDataType
  showToggle?: boolean
  className?: string
}

export function MaskedData({ value, dataType, showToggle = false, className = "" }: MaskedDataProps) {
  const [showOriginal, setShowOriginal] = useState(false)
  const { maskedValue, isLoading } = useDataMasking({ value, dataType })

  if (isLoading) {
    return <Skeleton className="h-4 w-20" />
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono">{showOriginal ? value : maskedValue}</span>
      {showToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShowOriginal(!showOriginal)}
          aria-label={showOriginal ? "隐藏原始数据" : "显示原始数据"}
        >
          {showOriginal ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}
