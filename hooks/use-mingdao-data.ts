import useSWR from "swr"

interface MingdaoDataOptions {
  page?: number
  pageSize?: number
  search?: string
  filters?: Record<string, any>
  sort?: { field: string; order: "asc" | "desc" }
}

export function useMingdaoData(worksheetId: string, options: MingdaoDataOptions = {}) {
  const { page = 1, pageSize = 10, search = "", filters = {}, sort } = options

  // 构建查询参数
  const queryParams = new URLSearchParams()
  queryParams.append("page", page.toString())
  queryParams.append("page_size", pageSize.toString())

  if (search) {
    queryParams.append("search", search)
  }

  if (Object.keys(filters).length > 0) {
    queryParams.append("filters", JSON.stringify(filters))
  }

  if (sort) {
    queryParams.append("sort_field", sort.field)
    queryParams.append("sort_order", sort.order)
  }

  // 构建API URL
  const apiUrl = `/api/mingdao/worksheets/${worksheetId}/records?${queryParams.toString()}`

  // 使用SWR进行数据获取和缓存
  const fetcher = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "API请求失败")
    }
    return response.json()
  }

  const { data, error, mutate } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0, // 不自动刷新
  })

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
    error,
  }
}
