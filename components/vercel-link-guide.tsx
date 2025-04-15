import { Terminal, Link, Download, AlertCircle, CheckCircle } from "lucide-react"

export function VercelLinkGuide() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-black text-white">
        <div className="flex items-center">
          <Terminal className="mr-2" />
          <h2 className="text-xl font-bold">Vercel项目链接指南</h2>
        </div>
        <p className="mt-2 text-gray-400">将本地代码库链接到Vercel项目并拉取环境变量</p>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
          <AlertCircle className="flex-shrink-0 mr-3 text-amber-500" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">错误信息</h3>
            <p className="text-sm text-amber-700 mt-1">
              <code className="bg-amber-100 px-1 py-0.5 rounded">
                Error: Your codebase isn't linked to a project on Vercel. Run `vercel link` to begin.
              </code>
            </p>
            <p className="text-sm text-amber-700 mt-2">您需要先将本地代码库链接到Vercel项目，然后才能拉取环境变量。</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <Link className="mr-2 text-blue-600" size={20} />
                <h3 className="font-semibold text-lg">步骤1: 链接到Vercel项目</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">vercel link</div>
              <p className="text-gray-700">运行此命令将启动交互式流程，引导您将本地代码库链接到Vercel上的项目。</p>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">您将看到类似以下的提示：</p>
                <div className="space-y-1 text-sm text-gray-800">
                  <p>&gt; Vercel CLI 41.5.0</p>
                  <p>&gt; ? Set up and deploy "~/path/to/your/project"? [Y/n]</p>
                  <p>&gt; ? Which scope should contain your project? [选择您的账户或团队]</p>
                  <p>&gt; ? Link to existing project? [Y/n]</p>
                  <p>&gt; ? What's the name of your existing project? [选择您的项目]</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <Download className="mr-2 text-green-600" size={20} />
                <h3 className="font-semibold text-lg">步骤2: 拉取环境变量</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">vercel env pull .env.local</div>
              <p className="text-gray-700">
                链接成功后，运行此命令将从Vercel项目拉取环境变量到本地的
                <code className="px-1 py-0.5 bg-gray-100 rounded">.env.local</code>文件。
              </p>
              <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-start">
                <CheckCircle className="flex-shrink-0 mr-3 text-green-500" size={18} />
                <p className="text-sm text-green-700">
                  成功后，您将看到类似<code className="px-1 py-0.5 bg-green-100 rounded">Created .env.local file</code>
                  的消息。
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex items-center">
                <Terminal className="mr-2 text-purple-600" size={20} />
                <h3 className="font-semibold text-lg">步骤3: 使用v0命令</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-700">链接并拉取环境变量后，您可以继续使用之前的v0命令：</p>
              <div className="space-y-2">
                <div className="bg-gray-100 p-2 rounded-md font-mono text-sm">v0 env</div>
                <div className="bg-gray-100 p-2 rounded-md font-mono text-sm">v0 dev</div>
                <div className="bg-gray-100 p-2 rounded-md font-mono text-sm">v0 deploy</div>
              </div>
              <p className="text-gray-700">这些命令现在应该能够正常工作，因为您的项目已经链接到Vercel。</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">提示</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-2">•</span>
              <span>
                如果您没有Vercel账户，请先在
                <a href="https://vercel.com" className="underline" target="_blank" rel="noopener noreferrer">
                  vercel.com
                </a>
                注册
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-2">•</span>
              <span>
                如果您还没有在Vercel上创建项目，可以使用<code className="px-1 py-0.5 bg-blue-100 rounded">vercel</code>
                命令直接部署并创建新项目
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-2">•</span>
              <span>
                对于Clerk集成，确保在Vercel项目中设置了
                <code className="px-1 py-0.5 bg-blue-100 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>和
                <code className="px-1 py-0.5 bg-blue-100 rounded">CLERK_SECRET_KEY</code>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
