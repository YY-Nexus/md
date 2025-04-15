"use client"

import { Terminal, Code, Copy, Check } from "lucide-react"
import { useState } from "react"

interface CommandProps {
  command: string
  description: string
  os: "all" | "windows" | "mac" | "linux"
}

export function EnvFileCommands() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const commands: CommandProps[] = [
    {
      command: "nano .env",
      description: "使用Nano编辑器打开.env文件（简单的命令行编辑器，适合初学者）",
      os: "mac",
    },
    {
      command: "vim .env",
      description: "使用Vim编辑器打开.env文件（高级命令行编辑器，需要了解Vim命令）",
      os: "all",
    },
    {
      command: "code .env",
      description: "使用VS Code打开.env文件（需要安装VS Code并配置命令行工具）",
      os: "all",
    },
    {
      command: "notepad .env",
      description: "使用记事本打开.env文件",
      os: "windows",
    },
    {
      command: "open -e .env",
      description: "使用TextEdit打开.env文件",
      os: "mac",
    },
    {
      command: "touch .env && nano .env",
      description: "如果.env文件不存在，创建并用Nano打开",
      os: "mac",
    },
    {
      command: "type nul > .env && notepad .env",
      description: "如果.env文件不存在，创建并用记事本打开",
      os: "windows",
    },
    {
      command: "cat .env",
      description: "查看.env文件内容（不编辑）",
      os: "all",
    },
    {
      command: "type .env",
      description: "查看.env文件内容（不编辑）",
      os: "windows",
    },
    {
      command: "echo 'KEY=VALUE' >> .env",
      description: "向.env文件添加新的环境变量（不打开编辑器）",
      os: "all",
    },
  ]

  const osIcons = {
    all: "🌐",
    windows: "🪟",
    mac: "🍎",
    linux: "🐧",
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gray-800 text-white">
        <div className="flex items-center">
          <Terminal className="mr-2" />
          <h2 className="text-xl font-bold">.env文件编辑命令</h2>
        </div>
        <p className="mt-2 text-gray-300">选择适合您操作系统的命令来打开和编辑.env文件</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {commands.map((cmd, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{osIcons[cmd.os]}</span>
                  <span className="text-sm text-gray-600">
                    {cmd.os === "all"
                      ? "所有系统"
                      : cmd.os === "windows"
                        ? "Windows"
                        : cmd.os === "mac"
                          ? "macOS"
                          : "Linux"}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(cmd.command)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="复制命令"
                >
                  {copied === cmd.command ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center bg-gray-100 p-2 rounded font-mono text-sm mb-2">
                  <Code size={16} className="mr-2 text-gray-500" />
                  {cmd.command}
                </div>
                <p className="text-sm text-gray-700">{cmd.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="font-semibold text-blue-800">提示</h3>
          <ul className="mt-2 space-y-2 text-sm text-blue-700">
            <li>• 确保您在项目根目录下执行这些命令</li>
            <li>• .env文件通常包含敏感信息，不应提交到版本控制系统</li>
            <li>• 在Next.js中，您可能需要重启开发服务器以使新的环境变量生效</li>
            <li>
              • 对于Vercel部署，您可以使用<code className="px-1 py-0.5 bg-blue-100 rounded">vercel env pull</code>
              命令拉取环境变量
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
