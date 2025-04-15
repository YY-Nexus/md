import { Trash2, Package, Settings, Terminal, Info, CheckCircle } from "lucide-react"

export default function NextManagementGuide() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">Next.js安装管理指南</h2>
        <p className="mt-2 opacity-90">清理多余安装并设置最佳实践</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start">
          <Info className="flex-shrink-0 mr-3 text-amber-500" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">关于Next.js安装</h3>
            <p className="text-sm text-amber-700 mt-1">
              Next.js通常应该作为项目依赖安装，而不是全局安装。这确保了每个项目使用其指定的Next.js版本，避免版本冲突。
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Trash2 className="mr-2 text-red-600" size={20} />
              <h3 className="font-semibold text-lg">清理多余的Next.js安装</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-gray-700">1. 清理全局安装</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 卸载全局Next.js（如果已安装） npm uninstall -g next
            </div>

            <h4 className="font-medium text-gray-700 mt-4">2. 清理node_modules缓存</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm"># 清理npm缓存 npm cache clean --force</div>

            <h4 className="font-medium text-gray-700 mt-4">3. 查找并清理未使用的Next.js项目</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 在Mac/Linux上查找Next.js项目 find ~/Projects -name "package.json" -exec grep -l "next" {"{"} \; #
              在Windows上使用PowerShell查找 Get-ChildItem -Path C:\Projects -Recurse -Filter "package.json" |
              Select-String -Pattern "next"
            </div>
            <p className="text-sm text-gray-600">
              找到后，您可以删除不再需要的项目文件夹，或者保留但清理其node_modules：
              <code className="px-1 py-0.5 bg-gray-100 rounded ml-1">rm -rf 项目路径/node_modules</code>
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Settings className="mr-2 text-blue-600" size={20} />
              <h3 className="font-semibold text-lg">设置推荐的Next.js使用方式</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <h4 className="font-medium text-gray-700">1. 使用npx创建新项目（推荐）</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 创建新的Next.js项目 npx create-next-app@latest my-project-name # 进入项目目录 cd my-project-name #
              启动开发服务器 npm run dev
            </div>
            <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-start">
              <CheckCircle className="flex-shrink-0 mr-3 text-green-500" size={18} />
              <p className="text-sm text-green-700">
                这是官方推荐的方法，它会自动设置项目结构并安装所需的依赖项。每个项目都有自己的Next.js版本。
              </p>
            </div>

            <h4 className="font-medium text-gray-700 mt-4">2. 在现有项目中添加Next.js</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 进入项目目录 cd my-existing-project # 安装Next.js npm install next react react-dom #
              在package.json中添加scripts # "scripts": {"{"}# "dev": "next dev", # "build": "next build", # "start":
              "next start" # {"}"}
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Terminal className="mr-2 text-purple-600" size={20} />
              <h3 className="font-semibold text-lg">创建便捷的命令别名</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">如果您经常创建 Next.js 项目，可以在 Shell 配置文件中添加别名，简化操作:</p>

            <h4 className="font-medium text-gray-700">Bash/Zsh (Mac/Linux)</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 编辑~/.bashrc或~/.zshrc nano ~/.zshrc # 添加以下别名 alias create-next-app='npx create-next-app@latest'
              alias next-dev='npm run dev' # 保存并应用更改 source ~/.zshrc
            </div>

            <h4 className="font-medium text-gray-700 mt-4">PowerShell (Windows)</h4>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 编辑PowerShell配置文件 notepad $PROFILE # 添加以下函数 function Create-NextApp {"{"} npx
              create-next-app@latest $args {"}"}
              function Next-Dev {"{"} npm run dev {"}"}# 设置别名 Set-Alias -Name create-next-app -Value Create-NextApp
              Set-Alias -Name next-dev -Value Next-Dev
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Package className="mr-2 text-green-600" size={20} />
              <h3 className="font-semibold text-lg">管理项目模板</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">创建一个标准的Next.js模板项目，包含您常用的配置和依赖，然后在需要时复制它：</p>

            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 创建模板项目 npx create-next-app@latest next-template cd next-template # 添加常用依赖 npm install
              @clerk/nextjs tailwindcss postcss autoprefixer npx tailwindcss init -p # 设置基本配置 #
              配置tailwind.config.js、next.config.js等 # 使用模板创建新项目 cp -r next-template my-new-project cd
              my-new-project # 更新package.json中的项目名称 # 删除.git文件夹并初始化新的git仓库 rm -rf .git git init
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>提示：</strong> 您也可以使用Next.js的官方模板，例如：
                <code className="px-1 py-0.5 bg-blue-100 rounded ml-1">
                  npx create-next-app@latest --example with-tailwindcss my-project
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
