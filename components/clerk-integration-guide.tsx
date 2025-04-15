import { Check, ArrowRight } from "lucide-react"

export function ClerkIntegrationGuide() {
  const steps = [
    {
      number: 1,
      title: "安装Clerk Next.js包",
      description: "在您现有的Next.js项目中安装Clerk SDK",
      code: "npm install @clerk/nextjs",
      completed: false,
    },
    {
      number: 2,
      title: "配置环境变量",
      description: "在.env文件中添加Clerk API密钥",
      code: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***\nCLERK_SECRET_KEY=sk_test_***",
      completed: false,
    },
    {
      number: 3,
      title: "更新middleware.ts",
      description: "添加Clerk中间件以保护路由",
      code: "import { clerkMiddleware } from '@clerk/nextjs';\n\nexport default clerkMiddleware();\n\nexport const config = {\n  matcher: [\n    // Skip Next.js internals and static files\n    '/((?!_next|\\.[^/]+).*)',\n    // Always run for API routes\n    '/(api|trpc)(.*)',\n  ],\n};",
      completed: false,
    },
    {
      number: 4,
      title: "添加ClerkProvider",
      description: "在应用的根布局文件中添加ClerkProvider",
      code: "import { ClerkProvider, SignInButton, UserButton } from '@clerk/nextjs';\n\nexport default function RootLayout({ children }) {\n  return (\n    <ClerkProvider>\n      <html lang=\"en\">\n        <body>\n          {/* 您的导航栏可以放这里，包含SignInButton或UserButton */}\n          {children}\n        </body>\n      </html>\n    </ClerkProvider>\n  );\n}",
      completed: false,
    },
    {
      number: 5,
      title: "添加登录和用户组件",
      description: "在应用中添加登录按钮和用户资料按钮",
      code: "// 在导航栏或其他适当位置\n<SignInButton />\n\n// 用户登录后显示\n<UserButton />",
      completed: false,
    },
  ]

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="text-2xl font-bold">Clerk身份验证集成指南</h2>
        <p className="mt-2 opacity-90">将Clerk身份验证添加到您现有的Next.js项目中</p>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-800">重要提示</h3>
          <p className="text-sm text-amber-700">
            您<span className="font-bold">不需要重新安装Next.js</span>。这些步骤是为了将Clerk身份验证集成到您
            <span className="font-bold">现有的</span>Next.js项目中。
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                  <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
              {step.number < steps.length && (
                <div className="absolute left-4 top-14 h-16 w-0 border-l-2 border-dashed border-gray-300"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 flex items-center">
            <Check size={18} className="mr-2" />
            完成后
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            完成这些步骤后，您的Next.js应用将具有完整的身份验证功能，包括登录、注册、用户管理等。
            您可以使用Clerk提供的组件和API来自定义用户体验。
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <a
            href="https://clerk.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            查看完整文档
            <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  )
}
