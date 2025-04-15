"use client"

import { useState } from "react"
import { useTemplate } from "../contexts/template-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Palette, Share2, Download, Plus, MoreHorizontal, Trash } from "lucide-react"
import { TemplateShareDialog } from "./template-share-dialog"
import { TemplateImportDialog } from "./template-import-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TemplateSelector() {
  const { currentTemplate, templates, setTemplate, deleteTemplate } = useTemplate()
  const [isOpen, setIsOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const handleShare = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setShareDialogOpen(true)
  }

  const handleDelete = (templateId: string) => {
    if (confirm("确定要删除此模板吗？此操作无法撤销。")) {
      deleteTemplate(templateId)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1">
          <Palette className="h-4 w-4" />
          <span>模板</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={() => setImportDialogOpen(true)}>
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 z-50">
          <Card>
            <CardContent className="p-2">
              <div className="flex items-center justify-between py-2 px-2">
                <div className="text-sm font-medium">选择报告模板</div>
                <Button variant="ghost" size="sm" onClick={() => setImportDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      currentTemplate.id === template.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <div
                      className="flex items-center gap-2 flex-1"
                      onClick={() => {
                        setTemplate(template.id)
                        setIsOpen(false)
                      }}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.colors.primary }} />
                      <div>
                        <div className="font-medium flex items-center">
                          {template.name}
                          {template.isCustom && (
                            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">自定义</span>
                          )}
                          {template.isShared && (
                            <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1 rounded">已分享</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {currentTemplate.id === template.id && <Check className="h-4 w-4 text-green-600 mr-1" />}

                      {template.isCustom && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShare(template.id)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              分享
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(template.id)}>
                              <Trash className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {!template.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleShare(template.id)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 分享对话框 */}
      {selectedTemplateId && (
        <TemplateShareDialog
          templateId={selectedTemplateId}
          isOpen={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
        />
      )}

      {/* 导入对话框 */}
      <TemplateImportDialog isOpen={importDialogOpen} onClose={() => setImportDialogOpen(false)} />
    </div>
  )
}
