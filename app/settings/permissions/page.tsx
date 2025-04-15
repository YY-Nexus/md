"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { useUser, type UserRole, type PermissionGroup } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Edit, Plus, Save, Shield, Trash2, Users, XCircle } from "lucide-react"

export default function PermissionsPage() {
  const {
    currentUser,
    availableUsers,
    permissionGroups,
    addPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
    getAllPermissions,
    getUserPermissions,
    updateUserPermissions,
    updateUserRole,
    hasPermission,
  } = useUser()

  const [activeTab, setActiveTab] = useState("users")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<UserRole>("viewer")
  const [isEditingUser, setIsEditingUser] = useState(false)

  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [isEditingGroup, setIsEditingGroup] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [newGroup, setNewGroup] = useState<Omit<PermissionGroup, "id">>({
    name: "",
    description: "",
    permissions: [],
    parentGroups: [],
  })

  // 检查当前用户是否有权限访问此页面
  if (!currentUser || !hasPermission("manage_users")) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>权限不足</CardTitle>
              <CardDescription>您没有权限访问此页面</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <XCircle className="mx-auto h-12 w-12 text-red-500" />
                  <h3 className="mt-2 text-lg font-medium">访问被拒绝</h3>
                  <p className="mt-1 text-sm text-gray-500">您需要管理员权限才能访问权限管理页面。</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // 获取所有可用权限
  const allPermissions = getAllPermissions()

  // 选择用户
  const handleSelectUser = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId)
    if (user) {
      setSelectedUserId(userId)
      setSelectedPermissions(getUserPermissions(userId))
      setSelectedRole(user.role)
      setIsEditingUser(false)
    }
  }

  // 保存用户权限
  const handleSaveUserPermissions = () => {
    if (selectedUserId) {
      updateUserPermissions(selectedUserId, selectedPermissions)
      updateUserRole(selectedUserId, selectedRole)
      setIsEditingUser(false)
    }
  }

  // 选择权限组
  const handleSelectGroup = (groupId: string) => {
    const group = permissionGroups.find((g) => g.id === groupId)
    if (group) {
      setSelectedGroupId(groupId)
      setNewGroup({
        name: group.name,
        description: group.description,
        permissions: [...group.permissions],
        parentGroups: group.parentGroups ? [...group.parentGroups] : [],
      })
      setIsEditingGroup(true)
    }
  }

  // 保存权限组
  const handleSaveGroup = () => {
    if (isEditingGroup && selectedGroupId) {
      updatePermissionGroup(selectedGroupId, newGroup)
      setIsEditingGroup(false)
      setSelectedGroupId(null)
    } else if (isAddingGroup) {
      addPermissionGroup(newGroup)
      setIsAddingGroup(false)
    }

    // 重置表单
    setNewGroup({
      name: "",
      description: "",
      permissions: [],
      parentGroups: [],
    })
  }

  // 删除权限组
  const handleDeleteGroup = (groupId: string) => {
    if (confirm("确定要删除此权限组吗？")) {
      deletePermissionGroup(groupId)
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null)
        setIsEditingGroup(false)
      }
    }
  }

  // 获取角色名称
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "管理员"
      case "manager":
        return "项目经理"
      case "developer":
        return "开发人员"
      case "viewer":
        return "访客"
      case "marketing":
        return "营销专员"
      case "hr":
        return "人力资源"
      default:
        return role
    }
  }

  // 获取角色颜色
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "developer":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      case "marketing":
        return "bg-purple-100 text-purple-800"
      case "hr":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-6">权限管理</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              用户权限
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Shield className="h-4 w-4 mr-2" />
              权限组
            </TabsTrigger>
          </TabsList>

          {/* 用户权限标签页 */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 用户列表 */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>用户列表</CardTitle>
                  <CardDescription>选择用户查看和编辑权限</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                          selectedUserId === user.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{user.name}</div>
                          <Badge className={getRoleColor(user.role)}>{getRoleName(user.role)}</Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 用户权限详情 */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>权限详情</CardTitle>
                      <CardDescription>
                        {selectedUserId
                          ? `管理 ${availableUsers.find((u) => u.id === selectedUserId)?.name} 的权限`
                          : "选择用户查看权限详情"}
                      </CardDescription>
                    </div>
                    {selectedUserId && (
                      <Button
                        variant={isEditingUser ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsEditingUser(!isEditingUser)}
                        disabled={selectedUserId === currentUser?.id} // 不能编辑自己的权限
                      >
                        {isEditingUser ? (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            完成
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedUserId ? (
                    <div className="space-y-6">
                      {/* 用户角色 */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">用户角色</h3>
                        {isEditingUser ? (
                          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择角色" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">管理员</SelectItem>
                              <SelectItem value="manager">项目经理</SelectItem>
                              <SelectItem value="developer">开发人员</SelectItem>
                              <SelectItem value="viewer">访客</SelectItem>
                              <SelectItem value="marketing">营销专员</SelectItem>
                              <SelectItem value="hr">人力资源</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getRoleColor(selectedRole)}>{getRoleName(selectedRole)}</Badge>
                        )}
                      </div>

                      {/* 权限列表 */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">权限列表</h3>
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>权限名称</TableHead>
                                <TableHead>来源</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allPermissions.map((permission) => {
                                const hasPermission = selectedPermissions.includes(permission)
                                return (
                                  <TableRow key={permission}>
                                    <TableCell>
                                      {isEditingUser ? (
                                        <Checkbox
                                          checked={hasPermission}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedPermissions([...selectedPermissions, permission])
                                            } else {
                                              setSelectedPermissions(
                                                selectedPermissions.filter((p) => p !== permission),
                                              )
                                            }
                                          }}
                                        />
                                      ) : (
                                        <div className="flex justify-center">
                                          {hasPermission ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                          ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                          )}
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell>{permission}</TableCell>
                                    <TableCell>
                                      {selectedRole === "admin" && permission === "admin" ? (
                                        <Badge variant="outline">角色</Badge>
                                      ) : (
                                        <Badge variant="outline">{selectedRole === "admin" ? "继承" : "角色"}</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6">
                      <div className="text-center">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">未选择用户</h3>
                        <p className="mt-1 text-sm text-gray-500">请从左侧列表选择一个用户来查看和管理权限</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                {selectedUserId && isEditingUser && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditingUser(false)}>
                      取消
                    </Button>
                    <Button onClick={handleSaveUserPermissions}>保存更改</Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* 权限组标签页 */}
          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 权限组列表 */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>权限组</CardTitle>
                      <CardDescription>管理权限组和继承关系</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingGroup(true)
                        setIsEditingGroup(false)
                        setSelectedGroupId(null)
                        setNewGroup({
                          name: "",
                          description: "",
                          permissions: [],
                          parentGroups: [],
                        })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      添加
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {permissionGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-3 border rounded-md hover:bg-gray-50 ${
                          selectedGroupId === group.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium cursor-pointer" onClick={() => handleSelectGroup(group.id)}>
                            {group.name}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleSelectGroup(group.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{group.description}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {group.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {group.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                        {group.parentGroups && group.parentGroups.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            继承自:{" "}
                            {group.parentGroups
                              .map((id) => {
                                const parent = permissionGroups.find((g) => g.id === id)
                                return parent ? parent.name : id
                              })
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 权限组详情 */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{isAddingGroup ? "添加权限组" : isEditingGroup ? "编辑权限组" : "权限组详情"}</CardTitle>
                  <CardDescription>
                    {isAddingGroup || isEditingGroup ? "填写权限组信息并选择权限" : "选择一个权限组进行编辑"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isAddingGroup || isEditingGroup ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="group-name">权限组名称</Label>
                          <Input
                            id="group-name"
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                            placeholder="输入权限组名称"
                          />
                        </div>
                        <div>
                          <Label htmlFor="group-description">描述</Label>
                          <Input
                            id="group-description"
                            value={newGroup.description}
                            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                            placeholder="输入权限组描述"
                          />
                        </div>
                        <div>
                          <Label>父权限组（继承权限）</Label>
                          <div className="border rounded-md p-3 mt-1 max-h-40 overflow-y-auto">
                            <div className="space-y-2">
                              {permissionGroups
                                .filter((g) => g.id !== selectedGroupId) // 排除自己
                                .map((group) => (
                                  <div key={group.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`parent-${group.id}`}
                                      checked={(newGroup.parentGroups || []).includes(group.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setNewGroup({
                                            ...newGroup,
                                            parentGroups: [...(newGroup.parentGroups || []), group.id],
                                          })
                                        } else {
                                          setNewGroup({
                                            ...newGroup,
                                            parentGroups: (newGroup.parentGroups || []).filter((id) => id !== group.id),
                                          })
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`parent-${group.id}`}>{group.name}</Label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>权限</Label>
                          <div className="border rounded-md p-3 mt-1 max-h-60 overflow-y-auto">
                            <div className="space-y-2">
                              {allPermissions.map((permission) => (
                                <div key={permission} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`permission-${permission}`}
                                    checked={newGroup.permissions.includes(permission)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setNewGroup({
                                          ...newGroup,
                                          permissions: [...newGroup.permissions, permission],
                                        })
                                      } else {
                                        setNewGroup({
                                          ...newGroup,
                                          permissions: newGroup.permissions.filter((p) => p !== permission),
                                        })
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`permission-${permission}`}>{permission}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6">
                      <div className="text-center">
                        <Shield className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">未选择权限组</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          请从左侧列表选择一个权限组进行编辑，或点击添加按钮创建新的权限组
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                {(isAddingGroup || isEditingGroup) && (
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingGroup(false)
                        setIsEditingGroup(false)
                        setSelectedGroupId(null)
                      }}
                    >
                      取消
                    </Button>
                    <Button onClick={handleSaveGroup}>{isAddingGroup ? "添加" : "保存"}</Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
