import type { MaskingRule, SensitiveDataType } from "@/types/data-security"
import { permissionService } from "./permission-service"

export class DataMaskingService {
  private rules: Map<SensitiveDataType, MaskingRule> = new Map()

  constructor() {
    // 初始化默认脱敏规则
    this.initDefaultRules()
  }

  // 初始化默认脱敏规则
  private initDefaultRules(): void {
    // 身份证号码脱敏规则
    this.addRule({
      dataType: "personal_id",
      strategy: "partial",
      customMask: (value) => {
        if (value.length >= 18) {
          // 中国身份证号
          return value.substring(0, 6) + "********" + value.substring(14)
        } else if (value.length >= 9) {
          // 其他ID
          return value.substring(0, 3) + "****" + value.substring(value.length - 3)
        }
        return "******"
      },
      exemptPermissions: ["user:manage"],
    })

    // 手机号脱敏规则
    this.addRule({
      dataType: "phone",
      strategy: "partial",
      customMask: (value) => {
        if (value.length >= 11) {
          return value.substring(0, 3) + "****" + value.substring(value.length - 4)
        }
        return "******"
      },
      exemptPermissions: ["user:manage"],
    })

    // 邮箱脱敏规则
    this.addRule({
      dataType: "email",
      strategy: "partial",
      customMask: (value) => {
        const parts = value.split("@")
        if (parts.length === 2) {
          const name = parts[0]
          const domain = parts[1]
          let maskedName = name
          if (name.length > 2) {
            maskedName = name.substring(0, 2) + "****"
          } else {
            maskedName = "*".repeat(name.length)
          }
          return `${maskedName}@${domain}`
        }
        return value
      },
      exemptPermissions: ["user:manage"],
    })

    // 地址脱敏规则
    this.addRule({
      dataType: "address",
      strategy: "partial",
      customMask: (value) => {
        if (value.length > 6) {
          return value.substring(0, 6) + "****"
        }
        return value
      },
      exemptPermissions: ["user:manage"],
    })

    // 金融信息脱敏规则
    this.addRule({
      dataType: "financial",
      strategy: "partial",
      customMask: (value) => {
        if (/^\d+$/.test(value) && value.length > 4) {
          // 银行卡号等纯数字
          return "****" + value.substring(value.length - 4)
        }
        return "******"
      },
      exemptPermissions: ["financial:manage"],
    })

    // 密码脱敏规则
    this.addRule({
      dataType: "password",
      strategy: "full",
      customMask: () => "******",
      exemptPermissions: [], // 密码不应该有豁免权限
    })

    // API密钥脱敏规则
    this.addRule({
      dataType: "api_key",
      strategy: "partial",
      customMask: (value) => {
        if (value.length > 8) {
          return value.substring(0, 4) + "****" + value.substring(value.length - 4)
        }
        return "******"
      },
      exemptPermissions: ["setting:manage"],
    })
  }

  // 添加脱敏规则
  addRule(rule: MaskingRule): void {
    this.rules.set(rule.dataType, rule)
  }

  // 获取脱敏规则
  getRule(dataType: SensitiveDataType): MaskingRule | undefined {
    return this.rules.get(dataType)
  }

  // 应用脱敏规则
  async maskData(value: string, dataType: SensitiveDataType, userId?: string): Promise<string> {
    // 如果值为空，直接返回
    if (!value) return value

    // 获取脱敏规则
    const rule = this.getRule(dataType)
    if (!rule) return value

    // 如果有用户ID和豁免权限，检查用户是否有豁免权限
    if (userId && rule.exemptPermissions && rule.exemptPermissions.length > 0) {
      let hasExemption = false
      for (const permission of rule.exemptPermissions) {
        const [resource, action] = permission.split(":")
        const result = await permissionService.hasPermission(userId, resource as any, action as any)
        if (result.granted) {
          hasExemption = true
          break
        }
      }

      // 如果用户有豁免权限，返回原始值
      if (hasExemption) {
        return value
      }
    }

    // 应用脱敏策略
    switch (rule.strategy) {
      case "full":
        return "******"
      case "partial":
        if (rule.customMask) {
          return rule.customMask(value)
        }
        // 默认部分脱敏
        if (value.length <= 4) {
          return "****"
        }
        return value.substring(0, 2) + "****" + value.substring(value.length - 2)
      case "hash":
        // 简单哈希，实际应用中可能需要更复杂的哈希算法
        return this.simpleHash(value)
      case "truncate":
        return value.substring(0, 4) + "..."
      case "custom":
        if (rule.customMask) {
          return rule.customMask(value)
        }
        return value
      default:
        return value
    }
  }

  // 简单哈希函数（仅用于演示）
  private simpleHash(value: string): string {
    let hash = 0
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 转换为32位整数
    }
    return hash.toString(16).padStart(8, "0")
  }

  // 批量脱敏对象中的敏感字段
  async maskObject<T extends Record<string, any>>(
    obj: T,
    fieldMappings: Record<keyof T, SensitiveDataType>,
    userId?: string,
  ): Promise<T> {
    const result = { ...obj }

    for (const [field, dataType] of Object.entries(fieldMappings)) {
      if (result[field]) {
        result[field] = await this.maskData(result[field], dataType, userId)
      }
    }

    return result
  }
}

// 导出单例实例
export const dataMaskingService = new DataMaskingService()
