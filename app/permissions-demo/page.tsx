import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/app-layout"

export default function PermissionsDemoPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">角色权限演示</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>角色说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-red-600">管理员</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    拥有所有权限，可以访问所有页面和功能，包括系统设置、用户管理和权限配置。
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-blue-600">项目经理</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    可以管理项目、查看报表、管理团队和设置目标，但无法访问系统设置。
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-green-600">开发人员</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    可以查看项目、更新任务、查看团队和个人目标，但无法管理项目或查看高级报表。
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <h3 className="font-medium text-gray-600">访客</h3>
                  <p className="text-sm text-gray-600 mt-1">只能查看仪表盘和公开报表，无法访问其他功能。</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">使用右上角的用户切换器可以切换不同的用户角色，体验不同角色的导航权限。</p>

                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">导航项权限</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    导航项旁边的小锁图标表示该项需要特定权限才能访问。不同角色可见的导航项不同。
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-md">
                  <h3 className="font-medium text-amber-800">管理员特权</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    管理员可以通过点击导航栏中的盾牌图标切换"显示所有项目"模式，查看所有导航项（包括无权访问的项目）。
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-800">编辑权限</h3>
                  <p className="text-sm text-green-700 mt-1">
                    只有管理员和项目经理可以编辑导航结构。其他角色无法看到编辑按钮。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
