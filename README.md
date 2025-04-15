# 明道云 API 集成

![明道云 API 集成](https://img.shields.io/badge/明道云-API集成-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)

这个项目实现了与明道云 API 的集成，允许用户通过表单提交数据到明道云工作表。项目使用 Next.js 和 TypeScript 构建，提供了简单易用的界面和可靠的后端集成。

## 📋 目录

- [功能特点](#功能特点)
- [技术栈](#技术栈)
- [安装步骤](#安装步骤)
- [环境变量配置](#环境变量配置)
- [使用方法](#使用方法)
- [API 文档](#api-文档)
- [项目结构](#项目结构)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## ✨ 功能特点

- 📝 集成明道云公共表单 API，支持数据提交
- 🔄 支持明道云工作表 API，可直接操作工作表数据
- 🌐 响应式设计，完美支持移动设备和桌面设备
- ⚡ 使用 Next.js App Router 构建，性能优异
- 🔒 安全处理 API 密钥和敏感信息
- 🚀 支持一键部署到 Vercel

## 🛠️ 技术栈

- **前端框架**: Next.js 14
- **编程语言**: TypeScript
- **UI 组件**: shadcn/ui
- **样式方案**: Tailwind CSS
- **状态管理**: React Hooks
- **API 集成**: 明道云 API
- **表单处理**: React Hook Form
- **通知提示**: Sonner

## 📥 安装步骤

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 pnpm 包管理器
- 明道云账户和 API 访问权限

### 安装过程

1. **克隆仓库**

   \`\`\`bash
   git clone https://github.com/YY-Nexus/md.git
   cd md
   \`\`\`

2. **安装依赖**

   \`\`\`bash
   npm install
   # 或者
   pnpm install
   \`\`\`

3. **设置环境变量**

   创建 `.env.local` 文件并添加必要的环境变量（详见[环境变量配置](#环境变量配置)）

4. **启动开发服务器**

   \`\`\`bash
   npm run dev
   # 或者
   pnpm dev
   \`\`\`

5. **访问应用**

   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🔧 环境变量配置

项目需要以下环境变量才能正常工作。创建 `.env.local` 文件并添加以下内容：

\`\`\`
# 明道云 API 配置
MINGDAO_API_KEY=您的API密钥
MINGDAO_API_SECRET=您的API密钥
MINGDAO_BASE_URL=https://api.mingdao.com

# 明道云应用信息
MINGDAO_APP_ID=您的应用ID
MINGDAO_WORKSPACE_ID=您的工作区ID
MINGDAO_VIEW_ID=您的视图ID

# 明道云表单信息
MINGDAO_FORM_ID=您的表单ID
\`\`\`

### 如何获取这些值

- **API 密钥和密钥**: 在明道云开发者中心获取
- **应用 ID**: 从明道云应用 URL 中提取，格式如 `263fe47e-cca6-4ebe-be65-68c270072434`
- **工作区 ID**: 从明道云工作区 URL 中提取，格式如 `67fe7b7581486a8a5e2543ad`
- **视图 ID**: 从明道云视图 URL 中提取，格式如 `67fe7b7581486a8a5e2543b1`
- **表单 ID**: 从明道云公共表单 URL 中提取，格式如 `849263a9b97d43c3a490160b2fcdf0cd`

## 📝 使用方法

### 基本使用

1. 访问应用首页
2. 填写表单字段（姓名、年龄等）
3. 点击"添加记录"按钮提交数据
4. 提交成功后，数据将被发送到明道云

### 高级功能

- **自定义字段**: 修改 `MingdaoForm.tsx` 组件以添加或修改表单字段
- **数据验证**: 添加表单验证规则以确保数据质量
- **错误处理**: 自定义错误消息和处理逻辑

## 📚 API 文档

### 公共表单 API

用于向明道云公共表单提交数据。

**端点**: `/api/mingdao/submit-form`

**方法**: POST

**请求体**:
\`\`\`json
{
  "name": "张三",
  "age": "25"
}
\`\`\`

**响应**:
\`\`\`json
{
  "success": true,
  "data": {
    "rowId": "r_xxxxxxxx"
  }
}
\`\`\`

### 工作表 API

用于直接向明道云工作表添加记录。

**端点**: `/api/mingdao/add-record`

**方法**: POST

**请求体**:
\`\`\`json
{
  "worksheetId": "w_xxxxxxxx",
  "controls": [
    {
      "controlId": "c_xxxxxxxx",
      "value": "张三"
    },
    {
      "controlId": "c_yyyyyyyy",
      "value": "25"
    }
  ]
}
\`\`\`

**响应**:
\`\`\`json
{
  "success": true,
  "data": {
    "rowId": "r_xxxxxxxx"
  }
}
\`\`\`

## 📂 项目结构

\`\`\`
md/
├── app/                    # Next.js 应用目录
│   ├── api/                # API 路由
│   │   └── mingdao/        # 明道云 API 集成
│   │       ├── add-record/     # 工作表 API
│   │       └── submit-form/    # 公共表单 API
│   ├── layout.tsx          # 应用布局
│   └── page.tsx            # 首页
├── components/             # React 组件
│   ├── ui/                 # UI 组件 (shadcn/ui)
│   └── MingdaoForm.tsx     # 明道云表单组件
├── scripts/                # 实用脚本
│   └── analyze-mingdao-form.ts  # 分析明道云表单结构
├── public/                 # 静态资源
├── .env.example            # 环境变量示例
├── .gitignore              # Git 忽略文件
├── next.config.js          # Next.js 配置
├── package.json            # 项目依赖
├── README.md               # 项目文档
├── tailwind.config.js      # Tailwind CSS 配置
└── tsconfig.json           # TypeScript 配置
\`\`\`

## ❓ 常见问题

### 提交表单时出现错误

**问题**: 提交表单时收到 API 错误。

**解决方案**:
1. 检查环境变量是否正确设置
2. 确认 API 密钥和密钥有效
3. 检查表单字段名称是否与明道云表单匹配
4. 查看浏览器控制台和服务器日志获取详细错误信息

### 环境变量未生效

**问题**: 设置了环境变量但应用无法访问。

**解决方案**:
1. 确保 `.env.local` 文件位于项目根目录
2. 重启开发服务器以加载新的环境变量
3. 检查环境变量名称是否正确（区分大小写）

### 部署到 Vercel 后无法工作

**问题**: 本地运行正常，但部署到 Vercel 后出现问题。

**解决方案**:
1. 在 Vercel 项目设置中添加所有必要的环境变量
2. 检查 Vercel 构建日志是否有错误
3. 确保 Vercel 项目使用正确的 Node.js 版本

## 🤝 贡献指南

我们欢迎任何形式的贡献！如果您想为项目做出贡献，请遵循以下步骤：

1. Fork 仓库
2. 创建新分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

---

## 📞 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- GitHub Issues: [https://github.com/YY-Nexus/md/issues](https://github.com/YY-Nexus/md/issues)
- Email: [您的邮箱地址]

---

感谢使用明道云 API 集成项目！
