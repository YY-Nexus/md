import { Terminal, Package, Play, FileCode, AlertCircle, CheckCircle } from "lucide-react"

export function NextCommandFix() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-black text-white">
        <div className="flex items-center">
          <Terminal className="mr-2" />
          <h2 className="text-xl font-bold">解决"next: command not found"错误</h2>
        </div>
        <p className="mt-2 text-gray-400">确保Next.js正确安装并可以启动开发服务器</p>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
          <AlertCircle className="flex-shrink-0 mr-3 text-amber-500" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">错误信息</h3>
            <p className="text-sm text-amber-700 mt-1">
              <code className="bg-amber-100 px-1 py-0.5 rounded">sh: next: command not found</code>
            </p>
            <p className="text-sm text-amber-700 mt-2">
              这个错误表明系统找不到`next`命令，通常是因为Next.js没有正确安装或无法在PATH中找到。
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <Package className="mr-2 text-blue-600" size={20} />
                <h3 className="font-semibold text-lg">方法1: 安装Next.js</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">如果您尚未安装Next.js，请运行以下命令：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">npm install next react react-dom</div>
              <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-start">
                <CheckCircle className="flex-shrink-0 mr-3 text-green-500" size={18} />
                <p className="text-sm text-green-700">
                  这将安装Next.js及其依赖项。安装完成后，再次尝试启动开发服务器。
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <Play className="mr-2 text-green-600" size={20} />
                <h3 className="font-semibold text-lg">方法2: 使用npx运行Next.js</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">
                即使Next.js已安装，有时直接使用`next`命令可能会失败。使用npx可以确保运行本地安装的Next.js：
              </p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">npx next dev</div>
              <p className="text-gray-700">或者修改您的v0命令使用npx：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                # 如果v0是一个脚本或别名，您可能需要修改它 # 将"next dev"改为"npx next dev"
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <FileCode className="mr-2 text-purple-600" size={20} />
                <h3 className="font-semibold text-lg">方法3: 检查package.json</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">确保您的package.json文件中有正确的scripts配置：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                {`"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}`}
              </div>
              <p className="text-gray-700">然后使用npm运行开发脚本：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">npm run dev</div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <Terminal className="mr-2 text-gray-600" size={20} />
                <h3 className="font-semibold text-lg">方法4: 检查项目结构</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">确保您在正确的项目目录中，并且该目录是一个Next.js项目：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                {`# 检查当前目录
pwd

# 列出目录内容，确认是否有package.json
ls -la

# 检查package.json中的依赖
cat package.json | grep next`}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">针对Clerk集成的建议</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-2">•</span>
              <span>
                确保您已完成Next.js和Clerk的安装：
                <code className="px-1 py-0.5 bg-blue-100 rounded">npm install next react react-dom @clerk/nextjs</code>
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-2">•</span>
              <span>在解决"next: command not found"错误后，您可以继续完成Clerk的集成步骤</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-2">•</span>
              <span>如果您使用的是自定义的v0命令，可能需要检查该命令的实现，确保它正确调用了Next.js</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
