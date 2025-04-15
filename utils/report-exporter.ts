import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import type { GoalWithHistory } from "../types/goal"
import type { ReportTemplate } from "../types/report-templates"

interface ExportReportOptions {
  title: string
  date: string
  goals: GoalWithHistory[]
  overallCompletion: number
  statusDistribution: Record<string, number>
  topPerformingGoals: GoalWithHistory[]
  atRiskGoals: GoalWithHistory[]
  categoryCompletion: Record<string, number>
  template: ReportTemplate // 添加模板参数
}

// 格式化百分比
const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`
}

// 获取类别名称
const getCategoryName = (category: string) => {
  switch (category) {
    case "revenue":
      return "收入"
    case "customers":
      return "客户"
    case "opportunities":
      return "商机"
    default:
      return "其他"
  }
}

/**
 * 导出目标报告为PDF文件
 */
export async function exportReportToPDF(options: ExportReportOptions): Promise<void> {
  const {
    title,
    date,
    goals,
    overallCompletion,
    statusDistribution,
    topPerformingGoals,
    atRiskGoals,
    categoryCompletion,
    template,
  } = options

  // 创建一个新的jsPDF实例，使用模板中的页面设置
  const doc = new jsPDF(template.exportSettings.orientation, "mm", template.exportSettings.pageSize)

  // 设置PDF文档的元数据
  doc.setProperties({
    title: `${title} - ${date}`,
    subject: "明道云业务目标跟踪系统",
    author: "明道云",
    keywords: "目标报告, 业务目标, 明道云",
    creator: "明道云目标跟踪系统",
  })

  // 设置颜色和字体
  const primaryColor = hexToRgb(template.colors.primary)
  const textColor = hexToRgb(template.colors.text)
  const subtextColor = hexToRgb(template.colors.subtext)

  // 添加标题
  doc.setFontSize(20)
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text(title, 105, 15, { align: "center" })
  doc.setFontSize(12)
  doc.setTextColor(subtextColor.r, subtextColor.g, subtextColor.b)
  doc.text(`生成日期: ${date}`, 105, 22, { align: "center" })

  // 添加总体完成率信息
  doc.setFontSize(14)
  doc.setTextColor(textColor.r, textColor.g, textColor.b)
  doc.text(`总体完成率: ${formatPercent(overallCompletion)}`, 20, 35)
  doc.text(`目标总数: ${goals.length}`, 20, 42)

  // 添加状态分布信息
  doc.text("目标状态分布:", 20, 55)
  doc.setFontSize(10)
  doc.text(`进行中: ${statusDistribution.active || 0}`, 25, 62)
  doc.text(`已完成: ${statusDistribution.completed || 0}`, 25, 68)
  doc.text(`已逾期: ${statusDistribution.overdue || 0}`, 25, 74)

  // 添加类别完成率
  doc.setFontSize(14)
  doc.text("各类别完成率:", 20, 85)
  doc.setFontSize(10)
  let yPos = 92
  Object.entries(categoryCompletion).forEach(([category, rate]) => {
    doc.text(`${getCategoryName(category)}: ${formatPercent(rate)}`, 25, yPos)
    yPos += 6
  })

  // 添加表现最佳的目标
  if (topPerformingGoals.length > 0) {
    doc.addPage()
    doc.setFontSize(14)
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.text("表现最佳的目标", 20, 20)

    let yPosition = 30
    doc.setTextColor(textColor.r, textColor.g, textColor.b)
    topPerformingGoals.forEach((goal, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${goal.name}`, 25, yPosition)
      doc.setFontSize(10)
      doc.text(`类别: ${getCategoryName(goal.category)}`, 30, yPosition + 6)
      doc.text(`完成率: ${formatPercent((goal.currentValue / goal.targetValue) * 100)}`, 30, yPosition + 12)
      doc.text(`${goal.metricType}: ${goal.currentValue} / ${goal.targetValue}`, 30, yPosition + 18)

      yPosition += 25
    })
  }

  // 添加需要关注的目标
  if (atRiskGoals.length > 0) {
    doc.setFontSize(14)
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    let yPosition = topPerformingGoals.length > 0 ? 30 + topPerformingGoals.length * 25 + 10 : 20

    // 如果页面剩余空间不足，添加新页面
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.text("需要关注的目标", 20, yPosition)

    yPosition += 10
    doc.setTextColor(textColor.r, textColor.g, textColor.b)
    atRiskGoals.forEach((goal, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${goal.name}`, 25, yPosition)
      doc.setFontSize(10)
      doc.text(`类别: ${getCategoryName(goal.category)}`, 30, yPosition + 6)
      doc.text(`完成率: ${formatPercent((goal.currentValue / goal.targetValue) * 100)}`, 30, yPosition + 12)
      doc.text(`${goal.metricType}: ${goal.currentValue} / ${goal.targetValue}`, 30, yPosition + 18)
      doc.text(`截止日期: ${new Date(goal.endDate).toLocaleDateString()}`, 30, yPosition + 24)

      yPosition += 30
    })
  }

  // 添加所有目标列表
  doc.addPage()
  doc.setFontSize(16)
  doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  doc.text("所有目标详情", 105, 15, { align: "center" })

  let yPosition = 25
  doc.setTextColor(textColor.r, textColor.g, textColor.b)
  goals.forEach((goal, index) => {
    // 如果页面剩余空间不足，添加新页面
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(12)
    doc.text(`${index + 1}. ${goal.name}`, 20, yPosition)
    doc.setFontSize(10)
    doc.text(`描述: ${goal.description}`, 25, yPosition + 6)
    doc.text(`类别: ${getCategoryName(goal.category)}`, 25, yPosition + 12)
    doc.text(
      `状态: ${goal.status === "completed" ? "已完成" : goal.status === "overdue" ? "已逾期" : "进行中"}`,
      25,
      yPosition + 18,
    )
    doc.text(`${goal.metricType}: ${goal.currentValue} / ${goal.targetValue}`, 25, yPosition + 24)
    doc.text(`完成率: ${formatPercent((goal.currentValue / goal.targetValue) * 100)}`, 25, yPosition + 30)
    doc.text(`开始日期: ${new Date(goal.startDate).toLocaleDateString()}`, 25, yPosition + 36)
    doc.text(`结束日期: ${new Date(goal.endDate).toLocaleDateString()}`, 25, yPosition + 42)

    yPosition += 50
  })

  // 添加页脚
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(subtextColor.r, subtextColor.g, subtextColor.b)
    doc.text(`第 ${i} 页，共 ${pageCount} 页`, 105, 290, { align: "center" })
    doc.text(template.exportSettings.footerText, 105, 295, { align: "center" })
  }

  // 保存PDF文件
  doc.save(`${title}_${new Date().toISOString().split("T")[0]}.pdf`)
}

/**
 * 导出图表为PDF
 */
export async function exportChartToPDF(
  chartElement: HTMLElement,
  title: string,
  template: ReportTemplate,
): Promise<void> {
  try {
    // 创建一个新的jsPDF实例
    const doc = new jsPDF(template.exportSettings.orientation, "mm", template.exportSettings.pageSize)

    // 使用html2canvas捕获图表
    const canvas = await html2canvas(chartElement, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    // 设置PDF文档的元数据
    doc.setProperties({
      title: title,
      subject: "明道云业务目标跟踪系统",
      author: "明道云",
      keywords: "目标报告, 图表, 明道云",
      creator: "明道云目标跟踪系统",
    })

    // 设置颜色
    const primaryColor = hexToRgb(template.colors.primary)
    const subtextColor = hexToRgb(template.colors.subtext)

    // 添加标题
    doc.setFontSize(16)
    doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    doc.text(title, 150, 15, { align: "center" })

    // 添加图表图像
    const imgWidth = 260
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    doc.addImage(imgData, "PNG", 20, 25, imgWidth, imgHeight)

    // 添加页脚
    doc.setFontSize(8)
    doc.setTextColor(subtextColor.r, subtextColor.g, subtextColor.b)
    doc.text(`生成日期: ${new Date().toLocaleDateString("zh-CN")}`, 150, 200, { align: "center" })
    doc.text(template.exportSettings.footerText, 150, 205, { align: "center" })

    // 保存PDF文件
    doc.save(`${title}_${new Date().toISOString().split("T")[0]}.pdf`)
  } catch (error) {
    console.error("导出图表时出错:", error)
    throw error
  }
}

// 辅助函数：将十六进制颜色转换为RGB
function hexToRgb(hex: string) {
  // 移除#前缀（如果有）
  hex = hex.replace(/^#/, "")

  // 解析RGB值
  const bigint = Number.parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}
