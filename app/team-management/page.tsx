import { TeamManagementReport } from "@/components/team-management-report"
import { TemplateProvider } from "@/contexts/template-context"
import { AppLayout } from "@/components/app-layout"

export default function TeamManagementPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">团队管理智能报告</h1>

        <div className="mb-8">
          <TemplateProvider>
            <TeamManagementReport teamId="team_123" />
          </TemplateProvider>
        </div>
      </div>
    </AppLayout>
  )
}
