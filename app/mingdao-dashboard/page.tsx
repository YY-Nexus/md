import { MingdaoDataViewer } from "@/components/mingdao-data-viewer"
import { MingdaoDataChart } from "@/components/mingdao-data-chart"
import { MingdaoMetricsDashboard } from "@/components/mingdao-metrics-dashboard"
import { MingdaoGoalTracker } from "@/components/mingdao-goal-tracker"
import { MingdaoGoalReport } from "@/components/mingdao-goal-report"
import { MingdaoGoalAnalytics } from "@/components/mingdao-goal-analytics"
import { TemplateProvider } from "@/contexts/template-context"
import { TemplateSelector } from "@/components/template-selector"
import { TemplateManager } from "@/components/template-manager"
import { MingdaoPermissions } from "@/components/mingdao-permissions"

export default function MingdaoDashboardPage() {
  // 使用我们在模拟数据中定义的工作表 ID
  const customersWorksheetId = "customers"
  const opportunitiesWorksheetId = "opportunities"

  return (
    <TemplateProvider>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">明道云数据仪表板</h1>
          <TemplateSelector />
        </div>
        <p className="text-gray-500 mb-6">这是一个使用模拟数据的演示仪表板。在实际应用中，您需要连接到明道云 API。</p>

        {/* 添加模板管理组件 */}
        <div className="mb-8">
          <TemplateManager />
        </div>

        {/* 添加指标仪表盘 */}
        <div className="mb-8">
          <MingdaoMetricsDashboard
            customersWorksheetId={customersWorksheetId}
            opportunitiesWorksheetId={opportunitiesWorksheetId}
          />
        </div>

        {/* 添加目标跟踪组件 */}
        <div className="mb-8">
          <MingdaoGoalTracker
            customersWorksheetId={customersWorksheetId}
            opportunitiesWorksheetId={opportunitiesWorksheetId}
          />
        </div>

        {/* 添加目标报告组件 */}
        <div className="mb-8">
          <MingdaoGoalReport
            customersWorksheetId={customersWorksheetId}
            opportunitiesWorksheetId={opportunitiesWorksheetId}
          />
        </div>

        {/* 添加高级目标分析组件 */}
        <div className="mb-8">
          <MingdaoGoalAnalytics
            customersWorksheetId={customersWorksheetId}
            opportunitiesWorksheetId={opportunitiesWorksheetId}
          />
        </div>

        {/* 添加明道云数据权限组件 */}
        <div className="mb-8">
          <MingdaoPermissions
            customersWorksheetId={customersWorksheetId}
            opportunitiesWorksheetId={opportunitiesWorksheetId}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MingdaoDataChart worksheetId={customersWorksheetId} title="客户数据分析" />
          <MingdaoDataChart worksheetId={opportunitiesWorksheetId} title="商机数据分析" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <MingdaoDataViewer worksheetId={customersWorksheetId} title="客户数据" />
          <MingdaoDataViewer worksheetId={opportunitiesWorksheetId} title="商机数据" />
        </div>
      </div>
    </TemplateProvider>
  )
}
