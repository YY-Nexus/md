"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  type ReportTemplate,
  getTemplateById,
  reportTemplates,
  serializeTemplate,
  deserializeTemplate,
} from "../types/report-templates"

interface TemplateContextType {
  currentTemplate: ReportTemplate
  templates: ReportTemplate[]
  setTemplate: (templateId: string) => void
  addTemplate: (template: ReportTemplate) => void
  updateTemplate: (template: ReportTemplate) => void
  deleteTemplate: (templateId: string) => void
  shareTemplate: (templateId: string) => string
  importTemplate: (shareString: string) => boolean
  applyTemplateStyles: (element: HTMLElement) => void
}

const STORAGE_KEY = "mingdao_custom_templates"

const TemplateContext = createContext<TemplateContextType | undefined>(undefined)

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [currentTemplate, setCurrentTemplate] = useState<ReportTemplate>(getTemplateById("default"))
  const [customTemplates, setCustomTemplates] = useState<ReportTemplate[]>([])

  // 所有模板 = 预定义模板 + 自定义模板
  const templates = [...reportTemplates, ...customTemplates]

  // 从本地存储加载自定义模板
  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem(STORAGE_KEY)
      if (storedTemplates) {
        setCustomTemplates(JSON.parse(storedTemplates))
      }
    } catch (error) {
      console.error("加载自定义模板失败:", error)
    }
  }, [])

  // 保存自定义模板到本地存储
  useEffect(() => {
    if (customTemplates.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates))
    }
  }, [customTemplates])

  const setTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId) || getTemplateById("default")
    setCurrentTemplate(template)
  }

  // 添加新模板
  const addTemplate = (template: ReportTemplate) => {
    // 确保模板有唯一ID
    const newTemplate = {
      ...template,
      id: template.id || `custom_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    }

    setCustomTemplates((prev) => [...prev, newTemplate])
  }

  // 更新现有模板
  const updateTemplate = (template: ReportTemplate) => {
    setCustomTemplates((prev) => prev.map((t) => (t.id === template.id ? { ...template, isCustom: true } : t)))
  }

  // 删除模板
  const deleteTemplate = (templateId: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId))

    // 如果删除的是当前模板，切换到默认模板
    if (currentTemplate.id === templateId) {
      setCurrentTemplate(getTemplateById("default"))
    }
  }

  // 分享模板
  const shareTemplate = (templateId: string): string => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) return ""

    return serializeTemplate(template)
  }

  // 导入模板
  const importTemplate = (shareString: string): boolean => {
    try {
      const template = deserializeTemplate(shareString)
      if (!template) return false

      // 检查是否已存在相同ID的模板
      const exists = customTemplates.some((t) => t.shareCode === template.shareCode)
      if (exists) return false

      addTemplate(template)
      return true
    } catch (error) {
      console.error("导入模板失败:", error)
      return false
    }
  }

  // 应用模板样式到DOM元素
  const applyTemplateStyles = (element: HTMLElement) => {
    if (!element) return

    // 应用背景色
    element.style.backgroundColor = currentTemplate.colors.background

    // 应用卡片样式
    const cards = element.querySelectorAll(".card")
    cards.forEach((card) => {
      const cardElement = card as HTMLElement
      cardElement.style.backgroundColor = currentTemplate.colors.cardBackground
      cardElement.style.borderRadius = currentTemplate.layout.borderRadius
      cardElement.style.boxShadow = currentTemplate.layout.cardShadow
      cardElement.style.borderColor = currentTemplate.colors.border
    })

    // 应用文本样式
    const titles = element.querySelectorAll(".card-title")
    titles.forEach((title) => {
      const titleElement = title as HTMLElement
      titleElement.style.fontFamily = currentTemplate.typography.titleFont
      titleElement.style.fontSize = currentTemplate.typography.titleSize
      titleElement.style.color = currentTemplate.colors.text
    })

    const subtitles = element.querySelectorAll(".card-description")
    subtitles.forEach((subtitle) => {
      const subtitleElement = subtitle as HTMLElement
      subtitleElement.style.fontFamily = currentTemplate.typography.bodyFont
      subtitleElement.style.fontSize = currentTemplate.typography.subtitleSize
      subtitleElement.style.color = currentTemplate.colors.subtext
    })

    // 应用其他样式...
  }

  return (
    <TemplateContext.Provider
      value={{
        currentTemplate,
        templates,
        setTemplate,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        shareTemplate,
        importTemplate,
        applyTemplateStyles,
      }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const context = useContext(TemplateContext)
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider")
  }
  return context
}
