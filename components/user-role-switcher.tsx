"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

export function UserRoleSwitcher() {
  const { currentUser, availableUsers, switchUser, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  if (!currentUser) {
    return (
      <Button variant="outline" onClick={() => switchUser("1")}>
        登录
      </Button>
    )
  }

  // 获取角色名称
  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "管理员"
      case "manager":
        return "项目经理"
      case "developer":
        return "开发人员"
      case "viewer":
        return "访客"
      default:
        return role
    }
  }

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "developer":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{currentUser.name}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getRoleColor(currentUser.role)}`}>
            {getRoleName(currentUser.role)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{currentUser.name}</span>
            <span className="text-xs text-gray-500">{currentUser.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>切换角色</DropdownMenuLabel>
        {availableUsers.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => {
              switchUser(user.id)
              setIsOpen(false)
            }}
            className={currentUser.id === user.id ? "bg-gray-100" : ""}
          >
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
              <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                {getRoleName(user.role)}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
