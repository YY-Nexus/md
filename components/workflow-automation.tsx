"use client"

import { useState } from "react"
import { Play, Plus, Trash2, Save, Code, FileText, ImageIcon, Folder, RefreshCw } from "lucide-react"

interface WorkflowStep {
  id: string
  type: "folder" | "file" | "image" | "code" | "command"
  name: string
  description: string
  config: Record<string, string>
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "项目初始化工作流",
      description: "快速创建和设置新的Next.js项目",
      steps: [
        {
          id: "1-1",
          type: "folder",
          name: "创建项目文件夹",
          description: "在Projects/active目录下创建新项目文件夹",
          config: {
            path: "~/Projects/active",
            name: "新项目名称",
          },
        },
        {
          id: "1-2",
          type: "command",
          name: "初始化Next.js项目",
          description: "使用create-next-app创建新项目",
          config: {
            command: "npx create-next-app@latest .",
          },
        },
        {
          id: "1-3",
          type: "command",
          name: "安装额外依赖",
          description: "安装常用的开发依赖",
          config: {
            command: "npm install tailwindcss postcss autoprefixer && npx tailwindcss init -p",
          },
        },
      ],
    },
    {
      id: "2",
      name: "图像批处理工作流",
      description: "批量处理和优化图像文件",
      steps: [
        {
          id: "2-1",
          type: "folder",
          name: "选择源文件夹",
          description: "选择包含图像的源文件夹",
          config: {
            path: "~/Documents/Images/Raw",
          },
        },
        {
          id: "2-2",
          type: "image",
          name: "调整图像大小",
          description: "将所有图像调整为标准尺寸",
          config: {
            width: "1200",
            height: "auto",
            format: "jpg",
          },
        },
        {
          id: "2-3",
          type: "folder",
          name: "保存到目标文件夹",
          description: "将处理后的图像保存到目标文件夹",
          config: {
            path: "~/Documents/Images/Processed",
          },
        },
      ],
    },
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>("1")
  const [isEditing, setIsEditing] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const getWorkflow = () => {
    return workflows.find((w) => w.id === selectedWorkflow) || null
  }

  const handleRunWorkflow = () => {
    setIsRunning(true)
    setProgress(0)

    // 模拟工作流执行
    const workflow = getWorkflow()
    if (!workflow) return

    const totalSteps = workflow.steps.length
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setProgress(Math.round((currentStep / totalSteps) * 100))

      if (currentStep >= totalSteps) {
        clearInterval(interval)
        setTimeout(() => {
          setIsRunning(false)
          setProgress(0)
        }, 1000)
      }
    }, 1500)
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-5 w-5 text-amber-500" />
      case "file":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "image":
        return <ImageIcon className="h-5 w-5 text-purple-500" />
      case "code":
        return <Code className="h-5 w-5 text-green-500" />
      case "command":
        return <RefreshCw className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">工作流自动化</h2>

      <div className="flex mb-6">
        <div className="w-1/3 border-r pr-4">
          <h3 className="text-lg font-medium mb-3">可用工作流</h3>
          <div className="space-y-2">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedWorkflow === workflow.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                onClick={() => setSelectedWorkflow(workflow.id)}
              >
                <div className="font-medium">{workflow.name}</div>
                <div className="text-sm text-gray-500">{workflow.description}</div>
              </div>
            ))}

            <button className="w-full mt-4 flex items-center justify-center p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              <span>添加新工作流</span>
            </button>
          </div>
        </div>

        <div className="w-2/3 pl-6">
          {getWorkflow() ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">{getWorkflow()?.name}</h3>
                  <p className="text-gray-500">{getWorkflow()?.description}</p>
                </div>
                <div className="space-x-2">
                  {!isRunning && (
                    <>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50"
                      >
                        {isEditing ? "取消" : "编辑"}
                      </button>
                      <button
                        onClick={handleRunWorkflow}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Play className="h-4 w-4 inline mr-1" />
                        运行
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isRunning && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>执行中...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b">
                  <h4 className="font-medium">工作流步骤</h4>
                </div>
                <div className="divide-y">
                  {getWorkflow()?.steps.map((step, index) => (
                    <div key={step.id} className="p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center">
                            {getStepIcon(step.type)}
                            <h5 className="font-medium ml-2">{step.name}</h5>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>

                          {isEditing && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              {Object.entries(step.config).map(([key, value]) => (
                                <div key={key} className="flex items-center mb-2 last:mb-0">
                                  <span className="text-sm font-medium w-24">{key}:</span>
                                  <input
                                    type="text"
                                    value={value}
                                    className="flex-grow p-1 text-sm border rounded"
                                    onChange={() => {}}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {isEditing && (
                          <button className="text-red-500 hover:text-red-700 ml-2">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="p-4 bg-gray-50 border-t">
                    <button className="w-full p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-1" />
                      <span>添加步骤</span>
                    </button>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
                    <Save className="h-4 w-4 mr-1" />
                    保存更改
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">请选择一个工作流</div>
          )}
        </div>
      </div>
    </div>
  )
}
