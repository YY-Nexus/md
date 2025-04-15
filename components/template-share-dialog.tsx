"use client"

import { useState, useEffect } from "react"
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
import { Check, Copy, Share2 } from "lucide-react"
import { useTemplate } from "../contexts/template-context"

interface TemplateShareDialogProps {
  templateId: string
  isOpen: boolean
  onClose: () => void
}

export function TemplateShareDialog({ templateId, isOpen, onClose }: TemplateShareDialogProps) {
  const { shareTemplate, templates } = useTemplate()
  const [shareCode, setShareCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [template, setTemplate] = useState<any>(null)

  useEffect(() => {
    if (isOpen && templateId) {
      const selectedTemplate = templates.find((t) => t.id === templateId)
      setTemplate(selectedTemplate)

      // 生成分享代码
      const code = shareTemplate(templateId)
      setShareCode(code)
      setCopied(false)
    }
  }, [isOpen, templateId, shareTemplate, templates])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!template) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>分享模板</DialogTitle>
          <DialogDescription>将此模板分享给团队成员，他们可以导入并使用相同的报告样式。</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.primary }} />
              <span className="font-medium">{template.name}</span>
            </div>
            <Input value={shareCode} readOnly className="font-mono text-sm" />
          </div>
          <Button type="button" size="icon" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="text-sm text-gray-500 flex items-center">
            <Share2 className="h-4 w-4 mr-1" />
            将此代码发送给团队成员，他们可以通过"导入模板"功能使用此模板。
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
