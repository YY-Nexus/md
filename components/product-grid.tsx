import { ProductCard } from "./product-card"

// 产品数据
const products = [
  {
    id: 1,
    title: "智云·创意家居",
    description: "智能家居生态系统，提供智能家居解决方案与服务...",
    status: "在线" as const,
    tags: ["智能控制", "场景联动", "语音助手"],
  },
  {
    id: 2,
    title: "智云·医疗健康",
    description: "医疗健康服务平台，整合健康监测、紧急救援与生活照料服务...",
    status: "在线" as const,
    tags: ["健康监测", "远程诊断", "医疗服务"],
  },
  {
    id: 3,
    title: "智云·物联网络",
    description: "物联网络服务平台，提供设备连接、数据分析与智能控制...",
    status: "在线" as const,
    tags: ["设备连接", "数据分析", "智能控制"],
  },
  {
    id: 4,
    title: "智云·教育科技",
    description:
      "智慧教育生态系统，融合自适应学习算法与沉浸式教学体验，通过学习行为分析与知识图谱构建，为学习者提供个性化学习路径，同时支持多模态教学内容生成与智能评估...",
    status: "在线" as const,
    tags: ["自适应学习", "行为分析", "个性化"],
  },
  {
    id: 5,
    title: "智云·金融科技",
    description: "新一代金融风控与智能投顾平台，结合多源数据分析与量化模型，提供实时风险评估与资产配置建议...",
    status: "在线" as const,
    tags: ["风险控制", "量化分析", "预测模型"],
  },
  {
    id: 6,
    title: "智云·政务智能",
    description:
      "数字政务服务平台，实现政务流程再造与服务智能化，通过多语言政务文档处理与智能决策支持系统，提升政务服务效率与精准度，构建开放、透明、高效的数字政府...",
    status: "高线" as const,
    tags: ["政务服务", "数据可视化", "决策支持"],
  },
  {
    id: 7,
    title: "智云·社区生活",
    description:
      "智慧社区综合服务平台，整合社区治理、生活服务与邻里互动功能，基于统一身份认证与多端数据同步，实现社区服务一体化管理，打造便捷、安全、温馨的智慧社区生活...",
    status: "高线" as const,
    tags: ["社区服务", "物业管理", "居民互动"],
  },
  {
    id: 8,
    title: "智云·电商运维",
    description:
      "全渠道电商运营与数据分析平台，提供从供应链到用户体验的全链路优化方案，通过API网关与自动化工具链，实现业务流程自动化与数据驱动决策，提升运营效率与用户满意度...",
    status: "在线" as const,
    tags: ["全渠道分析", "用户行为", "库存管理"],
  },
  {
    id: 9,
    title: "智云·语言学习",
    description:
      "智能语言学习与评估系统，融合语音识别、自然语言处理与情境学习技术，通过实时语音评估与个性化学习路径，为学习者提供沉浸式语言学习体验，实现语言能力的全面提升...",
    status: "在线" as const,
    tags: ["语音识别", "学习评估", "个性化学习"],
  },
]

export function ProductGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard
              title={product.title}
              description={product.description}
              status={product.status}
              tags={product.tags}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
