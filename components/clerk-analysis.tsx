import { Check, Info } from "lucide-react"

export function ClerkAnalysis() {
  const advantages = [
    {
      title: "快速实施",
      description: "不到10分钟即可完成身份验证和用户管理的设置",
      icon: Check,
    },
    {
      title: "简单集成",
      description: "只需添加两个组件（<SignIn /> 和 <UserProfile />）即可实现完整功能",
      icon: Check,
    },
    {
      title: "全框架支持",
      description: "支持所有主流前端框架，提供统一的开发体验",
      icon: Check,
    },
    {
      title: "用户迁移",
      description: "支持从现有系统迁移用户数据，降低切换成本",
      icon: Check,
    },
    {
      title: "开箱即用的UI",
      description: "提供像素级完美的组件，无需额外设计工作",
      icon: Check,
    },
    {
      title: "内置分析",
      description: "自动收集用户行为分析数据，提供洞察",
      icon: Check,
    },
    {
      title: "开发者体验",
      description: "专注于提供最佳开发者体验，关注每一个细节",
      icon: Check,
    },
  ]

  const pricingTiers = [
    {
      name: "免费计划",
      price: "$0/月",
      features: ["最多500个月活用户", "基础身份验证", "社交登录", "有限的自定义选项"],
      note: "适合个人项目和小型应用",
    },
    {
      name: "初创计划",
      price: "$25/月起",
      features: ["最多5,000个月活用户", "所有身份验证方法", "完整的品牌自定义", "优先支持"],
      note: "适合成长中的初创企业",
    },
    {
      name: "企业计划",
      price: "联系销售",
      features: ["无限用户", "高级安全功能", "专属支持", "SLA保障", "自定义集成"],
      note: "适合大型企业和关键业务应用",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Clerk服务优势分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start p-3 border rounded-lg">
                <div className="flex-shrink-0 mr-3 mt-1 text-green-500">
                  <advantage.icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">{advantage.title}</h3>
                  <p className="text-sm text-gray-600">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">费用结构分析</h2>

          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
            <div className="flex-shrink-0 mr-3 text-amber-500">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">注意事项</h3>
              <p className="text-sm text-amber-700">
                邮件中未提供具体的价格信息。以下价格结构基于类似身份验证服务的常见定价模式，仅供参考。
                实际价格请访问Clerk官方网站或联系其销售团队获取最新信息。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <p className="text-2xl font-bold mt-2">{tier.price}</p>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <Check size={16} className="flex-shrink-0 mr-2 mt-1 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-gray-500 italic">{tier.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">成本效益分析</h2>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">开发成本节约</h3>
              <p className="text-gray-700">
                使用Clerk可以节省自行开发身份验证系统的时间和资源，典型的身份验证系统开发可能需要2-4周的工程师时间。
                按每周工程师成本$2,000-$4,000计算，使用Clerk可节省$4,000-$16,000的开发成本。
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">维护成本考量</h3>
              <p className="text-gray-700">
                自建身份验证系统需要持续的安全更新和维护，每月可能需要5-10小时的工程师时间。
                使用Clerk可以将这部分维护工作外包，让团队专注于核心业务功能开发。
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">安全风险降低</h3>
              <p className="text-gray-700">
                身份验证漏洞可能导致数据泄露，平均每次数据泄露成本约为$4.35百万（根据IBM 2023年报告）。
                使用专业身份验证服务可显著降低这类安全风险。
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">总体拥有成本(TCO)</h3>
              <p className="text-gray-700">
                考虑到开发成本、维护成本、安全风险和机会成本，对于大多数中小型应用来说，
                使用Clerk等第三方身份验证服务通常比自建解决方案的总体拥有成本更低。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
