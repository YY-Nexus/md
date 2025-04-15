import { Terminal, AlertCircle, Info } from "lucide-react"

export default function NextCleanupCommands() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <h2 className="text-2xl font-bold">Next.js安装清理详细命令指南</h2>
        <p className="mt-2 opacity-90">每个命令的详细解释与使用方法</p>
      </div>

      <div className="p-6 space-y-8">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Terminal className="mr-2 text-red-600" size={20} />
              <h3 className="font-semibold text-lg">1. 清理全局安装</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">npm uninstall -g next</div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>命令解释：</strong>
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">npm</code> - Node包管理器
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">uninstall</code> - 卸载命令
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">-g</code> - 全局标志，表示卸载全局安装的包
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">next</code> - 要卸载的包名
                </li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>作用：</strong> 从系统中移除全局安装的Next.js，释放空间并避免版本冲突。
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Terminal className="mr-2 text-red-600" size={20} />
              <h3 className="font-semibold text-lg">2. 清理npm缓存</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">npm cache clean --force</div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>命令解释：</strong>
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">npm</code> - Node包管理器
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">cache</code> - 缓存子命令
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">clean</code> - 清理缓存
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">--force</code> - 强制执行，不询问确认
                </li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>作用：</strong> 清理npm的本地缓存，删除下载的包和元数据，释放磁盘空间。
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Terminal className="mr-2 text-red-600" size={20} />
              <h3 className="font-semibold text-lg">3. 查找并清理未使用的Next.js项目</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-gray-700">Mac/Linux系统命令：</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              find ~/Projects -name "package.json" -exec grep -l "next" {} \;
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>命令解释（逐步分解）：</strong>
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">find</code> - Unix/Linux查找文件的命令
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">~/Projects</code> -
                  在用户主目录下的Projects文件夹中查找
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">-name "package.json"</code> -
                  查找名为package.json的文件
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">-exec</code> - 对找到的每个文件执行后面的命令
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">grep -l "next"</code> -
                  在文件中搜索"next"字符串，-l参数表示只显示文件名
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">{}</code> - 代表find找到的每个文件
                </li>
                <li>
                  <code className="bg-gray-100 px-1 py-0.5 rounded">\;</code> - 结束-exec命令
                </li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>作用：</strong>{" "}
                在~/Projects目录下查找所有package.json文件，然后检查这些文件中是否包含"next"字符串，
                如果包含则输出文件路径。这样可以找出所有使用Next.js的项目。
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-700">Windows系统命令（PowerShell）：</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                Get-ChildItem -Path C:\Projects -Recurse -Filter "package.json" | Select-String -Pattern "next"
              </div>
              <div className="space-y-2 mt-2">
                <p className="text-gray-700">
                  <strong>命令解释（逐步分解）：</strong>
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">Get-ChildItem</code> -
                    PowerShell中列出文件和目录的命令（类似于ls或dir）
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">-Path C:\Projects</code> -
                    在C盘的Projects文件夹中查找
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">-Recurse</code> - 递归查找所有子目录
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">-Filter "package.json"</code> -
                    只查找名为package.json的文件
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">|</code> -
                    管道符，将前一个命令的输出传递给下一个命令
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">Select-String</code> -
                    PowerShell中搜索文本内容的命令（类似于grep）
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">-Pattern "next"</code> - 搜索包含"next"字符串的行
                  </li>
                </ul>
                <p className="text-gray-700 mt-2">
                  <strong>作用：</strong>{" "}
                  在C:\Projects目录下递归查找所有package.json文件，然后检查这些文件中是否包含"next"字符串，
                  如果包含则输出文件路径和匹配的行。这样可以找出所有使用Next.js的项目。
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-700">清理找到的项目：</h4>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">rm -rf 项目路径/node_modules</div>
              <div className="space-y-2 mt-2">
                <p className="text-gray-700">
                  <strong>命令解释：</strong>
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">rm</code> - 删除文件或目录的命令
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">-rf</code> - 递归(-r)且强制(-f)删除，不询问确认
                  </li>
                  <li>
                    <code className="bg-gray-100 px-1 py-0.5 rounded">项目路径/node_modules</code> -
                    要删除的node_modules目录的路径
                  </li>
                </ul>
                <p className="text-gray-700 mt-2">
                  <strong>作用：</strong> 删除指定项目中的node_modules目录，释放磁盘空间。项目仍然保留，但依赖包被删除。
                </p>
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-start mt-2">
                  <AlertCircle className="flex-shrink-0 mr-3 text-amber-500" size={18} />
                  <p className="text-sm text-amber-700">
                    <strong>注意：</strong> 此命令会永久删除文件，请确保指定了正确的路径。在Windows中，可以使用
                    <code className="px-1 py-0.5 bg-amber-100 rounded ml-1">rmdir /s /q 项目路径\node_modules</code>
                    命令。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <Info className="flex-shrink-0 mr-3 text-blue-500" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800">推荐的Next.js使用方式</h3>
              <p className="text-sm text-blue-700 mt-1">
                清理完成后，建议使用项目级安装而非全局安装。使用
                <code className="px-1 py-0.5 bg-blue-100 rounded mx-1">npx create-next-app@latest my-project-name</code>
                创建新项目，这样每个项目都有自己独立的Next.js版本，避免版本冲突。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
