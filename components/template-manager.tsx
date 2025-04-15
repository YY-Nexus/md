"use client"

import { useState } from "react"
import { useTemplate } from "../contexts/template-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Trash, Download } from "lucide-react"
import { TemplateShareDialog } from "./template-share-dialog"
import { TemplateImportDialog } from "./template-import-dialog"

export function TemplateManager() {
  const { templates, currentTemplate, setTemplate, deleteTemplate } = useTemplate()
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const systemTemplates = templates.filter((t) => !t.isCustom)
  const customTemplates = templates.filter((t) => t.isCustom)

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
    <Card>
      <CardHeader>
        <CardTitle>模板管理</CardTitle>
        <CardDescription>管理和分享您的报告模板</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">所有模板</h3>
          <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            导入模板
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="system">系统模板</TabsTrigger>
            <TabsTrigger value="custom">自定义模板</TabsTrigger>
            <TabsTrigger value="shared">已分享模板</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="h-20 w-full" style={{ backgroundColor: template.colors.primary }}></div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      <div className="flex">
                        {template.isCustom && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleShare(template.id)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant={currentTemplate.id === template.id ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => setTemplate(template.id)}
                      >
                        {currentTemplate.id === template.id ? "当前使用中" : "使用此模板"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="h-20 w-full" style={{ backgroundColor: template.colors.primary }}></div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(template.id)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant={currentTemplate.id === template.id ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => setTemplate(template.id)}
                      >
                        {currentTemplate.id === template.id ? "当前使用中" : "使用此模板"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates.length > 0 ? (
                customTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="h-20 w-full" style={{ backgroundColor: template.colors.primary }}></div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                        <div className="flex">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare(template.id)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant={currentTemplate.id === template.id ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                          onClick={() => setTemplate(template.id)}
                        >
                          {currentTemplate.id === template.id ? "当前使用中" : "使用此模板"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p>暂无自定义模板</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setImportDialogOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    导入模板
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shared">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.filter((t) => t.isShared).length > 0 ? (
                templates
                  .filter((t) => t.isShared)
                  .map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <div className="h-20 w-full" style={{ backgroundColor: template.colors.primary }}></div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                          <div className="flex">
                            {template.isCustom && (
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleShare(template.id)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant={currentTemplate.id === template.id ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => setTemplate(template.id)}
                          >
                            {currentTemplate.id === template.id ? "当前使用中" : "使用此模板"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p>暂无已分享模板</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          共 {templates.length} 个模板，其中 {customTemplates.length} 个自定义模板
        </div>
      </CardFooter>

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
    </Card>
  )
}
