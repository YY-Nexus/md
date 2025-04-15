interface EmailContent {
  recipient: string
  sender: string
  subject: string
  mainPoints: string[]
  callToAction: string
  setupSteps: string[]
  benefits: string[]
}

export function EmailParser() {
  const emailData: EmailContent = {
    recipient: "YanYu",
    sender: "The Clerk Team",
    subject: "快速集成Clerk身份验证服务",
    mainPoints: ["提供简单安全的身份验证和完整的用户管理", "10分钟内完成设置", "支持所有主流框架", "可以迁移现有用户"],
    setupSteps: ["在本地安装Clerk", "添加<SignIn /> 和 <UserProfile /> 组件"],
    benefits: ["开箱即用的用户管理", "像素级完美的组件", "立即开始收集分析数据", "开发者友好的体验", "细致入微的关注"],
    callToAction: "开始使用",
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">邮件内容分析</h2>

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">基本信息</h3>
          <span className="text-sm text-gray-500">Clerk身份验证服务</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">收件人</p>
            <p className="font-medium">{emailData.recipient}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">发件人</p>
            <p className="font-medium">{emailData.sender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">主题</p>
            <p className="font-medium">{emailData.subject}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">主要内容</h3>
        <ul className="list-disc pl-5 space-y-1">
          {emailData.mainPoints.map((point, index) => (
            <li key={index} className="text-gray-700">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">设置步骤</h3>
        <ol className="list-decimal pl-5 space-y-1">
          {emailData.setupSteps.map((step, index) => (
            <li key={index} className="text-gray-700">
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-2 text-gray-700 italic">完成这些步骤后，您就可以开始管理用户并收集分析数据。</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">产品优势</h3>
        <ul className="list-disc pl-5 space-y-1">
          {emailData.benefits.map((benefit, index) => (
            <li key={index} className="text-gray-700">
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-indigo-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">行动号召</h3>
        <div className="flex items-center">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            {emailData.callToAction}
          </button>
          <p className="ml-4 text-gray-700">快速集成身份验证，专注于您的核心业务</p>
        </div>
      </div>
    </div>
  )
}
