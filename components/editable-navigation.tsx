"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  ImageIcon,
  FileText,
  Network,
  Settings,
  MoreHorizontal,
  Lock,
  Shield,
} from "lucide-react"
import { useUser } from "@/contexts/user-context"

// 导航项类型
interface NavItem {
  id: string
  title: string
  color: string
  path: string
  // 添加权限控制
  requiredPermissions?: string[]
  children?: NavItem[]
  isExpanded?: boolean
}

// 内容展示模式类型
type DisplayMode = "image" | "text" | "mindmap"

interface EditableNavigationProps {
  initialItems?: NavItem[]
  onNavigate?: (path: string) => void
  className?: string
}

export function EditableNavigation({ initialItems = [], onNavigate, className = "" }: EditableNavigationProps) {
  // 使用用户上下文
  const { currentUser, hasPermission } = useUser()

  const defaultPrimaryColor = "#3b82f6" // 默认主色调

  const [navItems, setNavItems] = useState<NavItem[]>(
    initialItems.length > 0
      ? initialItems
      : [
          {
            id: "1",
            title: "仪表盘",
            color: "#3b82f6",
            path: "/dashboard",
            requiredPermissions: ["view_dashboard"],
            isExpanded: true,
            children: [
              {
                id: "1-1",
                title: "概览",
                color: "#60a5fa",
                path: "/dashboard/overview",
                requiredPermissions: ["view_dashboard"],
              },
              {
                id: "1-2",
                title: "分析",
                color: "#60a5fa",
                path: "/dashboard/analytics",
                requiredPermissions: ["view_analytics"],
              },
            ],
          },
          {
            id: "2",
            title: "团队管理",
            color: "#10b981",
            path: "/team-management",
            requiredPermissions: ["view_team", "manage_projects"],
            isExpanded: false,
            children: [
              {
                id: "2-1",
                title: "成员",
                color: "#34d399",
                path: "/team-management/members",
                requiredPermissions: ["view_team"],
              },
              {
                id: "2-2",
                title: "项目",
                color: "#34d399",
                path: "/team-management/projects",
                requiredPermissions: ["manage_projects"],
              },
            ],
          },
          {
            id: "3",
            title: "目标跟踪",
            color: "#8b5cf6",
            path: "/goals",
            requiredPermissions: ["view_personal_goals", "edit_goals"],
            isExpanded: false,
            children: [
              {
                id: "3-1",
                title: "团队目标",
                color: "#a78bfa",
                path: "/goals/team",
                requiredPermissions: ["edit_goals"],
              },
              {
                id: "3-1",
                title: "个人目标",
                color: "#a78bfa",
                path: "/goals/personal",
                requiredPermissions: ["view_personal_goals"],
              },
            ],
          },
          {
            id: "4",
            title: "报表中心",
            color: "#f59e0b",
            path: "/reports",
            requiredPermissions: ["view_reports", "view_public_reports"],
            isExpanded: false,
            children: [
              {
                id: "4-1",
                title: "公开报表",
                color: "#fbbf24",
                path: "/reports/public",
                requiredPermissions: ["view_public_reports"],
              },
              {
                id: "4-2",
                title: "管理报表",
                color: "#fbbf24",
                path: "/reports/management",
                requiredPermissions: ["view_reports"],
              },
              {
                id: "4-3",
                title: "高级分析",
                color: "#fbbf24",
                path: "/reports/advanced",
                requiredPermissions: ["view_reports"],
              },
            ],
          },
          {
            id: "5",
            title: "系统设置",
            color: "#ef4444",
            path: "/settings",
            requiredPermissions: ["access_settings", "admin"],
            isExpanded: false,
            children: [
              {
                id: "5-1",
                title: "用户管理",
                color: "#f87171",
                path: "/settings/users",
                requiredPermissions: ["manage_users"],
              },
              {
                id: "5-2",
                title: "权限设置",
                color: "#f87171",
                path: "/settings/permissions",
                requiredPermissions: ["admin"],
              },
              {
                id: "5-3",
                title: "系统配置",
                color: "#f87171",
                path: "/settings/config",
                requiredPermissions: ["admin"],
              },
              {
                id: "5-4",
                title: "审计日志",
                color: "#f87171",
                path: "/settings/audit-logs",
                requiredPermissions: ["admin"],
              },
            ],
          },
        ],
  )

  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [editingColor, setEditingColor] = useState("")
  const [editingPermissions, setEditingPermissions] = useState<string[]>([])
  const [displayMode, setDisplayMode] = useState<DisplayMode>("text")
  const [isEditMode, setIsEditMode] = useState(false)
  const [draggedItem, setDraggedItem] = useState<NavItem | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)
  const [showAllItems, setShowAllItems] = useState(false) // 管理员可以查看所有项目

  const inputRef = useRef<HTMLInputElement>(null)

  // 当进入编辑模式时，自动聚焦输入框
  useEffect(() => {
    if (editingItemId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingItemId])

  // 检查用户是否有权限查看导航项
  const hasAccessToNavItem = (item: NavItem): boolean => {
    // 如果是管理员且选择了显示所有项目，则显示所有
    if (currentUser?.role === "admin" && showAllItems) {
      return true
    }

    // 如果没有指定权限要求，则所有人可见
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true
    }

    // 检查用户是否有任一所需权限
    return item.requiredPermissions.some((permission) => hasPermission(permission))
  }

  // 过滤导航项，只显示用户有权限查看的项目
  const filterNavItemsByPermission = (items: NavItem[]): NavItem[] => {
    return (
      items
        .filter(hasAccessToNavItem)
        .map((item) => {
          if (item.children && item.children.length > 0) {
            const filteredChildren = filterNavItemsByPermission(item.children)
            return { ...item, children: filteredChildren }
          }
          return item
        })
        // 过滤掉没有子项的父项（如果它们有子项但都被过滤掉了）
        .filter((item) => !(item.children && item.children.length === 0))
    )
  }

  // 获取可见的导航项
  const visibleNavItems = filterNavItemsByPermission(navItems)

  // 开始编辑导航项
  const startEditing = (item: NavItem) => {
    setEditingItemId(item.id)
    setEditingTitle(item.title)
    setEditingColor(item.color)
    setEditingPermissions(item.requiredPermissions || [])
  }

  // 保存编辑
  const saveEditing = () => {
    if (!editingItemId) return

    setNavItems((items) =>
      updateItemById(items, editingItemId, {
        title: editingTitle,
        color: editingColor,
        requiredPermissions: editingPermissions,
      }),
    )

    setEditingItemId(null)
  }

  // 取消编辑
  const cancelEditing = () => {
    setEditingItemId(null)
  }

  // 切换导航项展开/折叠状态
  const toggleExpand = (id: string) => {
    setNavItems((items) =>
      updateItemById(items, id, (item) => ({
        ...item,
        isExpanded: !item.isExpanded,
      })),
    )
  }

  // 添加新的导航项
  const addNavItem = (parentId: string | null = null) => {
    const newId = `item-${Date.now()}`
    const newItem: NavItem = {
      id: newId,
      title: "新导航项",
      color: defaultPrimaryColor,
      path: `/new-path-${newId}`,
      requiredPermissions: ["view_dashboard"], // 默认权限
      children: [],
    }

    if (!parentId) {
      // 添加顶级导航项
      setNavItems([...navItems, newItem])
      startEditing(newItem)
    } else {
      // 添加子导航项
      setNavItems((items) =>
        updateItemById(items, parentId, (item) => ({
          ...item,
          isExpanded: true,
          children: [...(item.children || []), newItem],
        })),
      )
      startEditing(newItem)
    }
  }

  // 删除导航项
  const deleteNavItem = (id: string) => {
    // 递归查找并删除项目
    const deleteItem = (items: NavItem[]): NavItem[] => {
      return items.filter((item) => {
        if (item.id === id) return false

        if (item.children && item.children.length > 0) {
          item.children = deleteItem(item.children)
        }

        return true
      })
    }

    setNavItems(deleteItem(navItems))
  }

  // 处理导航点击
  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    }
  }

  // 开始拖动
  const handleDragStart = (item: NavItem) => {
    setDraggedItem(item)
  }

  // 拖动结束
  const handleDragEnd = () => {
    if (!draggedItem || !dragOverItemId) {
      setDraggedItem(null)
      setDragOverItemId(null)
      return
    }

    // 实现拖放逻辑
    // 这里简化处理，实际应用中可能需要更复杂的逻辑
    const moveItem = (items: NavItem[], sourceId: string, targetId: string): NavItem[] => {
      // 找到源项和目标项
      let sourceItem: NavItem | null = null
      let sourceParentItems: NavItem[] | null = null
      let targetParentItems: NavItem[] | null = null

      // 递归查找源项和目标项
      const findItems = (items: NavItem[], parentItems: NavItem[] | null = null) => {
        for (const item of items) {
          if (item.id === sourceId) {
            sourceItem = item
            sourceParentItems = parentItems || items
          }

          if (item.id === targetId) {
            targetParentItems = parentItems || items
          }

          if (item.children) {
            findItems(item.children, item.children)
          }
        }
      }

      findItems(items)

      if (!sourceItem || !sourceParentItems || !targetParentItems) {
        return items
      }

      // 从源位置移除
      const newSourceParentItems = sourceParentItems.filter((item) => item.id !== sourceId)

      // 添加到目标位置
      const targetIndex = targetParentItems.findIndex((item) => item.id === targetId)
      targetParentItems.splice(targetIndex + 1, 0, sourceItem)

      // 更新整个导航树
      return [...items]
    }

    setNavItems(moveItem(navItems, draggedItem.id, dragOverItemId))
    setDraggedItem(null)
    setDragOverItemId(null)
  }

  // 拖动经过
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOverItemId(id)
  }

  // 递归更新导航项
  const updateItemById = (
    items: NavItem[],
    id: string,
    updateFn: ((item: NavItem) => Partial<NavItem>) | Partial<NavItem>,
  ): NavItem[] => {
    return items.map((item) => {
      if (item.id === id) {
        const updates = typeof updateFn === "function" ? updateFn(item) : updateFn
        return { ...item, ...updates }
      }

      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateItemById(item.children, id, updateFn),
        }
      }

      return item
    })
  }

  // 渲染导航项
  const renderNavItem = (item: NavItem, level = 0) => {
    const isEditing = editingItemId === item.id
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = item.isExpanded
    const hasRestrictions = item.requiredPermissions && item.requiredPermissions.length > 0

    return (
      <div
        key={item.id}
        className={`
          ${level > 0 ? "ml-4" : ""}
          ${dragOverItemId === item.id ? "border-t-2 border-blue-500" : ""}
        `}
        draggable={isEditMode}
        onDragStart={() => handleDragStart(item)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, item.id)}
      >
        <div
          className={`
            flex items-center justify-between p-2 rounded-md
            ${isEditMode ? "cursor-move" : "cursor-pointer"}
            ${level === 0 ? "font-medium" : ""}
            hover:bg-gray-100
          `}
          style={{
            borderLeft: level === 0 ? `4px solid ${item.color}` : "none",
            paddingLeft: level === 0 ? "12px" : undefined,
          }}
          onClick={() => !isEditMode && handleNavClick(item.path)}
        >
          <div className="flex items-center flex-grow">
            {isEditing ? (
              <>
                <Input
                  ref={inputRef}
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="h-8 mr-2"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      style={{ backgroundColor: editingColor }}
                    >
                      <span className="sr-only">选择颜色</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        "#3b82f6",
                        "#10b981",
                        "#8b5cf6",
                        "#f59e0b",
                        "#ef4444",
                        "#60a5fa",
                        "#34d399",
                        "#a78bfa",
                        "#fbbf24",
                        "#f87171",
                        "#93c5fd",
                        "#6ee7b7",
                        "#c4b5fd",
                        "#fcd34d",
                        "#fca5a5",
                      ].map((color) => (
                        <Button
                          key={color}
                          variant="outline"
                          className="h-8 w-8 p-0"
                          style={{ backgroundColor: color }}
                          onClick={() => setEditingColor(color)}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="ghost" size="sm" onClick={saveEditing} className="ml-2">
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-grow" style={{ color: level === 0 ? item.color : undefined }}>
                  {item.title}
                  {hasRestrictions && <Lock className="inline-block h-3 w-3 ml-1 text-gray-400" />}
                </span>

                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(item.id)
                    }}
                    className="ml-2 h-6 w-6 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4 transform -rotate-90" />
                    )}
                  </Button>
                )}

                {isEditMode && (
                  <div className="flex items-center ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(item)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            addNavItem(item.id)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          添加子项
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNavItem(item.id)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">{item.children!.map((child) => renderNavItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  // 渲染不同的展示模式
  const renderDisplayMode = () => {
    switch (displayMode) {
      case "image":
        return (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-center mb-4">
              <ImageIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">图像导航模式</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {visibleNavItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleNavClick(item.path)}
                >
                  <CardContent className="p-4 flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: item.color }}
                    >
                      <span className="text-white font-bold text-lg">{item.title.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-center" style={{ color: item.color }}>
                      {item.title}
                      {item.requiredPermissions && item.requiredPermissions.length > 0 && (
                        <Lock className="inline-block h-3 w-3 ml-1 text-gray-400" />
                      )}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "mindmap":
        return (
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-center mb-4">
              <Network className="h-5 w-5 mr-2" />
              <span className="font-medium">脑图导航模式</span>
            </div>
            <div className="flex justify-center">
              <div className="relative p-4 border rounded-md bg-white">
                {/* 中心节点 */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                    <span className="font-bold text-gray-700">导航</span>
                  </div>

                  {/* 连接线和子节点 */}
                  {visibleNavItems.map((item, index) => {
                    // 计算位置，均匀分布在圆周上
                    const angle = index * (360 / visibleNavItems.length) * (Math.PI / 180)
                    const distance = 120 // 到中心的距离
                    const x = Math.cos(angle) * distance
                    const y = Math.sin(angle) * distance

                    return (
                      <div key={item.id}>
                        {/* 连接线 */}
                        <div
                          className="absolute left-1/2 top-1/2 w-0.5 bg-gray-300 origin-bottom"
                          style={{
                            transform: `rotate(${angle}rad)`,
                            height: distance - 10,
                            transformOrigin: "center bottom",
                          }}
                        />

                        {/* 子节点 */}
                        <div
                          className="absolute w-16 h-16 rounded-full flex items-center justify-center cursor-pointer"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)",
                            backgroundColor: item.color,
                          }}
                          onClick={() => handleNavClick(item.path)}
                        >
                          <span className="text-white font-medium text-sm text-center">
                            {item.title}
                            {item.requiredPermissions && item.requiredPermissions.length > 0 && (
                              <Lock className="inline-block h-3 w-3 ml-1 text-white opacity-70" />
                            )}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )

      case "text":
      default:
        return <div className="space-y-1">{visibleNavItems.map((item) => renderNavItem(item))}</div>
    }
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
        <h3 className="font-medium">应用导航</h3>

        <div className="flex items-center space-x-2">
          <Tabs value={displayMode} onValueChange={(value) => setDisplayMode(value as DisplayMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="text" className="px-2 h-7">
                <FileText className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="image" className="px-2 h-7">
                <ImageIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="mindmap" className="px-2 h-7">
                <Network className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {currentUser?.role === "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllItems(!showAllItems)}
              className="h-8"
              title={showAllItems ? "显示有权限的项目" : "显示所有项目"}
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}

          {hasPermission("edit_navigation") && (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditMode(!isEditMode)}
              className="h-8"
            >
              <Settings className="h-4 w-4 mr-1" />
              {isEditMode ? "完成" : "编辑"}
            </Button>
          )}
        </div>
      </div>

      <div className="p-3">
        {renderDisplayMode()}

        {isEditMode && hasPermission("edit_navigation") && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => addNavItem()}>
              <Plus className="h-4 w-4 mr-1" />
              添加导航项
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
