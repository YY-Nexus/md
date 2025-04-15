import type { Permission } from "./permission"

// 敏感数据类型
export type SensitiveDataType =
  | "personal_id"
  | "phone"
  | "email"
  | "address"
  | "financial"
  | "health"
  | "password"
  | "api_key"

// 脱敏策略
export type MaskingStrategy =
  | "full" // 完全隐藏，如 ******
  | "partial" // 部分隐藏，如 138****1234
  | "hash" // 哈希处理
  | "truncate" // 截断，只显示前几位
  | "custom" // 自定义处理

// 脱敏规则
export interface MaskingRule {
  dataType: SensitiveDataType
  strategy: MaskingStrategy
  pattern?: RegExp // 匹配模式（可选）
  customMask?: (value: string) => string // 自定义脱敏函数（可选）
  exemptPermissions?: Permission[] // 豁免权限（拥有这些权限的用户可以看到原始数据）
}

// 字段访问控制
export interface FieldAccessControl {
  field: string
  resource: string
  requiredPermissions: Permission[]
  maskingRule?: MaskingRule
}

// 行访问控制条件类型
export type RowConditionOperator = "eq" | "neq" | "gt" | "lt" | "contains" | "startsWith" | "endsWith"

// 行访问控制条件
export interface RowCondition {
  field: string
  operator: RowConditionOperator
  value: string | number | boolean
}

// 行访问控制规则
export interface RowAccessControl {
  resource: string
  conditions: RowCondition[]
  requiredPermissions: Permission[]
  description?: string
}

// 数据访问策略
export interface DataAccessPolicy {
  id: string
  name: string
  description: string
  fieldRules: FieldAccessControl[]
  rowRules: RowAccessControl[]
  isActive: boolean
}
