import type { ReportTemplate } from "./report-templates"

// 团队管理模板 - 现代智能可视化风格
export const teamManagementTemplate: ReportTemplate = {
  id: "team_management",
  name: "团队管理智能模板",
  description: "现代化智能可视化的团队管理报告模板",
  isCustom: false,
  colors: {
    primary: "#3b82f6", // 蓝色主色调
    secondary: "#10b981", // 绿色辅助色
    accent: "#8b5cf6", // 紫色强调色
    background: "#f8fafc", // 浅灰背景
    cardBackground: "#ffffff", // 白色卡片背景
    text: "#1e293b", // 深色文本
    subtext: "#64748b", // 次要文本颜色
    border: "#e2e8f0", // 边框颜色
    success: "#10b981", // 成功色
    warning: "#f59e0b", // 警告色
    danger: "#ef4444", // 危险色
    // 现代化图表配色方案
    chartColors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#f97316", "#14b8a6"],
  },
  layout: {
    spacing: "1.25rem",
    borderRadius: "0.75rem",
    cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    headerStyle: "modern",
  },
  typography: {
    titleFont: "system-ui, -apple-system, sans-serif",
    bodyFont: "system-ui, -apple-system, sans-serif",
    titleSize: "1.25rem",
    subtitleSize: "0.875rem",
    bodySize: "0.875rem",
  },
  exportSettings: {
    pageSize: "a4",
    orientation: "landscape", // 横向布局更适合团队数据可视化
    footerText: "团队管理智能分析报告 - 由明道云生成",
  },
}
