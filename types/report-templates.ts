import { teamManagementTemplate } from "./team-management-template"

// 报告模板类型定义
export interface ReportTemplate {
  id: string
  name: string
  description: string
  // 新增分享相关字段
  createdBy?: string
  createdAt?: string
  isShared?: boolean
  shareCode?: string
  isCustom?: boolean
  // 颜色方案
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    cardBackground: string
    text: string
    subtext: string
    border: string
    success: string
    warning: string
    danger: string
    chartColors: string[]
  }
  // 布局选项
  layout: {
    spacing: string
    borderRadius: string
    cardShadow: string
    headerStyle: string
  }
  // 字体设置
  typography: {
    titleFont: string
    bodyFont: string
    titleSize: string
    subtitleSize: string
    bodySize: string
  }
  // PDF导出设置
  exportSettings: {
    pageSize: string
    orientation: "portrait" | "landscape"
    headerLogo?: string
    footerText: string
  }
}

// 预定义的报告模板
export const reportTemplates: ReportTemplate[] = [
  {
    id: "default",
    name: "默认模板",
    description: "简洁专业的默认报告样式",
    isCustom: false,
    colors: {
      primary: "#8884d8",
      secondary: "#82ca9d",
      accent: "#0088FE",
      background: "#f9fafb",
      cardBackground: "#ffffff",
      text: "#111827",
      subtext: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      chartColors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"],
    },
    layout: {
      spacing: "1rem",
      borderRadius: "0.5rem",
      cardShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      headerStyle: "default",
    },
    typography: {
      titleFont: "sans-serif",
      bodyFont: "sans-serif",
      titleSize: "1.25rem",
      subtitleSize: "0.875rem",
      bodySize: "0.875rem",
    },
    exportSettings: {
      pageSize: "a4",
      orientation: "portrait",
      footerText: "明道云业务目标跟踪系统",
    },
  },
  {
    id: "modern",
    name: "现代风格",
    description: "现代简约风格，深色主题",
    isCustom: false,
    colors: {
      primary: "#6366f1",
      secondary: "#4ade80",
      accent: "#f472b6",
      background: "#1e293b",
      cardBackground: "#334155",
      text: "#f8fafc",
      subtext: "#cbd5e1",
      border: "#475569",
      success: "#22c55e",
      warning: "#eab308",
      danger: "#ef4444",
      chartColors: ["#6366f1", "#4ade80", "#f472b6", "#facc15", "#38bdf8"],
    },
    layout: {
      spacing: "1.25rem",
      borderRadius: "0.75rem",
      cardShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      headerStyle: "modern",
    },
    typography: {
      titleFont: "system-ui",
      bodyFont: "system-ui",
      titleSize: "1.5rem",
      subtitleSize: "1rem",
      bodySize: "0.875rem",
    },
    exportSettings: {
      pageSize: "a4",
      orientation: "portrait",
      footerText: "明道云业务目标跟踪系统 - 现代风格报告",
    },
  },
  {
    id: "corporate",
    name: "企业风格",
    description: "正式的企业报告风格",
    isCustom: false,
    colors: {
      primary: "#1e40af",
      secondary: "#0369a1",
      accent: "#0e7490",
      background: "#f0f9ff",
      cardBackground: "#ffffff",
      text: "#0f172a",
      subtext: "#475569",
      border: "#e2e8f0",
      success: "#059669",
      warning: "#d97706",
      danger: "#dc2626",
      chartColors: ["#1e40af", "#0369a1", "#0e7490", "#0f766e", "#15803d"],
    },
    layout: {
      spacing: "1rem",
      borderRadius: "0.25rem",
      cardShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      headerStyle: "corporate",
    },
    typography: {
      titleFont: "serif",
      bodyFont: "serif",
      titleSize: "1.25rem",
      subtitleSize: "0.875rem",
      bodySize: "0.875rem",
    },
    exportSettings: {
      pageSize: "a4",
      orientation: "portrait",
      footerText: "明道云业务目标跟踪系统 - 企业版报告",
    },
  },
  {
    id: "colorful",
    name: "多彩风格",
    description: "色彩丰富的活力报告风格",
    isCustom: false,
    colors: {
      primary: "#8b5cf6",
      secondary: "#ec4899",
      accent: "#f97316",
      background: "#faf5ff",
      cardBackground: "#ffffff",
      text: "#18181b",
      subtext: "#71717a",
      border: "#e4e4e7",
      success: "#84cc16",
      warning: "#fb923c",
      danger: "#f43f5e",
      chartColors: ["#8b5cf6", "#ec4899", "#f97316", "#facc15", "#84cc16", "#06b6d4"],
    },
    layout: {
      spacing: "1.5rem",
      borderRadius: "1rem",
      cardShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      headerStyle: "colorful",
    },
    typography: {
      titleFont: "system-ui",
      bodyFont: "system-ui",
      titleSize: "1.5rem",
      subtitleSize: "1rem",
      bodySize: "0.875rem",
    },
    exportSettings: {
      pageSize: "a4",
      orientation: "landscape",
      footerText: "明道云业务目标跟踪系统 - 多彩风格报告",
    },
  },
  // 添加团队管理模板
  teamManagementTemplate,
]

// 获取模板
export function getTemplateById(id: string): ReportTemplate {
  return reportTemplates.find((template) => template.id === id) || reportTemplates[0]
}

// 生成分享代码
export function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// 序列化模板为分享字符串
export function serializeTemplate(template: ReportTemplate): string {
  // 移除不需要分享的字段
  const { id, createdBy, createdAt, isShared, shareCode, ...shareableTemplate } = template

  // 创建一个新的对象，包含必要的分享信息
  const templateToShare = {
    ...shareableTemplate,
    id: `shared_${Date.now()}`, // 生成新ID避免冲突
    isCustom: true,
    isShared: true,
    shareCode: generateShareCode(),
    createdAt: new Date().toISOString(),
  }

  return btoa(JSON.stringify(templateToShare))
}

// 从分享字符串反序列化模板
export function deserializeTemplate(shareString: string): ReportTemplate | null {
  try {
    const templateData = JSON.parse(atob(shareString))

    // 验证模板数据
    if (!templateData.name || !templateData.colors || !templateData.layout || !templateData.typography) {
      throw new Error("无效的模板数据")
    }

    return templateData as ReportTemplate
  } catch (error) {
    console.error("模板反序列化错误:", error)
    return null
  }
}
