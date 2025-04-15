interface ProductCardProps {
  title: string
  description: string
  status: "在线" | "离线" | "高线"
  tags: string[]
}

export function ProductCard({ title, description, status, tags }: ProductCardProps) {
  // 根据状态确定颜色
  const getStatusColor = () => {
    switch (status) {
      case "在线":
        return "bg-blue-100 text-blue-800"
      case "离线":
        return "bg-gray-100 text-gray-800"
      case "高线":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden border rounded-lg shadow-sm bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor()}`}>{status}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-4">{description}</p>
      </div>
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > 0 && <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">+1</span>}
        </div>
      </div>
      <div className="p-4 text-right border-t">
        <a href="#" className="text-xs text-gray-500 flex items-center justify-end">
          点击查看接入方式
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  )
}
