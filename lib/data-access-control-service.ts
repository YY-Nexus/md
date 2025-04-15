import type { FieldAccessControl, RowAccessControl, RowCondition, DataAccessPolicy } from "@/types/data-security"
import { permissionService } from "./permission-service"
import { dataMaskingService } from "./data-masking-service"

export class DataAccessControlService {
  private policies: DataAccessPolicy[] = []

  constructor() {
    // 初始化默认策略
    this.initDefaultPolicies()
  }

  // 初始化默认访问控制策略
  private initDefaultPolicies(): void {
    // 用户数据访问策略
    this.addPolicy({
      id: "user_data_policy",
      name: "用户数据访问策略",
      description: "控制用户数据的访问权限",
      fieldRules: [
        {
          field: "email",
          resource: "user",
          requiredPermissions: ["user:read"],
          maskingRule: {
            dataType: "email",
            strategy: "partial",
            exemptPermissions: ["user:manage"],
          },
        },
        {
          field: "phone",
          resource: "user",
          requiredPermissions: ["user:read"],
          maskingRule: {
            dataType: "phone",
            strategy: "partial",
            exemptPermissions: ["user:manage"],
          },
        },
        {
          field: "address",
          resource: "user",
          requiredPermissions: ["user:manage"],
          maskingRule: {
            dataType: "address",
            strategy: "partial",
            exemptPermissions: ["user:manage"],
          },
        },
      ],
      rowRules: [
        {
          resource: "user",
          conditions: [
            {
              field: "department",
              operator: "eq",
              value: "{user.department}",
            },
          ],
          requiredPermissions: ["user:read"],
          description: "用户只能查看自己部门的用户",
        },
      ],
      isActive: true,
    })

    // 报表数据访问策略
    this.addPolicy({
      id: "report_data_policy",
      name: "报表数据访问策略",
      description: "控制报表数据的访问权限",
      fieldRules: [
        {
          field: "financial_data",
          resource: "report",
          requiredPermissions: ["report:read", "financial:read"],
          maskingRule: {
            dataType: "financial",
            strategy: "partial",
            exemptPermissions: ["financial:manage"],
          },
        },
      ],
      rowRules: [
        {
          resource: "report",
          conditions: [
            {
              field: "department",
              operator: "eq",
              value: "{user.department}",
            },
          ],
          requiredPermissions: ["report:read"],
          description: "用户只能查看自己部门的报表",
        },
      ],
      isActive: true,
    })
  }

  // 添加访问控制策略
  addPolicy(policy: DataAccessPolicy): void {
    // 检查是否已存在相同ID的策略
    const existingIndex = this.policies.findIndex((p) => p.id === policy.id)
    if (existingIndex >= 0) {
      // 更新现有策略
      this.policies[existingIndex] = policy
    } else {
      // 添加新策略
      this.policies.push(policy)
    }
  }

  // 获取所有活跃的策略
  getActivePolicies(): DataAccessPolicy[] {
    return this.policies.filter((policy) => policy.isActive)
  }

  // 获取特定资源的字段访问控制规则
  getFieldRules(resource: string): FieldAccessControl[] {
    const rules: FieldAccessControl[] = []
    for (const policy of this.getActivePolicies()) {
      for (const rule of policy.fieldRules) {
        if (rule.resource === resource) {
          rules.push(rule)
        }
      }
    }
    return rules
  }

  // 获取特定资源的行访问控制规则
  getRowRules(resource: string): RowAccessControl[] {
    const rules: RowAccessControl[] = []
    for (const policy of this.getActivePolicies()) {
      for (const rule of policy.rowRules) {
        if (rule.resource === resource) {
          rules.push(rule)
        }
      }
    }
    return rules
  }

  // 评估行条件
  private evaluateCondition(
    condition: RowCondition,
    row: Record<string, any>,
    context: Record<string, any> = {},
  ): boolean {
    // 获取字段值
    let fieldValue = row[condition.field]

    // 获取条件值（支持上下文变量替换）
    let conditionValue = condition.value
    if (typeof conditionValue === "string" && conditionValue.startsWith("{") && conditionValue.endsWith("}")) {
      const contextPath = conditionValue.substring(1, conditionValue.length - 1).split(".")
      let contextValue = context
      for (const path of contextPath) {
        if (contextValue && contextValue[path] !== undefined) {
          contextValue = contextValue[path]
        } else {
          contextValue = undefined
          break
        }
      }
      conditionValue = contextValue
    }

    // 如果值类型不匹配，尝试转换
    if (typeof fieldValue !== typeof conditionValue) {
      if (typeof conditionValue === "number") {
        fieldValue = Number(fieldValue)
      } else if (typeof conditionValue === "boolean") {
        fieldValue = Boolean(fieldValue)
      } else {
        fieldValue = String(fieldValue)
        conditionValue = String(conditionValue)
      }
    }

    // 根据操作符评估条件
    switch (condition.operator) {
      case "eq":
        return fieldValue === conditionValue
      case "neq":
        return fieldValue !== conditionValue
      case "gt":
        return fieldValue > conditionValue
      case "lt":
        return fieldValue < conditionValue
      case "contains":
        return String(fieldValue).includes(String(conditionValue))
      case "startsWith":
        return String(fieldValue).startsWith(String(conditionValue))
      case "endsWith":
        return String(fieldValue).endsWith(String(conditionValue))
      default:
        return false
    }
  }

  // 检查用户是否有权限访问特定行
  async canAccessRow(
    userId: string,
    resource: string,
    row: Record<string, any>,
    context: Record<string, any> = {},
  ): Promise<boolean> {
    // 获取行访问规则
    const rowRules = this.getRowRules(resource)

    // 如果没有行规则，默认允许访问
    if (rowRules.length === 0) {
      return true
    }

    // 检查每个规则
    for (const rule of rowRules) {
      // 检查用户是否有所需权限
      let hasAllPermissions = true
      for (const permission of rule.requiredPermissions) {
        const [res, action] = permission.split(":")
        const result = await permissionService.hasPermission(userId, res as any, action as any)
        if (!result.granted) {
          hasAllPermissions = false
          break
        }
      }

      // 如果用户没有所需权限，跳过此规则
      if (!hasAllPermissions) {
        continue
      }

      // 评估所有条件
      let allConditionsMet = true
      for (const condition of rule.conditions) {
        if (!this.evaluateCondition(condition, row, context)) {
          allConditionsMet = false
          break
        }
      }

      // 如果所有条件都满足，允许访问
      if (allConditionsMet) {
        return true
      }
    }

    // 默认拒绝访问
    return false
  }

  // 过滤用户可访问的行
  async filterAccessibleRows(
    userId: string,
    resource: string,
    rows: Record<string, any>[],
    context: Record<string, any> = {},
  ): Promise<Record<string, any>[]> {
    const accessibleRows: Record<string, any>[] = []

    for (const row of rows) {
      if (await this.canAccessRow(userId, resource, row, context)) {
        accessibleRows.push(row)
      }
    }

    return accessibleRows
  }

  // 应用字段级访问控制和脱敏
  async applyFieldControls(userId: string, resource: string, data: Record<string, any>): Promise<Record<string, any>> {
    // 获取字段规则
    const fieldRules = this.getFieldRules(resource)

    // 如果没有字段规则，返回原始数据
    if (fieldRules.length === 0) {
      return data
    }

    // 创建结果对象
    const result = { ...data }

    // 应用每个字段规则
    for (const rule of fieldRules) {
      // 如果数据中没有该字段，跳过
      if (result[rule.field] === undefined) {
        continue
      }

      // 检查用户是否有所需权限
      let hasAllPermissions = true
      for (const permission of rule.requiredPermissions) {
        const [res, action] = permission.split(":")
        const permResult = await permissionService.hasPermission(userId, res as any, action as any)
        if (!permResult.granted) {
          hasAllPermissions = false
          break
        }
      }

      // 如果用户没有所需权限，删除该字段
      if (!hasAllPermissions) {
        delete result[rule.field]
        continue
      }

      // 如果有脱敏规则，应用脱敏
      if (rule.maskingRule) {
        result[rule.field] = await dataMaskingService.maskData(result[rule.field], rule.maskingRule.dataType, userId)
      }
    }

    return result
  }

  // 批量应用字段级访问控制和脱敏
  async applyFieldControlsToMany(
    userId: string,
    resource: string,
    dataArray: Record<string, any>[],
  ): Promise<Record<string, any>[]> {
    const results: Record<string, any>[] = []

    for (const data of dataArray) {
      results.push(await this.applyFieldControls(userId, resource, data))
    }

    return results
  }

  // 完整的数据访问控制处理（行级 + 字段级）
  async processData(
    userId: string,
    resource: string,
    dataArray: Record<string, any>[],
    context: Record<string, any> = {},
  ): Promise<Record<string, any>[]> {
    // 首先应用行级访问控制
    const accessibleRows = await this.filterAccessibleRows(userId, resource, dataArray, context)

    // 然后应用字段级访问控制和脱敏
    return this.applyFieldControlsToMany(userId, resource, accessibleRows)
  }
}

// 导出单例实例
export const dataAccessControlService = new DataAccessControlService()
