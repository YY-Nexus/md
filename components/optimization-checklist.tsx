"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp, Info } from "lucide-react"

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  difficulty: "简单" | "中等" | "高级"
  impact: "低" | "中" | "高"
  completed: boolean
}

export function OptimizationChecklist() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("system")
  const [items, setItems] = useState<ChecklistItem[]>([
    // 系统优化
    {
      id: "1",
      category: "system",
      title: "关闭不必要的启动项",
      description: "在系统设置 > 用户与群组 > 登录项中移除不必要的启动项，减少后台进程。",
      difficulty: "简单",
      impact: "中",
      completed: false,
    },
    {
      id: "2",
      category: "system",
      title: "清理桌面",
      description: "桌面上的每个图标都会占用内存。整理桌面，将文件移至文件夹中。",
      difficulty: "简单",
      impact: "低",
      completed: false,
    },
    {
      id: "3",
      category: "system",
      title: "定期重启电脑",
      description: "定期重启可以清理内存和临时文件，保持系统流畅。",
      difficulty: "简单",
      impact: "中",
      completed: false,
    },
    {
      id: "4",
      category: "system",
      title: "使用活动监视器识别内存占用",
      description: "定期检查活动监视器，识别并关闭占用大量内存的应用。",
      difficulty: "简单",
      impact: "高",
      completed: false,
    },

    // 开发环境
    {
      id: "5",
      category: "dev",
      title: "使用容器化开发环境",
      description: "使用Docker隔离不同项目的依赖，减少系统污染。",
      difficulty: "中等",
      impact: "高",
      completed: false,
    },
    {
      id: "6",
      category: "dev",
      title: "优化IDE设置",
      description: "调整IDE内存设置，排除大型文件夹（如node_modules）的索引。",
      difficulty: "中等",
      impact: "高",
      completed: false,
    },
    {
      id: "7",
      category: "dev",
      title: "使用项目特定的虚拟环境",
      description: "为Python项目创建虚拟环境，为Node.js项目使用nvm管理版本。",
      difficulty: "中等",
      impact: "中",
      completed: false,
    },
    {
      id: "8",
      category: "dev",
      title: "定期清理项目缓存",
      description: "定期清理npm缓存、Gradle缓存等构建工具缓存。",
      difficulty: "简单",
      impact: "中",
      completed: false,
    },

    // 应用程序
    {
      id: "9",
      category: "apps",
      title: "使用Safari代替Chrome",
      description: "Safari在macOS上比Chrome更节能，占用内存更少。",
      difficulty: "简单",
      impact: "中",
      completed: false,
    },
    {
      id: "10",
      category: "apps",
      title: "限制同时运行的应用数量",
      description: "养成使用完应用立即关闭的习惯，特别是资源密集型应用。",
      difficulty: "简单",
      impact: "高",
      completed: false,
    },
    {
      id: "11",
      category: "apps",
      title: "使用轻量级应用替代",
      description: "使用VS Code代替重量级IDE，使用Preview代替Photoshop处理简单图像任务。",
      difficulty: "中等",
      impact: "中",
      completed: false,
    },
    {
      id: "12",
      category: "apps",
      title: "优化浏览器扩展",
      description: "禁用不必要的浏览器扩展，它们会占用大量内存。",
      difficulty: "简单",
      impact: "中",
      completed: false,
    },

    // 自动化
    {
      id: "13",
      category: "automation",
      title: "设置自动清理脚本",
      description: "创建定期运行的脚本，清理临时文件和缓存。",
      difficulty: "中等",
      impact: "中",
      completed: false,
    },
    {
      id: "14",
      category: "automation",
      title: "使用Automator自动化工作流",
      description: "创建Automator工作流自动处理重复任务，如图像处理、文件整理等。",
      difficulty: "中等",
      impact: "高",
      completed: false,
    },
    {
      id: "15",
      category: "automation",
      title: "设置定时备份",
      description: "使用Time Machine或其他备份工具定期备份重要数据。",
      difficulty: "简单",
      impact: "高",
      completed: false,
    },
    {
      id: "16",
      category: "automation",
      title: "使用Hazel自动整理文件",
      description: "安装Hazel应用，根据规则自动整理文件，保持文件系统整洁。",
      difficulty: "高级",
      impact: "高",
      completed: false,
    },
  ])

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  const toggleItem = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const categories = [
    { id: "system", name: "系统优化", icon: "💻" },
    { id: "dev", name: "开发环境", icon: "🛠️" },
    { id: "apps", name: "应用程序", icon: "📱" },
    { id: "automation", name: "自动化", icon: "🤖" },
  ]

  const getCompletedCount = (category: string) => {
    return items.filter((item) => item.category === category && item.completed).length
  }

  const getTotalCount = (category: string) => {
    return items.filter((item) => item.category === category).length
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "高":
        return "bg-green-100 text-green-800"
      case "中":
        return "bg-blue-100 text-blue-800"
      case "低":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "简单":
        return "bg-green-100 text-green-800"
      case "中等":
        return "bg-amber-100 text-amber-800"
      case "高级":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">iMac 优化清单</h2>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center">
                <span className="text-xl mr-2">{category.icon}</span>
                <h3 className="font-medium">{category.name}</h3>
                <span className="ml-2 text-sm text-gray-500">
                  ({getCompletedCount(category.id)}/{getTotalCount(category.id)})
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(getCompletedCount(category.id) / getTotalCount(category.id)) * 100}%`,
                    }}
                  ></div>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            {expandedCategory === category.id && (
              <div className="divide-y">
                {items
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-start">
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 mt-0.5 ${
                            item.completed ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"
                          }`}
                        >
                          {item.completed && <Check className="h-4 w-4" />}
                        </button>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${item.completed ? "line-through text-gray-400" : ""}`}>
                              {item.title}
                            </h4>
                            <div className="flex space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                                {item.difficulty}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(item.impact)}`}>
                                影响: {item.impact}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm mt-1 ${item.completed ? "text-gray-400" : "text-gray-600"}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-700">优化提示</h4>
          <p className="text-sm text-blue-600 mt-1">
            从简单任务开始，逐步实施更复杂的优化。每完成一项，检查系统性能变化。
            优先完成"影响:高"的任务可以获得最显著的性能提升。
          </p>
        </div>
      </div>
    </div>
  )
}
