"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useTemplate } from "../contexts/template-context"

interface TemplateImportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function TemplateImportDialog({ isOpen, onClose }: TemplateImportDialogProps) {
  const { importTemplate } = useTemplate()
  const [shareCode, setShareCode] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleImport = () => {
    if (!shareCode.trim()) {
      setStatus("error")
      setMessage("请输入分享代码")
      return
    }

    try {
      const success = importTemplate(shareCode.trim())

      if (success) {
        setStatus("success")
        setMessage("模板导入成功！")

        // 重置表单
        setTimeout(() => {
          setShareCode("")
          setStatus("idle")
          onClose()
        }, 1500)
      } else {
        setStatus("error")
        setMessage("无效的模板代码或模板已存在")
      }
    } catch (error) {
      setStatus("error")
      setMessage("导入失败：" + (error.message || "未知错误"))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导入模板</DialogTitle>
          <DialogDescription>输入您收到的模板分享代码，导入团队成员分享的报告模板。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="share-code">模板分享代码</Label>
            <Input
              id="share-code"
              value={shareCode}
              onChange={(e) => {
                setShareCode(e.target.value)
                setStatus("idle")
              }}
              placeholder="粘贴模板分享代码..."
              className="font-mono"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {message}
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              {message}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleImport} disabled={status === "success"}>
            导入模板
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
