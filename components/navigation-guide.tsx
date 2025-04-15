"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Network, Edit, Save } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export function NavigationGuide() {
  const [displayMode, setDisplayMode] = useState<"text" | "image" | "mindmap">("text")
  const [isEditing, setIsEditing] = useState(false)

  // 指南内容
  const [textContent, setTextContent] = useState(
    "欢迎使用应用导航系统！您可以通过左侧的导航菜单访问不同的功能模块。点击导航项可以进入相应的页面，展开/折叠按钮可以查看子菜单。您还可以通过顶部的模式切换按钮，在文本、图像和脑图三种不同的导航模式之间切换。如需自定义导航，请点击编辑按钮进入编辑模式。",
  )

  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=200&width=400")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">应用指南</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={displayMode} onValueChange={(value) => setDisplayMode(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-1" />
              文本
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="h-4 w-4 mr-1" />
              图片
            </TabsTrigger>
            <TabsTrigger value="mindmap">
              <Network className="h-4 w-4 mr-1" />
              脑图
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            {isEditing ? (
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[150px]"
              />
            ) : (
              <p className="text-gray-700">{textContent}</p>
            )}
          </TabsContent>

          <TabsContent value="image">
            <div className="flex justify-center">
              <img src={imageUrl || "/placeholder.svg"} alt="导航指南" className="max-w-full h-auto rounded-md" />
            </div>
            {isEditing && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">图片URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="mindmap">
            <div className="flex justify-center p-4 bg-gray-50 rounded-md">
              <div className="text-center">
                <Network className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">{isEditing ? "脑图编辑功能即将推出" : "脑图展示功能即将推出"}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
