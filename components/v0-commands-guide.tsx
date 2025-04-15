import { Terminal, Download, Upload, Play } from "lucide-react"

export function V0CommandsGuide() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-black text-white">
        <div className="flex items-center">
          <Terminal className="mr-2" />
          <h2 className="text-xl font-bold">v0 命令指南</h2>
        </div>
        <p className="mt-2 text-gray-400">基于您的终端输出，使用v0命令管理Next.js项目和Clerk集成</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Download className="mr-2 text-blue-600" size={20} />
              <h3 className="font-semibold text-lg">拉取环境变量</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">v0 env</div>
            <p className="text-gray-700">
              此命令将从Vercel拉取环境变量到本地的<code className="px-1 py-0.5 bg-gray-100 rounded">.env.local</code>
              文件。 对于Clerk集成，这将拉取您的
              <code className="px-1 py-0.5 bg-gray-100 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>和
              <code className="px-1 py-0.5 bg-gray-100 rounded">CLERK_SECRET_KEY</code>。
            </p>
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="text-amber-800 text-sm">
                <strong>注意：</strong> 拉取后，您可能需要重启开发服务器以使新的环境变量生效。
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Play className="mr-2 text-green-600" size={20} />
              <h3 className="font-semibold text-lg">启动开发服务器</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">v0 dev</div>
            <p className="text-gray-700">
              此命令启动Next.js开发服务器，让您可以在本地测试您的应用，包括Clerk身份验证功能。
              服务器启动后，您可以在浏览器中访问
              <code className="px-1 py-0.5 bg-gray-100 rounded">http://localhost:3000</code>。
            </p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Upload className="mr-2 text-purple-600" size={20} />
              <h3 className="font-semibold text-lg">部署到Vercel</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">v0 deploy</div>
            <p className="text-gray-700">
              完成Clerk集成并在本地测试无误后，使用此命令将您的项目部署到Vercel。
              这将包括您的所有代码更改和环境变量配置。
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-2">Clerk集成工作流程</h3>
          <ol className="space-y-2 text-blue-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                1
              </span>
              <span>
                安装Clerk SDK: <code className="px-1 py-0.5 bg-blue-100 rounded">npm install @clerk/nextjs</code>
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                2
              </span>
              <span>
                使用<code className="px-1 py-0.5 bg-blue-100 rounded">v0 env</code>拉取Clerk API密钥
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                3
              </span>
              <span>更新middleware.ts和layout.tsx文件</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                4
              </span>
              <span>
                使用<code className="px-1 py-0.5 bg-blue-100 rounded">v0 dev</code>在本地测试
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 bg-blue-200 text-blue-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">
                5
              </span>
              <span>
                使用<code className="px-1 py-0.5 bg-blue-100 rounded">v0 deploy</code>部署到Vercel
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
