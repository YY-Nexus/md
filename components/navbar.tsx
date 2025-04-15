"use client"

import Link from "next/link"
import { Book, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // 移除 useUser hook 和相关状态

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">电子图书馆</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              首页
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              仪表板
            </Link>
            <Link href="/books" className="text-gray-700 hover:text-blue-600 transition-colors">
              图书馆
            </Link>

            {/* 替换 Clerk 组件为普通按钮 */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              登录
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/dashboard"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              仪表板
            </Link>
            <Link
              href="/books"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              图书馆
            </Link>

            <div className="pt-2">
              {/* 替换 Clerk 组件为普通按钮 */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                登录
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
