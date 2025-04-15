"use client"

import type React from "react"

import { useState } from "react"
import { EditableNavigation } from "./editable-navigation"
import { NavigationGuide } from "./navigation-guide"
import { UserRoleSwitcher } from "./user-role-switcher"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 侧边导航 */}
      <div
        className={`
          border-r bg-white transition-all duration-300 ease-in-out
          ${isNavCollapsed ? "w-0 overflow-hidden" : "w-64"}
        `}
      >
        <div className="p-4 h-full">
          <EditableNavigation onNavigate={(path) => console.log(`导航到: ${path}`)} className="h-full" />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航切换按钮 */}
        <div className="bg-white border-b p-4 flex items-center">
          <Button variant="outline" size="sm" onClick={() => setIsNavCollapsed(!isNavCollapsed)} className="mr-4">
            {isNavCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <h1 className="text-xl font-bold">应用仪表盘</h1>

          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowGuide(!showGuide)}>
              {showGuide ? "隐藏指南" : "显示指南"}
            </Button>
            <UserRoleSwitcher />
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 gap-6">
            {showGuide && <NavigationGuide />}

            {/* 页面内容 */}
            <div>{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
