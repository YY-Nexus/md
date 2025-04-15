"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function MingdaoForm() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 使用实际的控件 ID
      const controls = [
        {
          controlId: "实际的控件ID1", // 替换为实际的控件ID
          value: name
        },
        {
          controlId: "实际的控件ID2", // 替换为实际的控件ID
          value: age
        }
      ]

      const response = await fetch('/api/mingdao/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worksheetId: "实际的工作表ID", // 替换为实际的工作表ID
          controls
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('记录添加成功！')
        setName('')
        setAge('')
      } else {
        toast.error(`添加失败: ${data.error || '未知错误'}`)
      }
    } catch (error) {
      toast.error(`请求错误: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>添加人员记录</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">姓名</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="age" className="text-sm font-medium">年龄</label>
            <Input
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="请输入年龄"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '提交中...' : '添加记录'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
