import { FolderTree, HardDrive, Terminal, Clock } from "lucide-react"

export default function NextjsProjectManagement() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">Next.js项目管理最佳实践</h2>
        <p className="mt-2 opacity-90">不删除项目的高效管理与空间优化策略</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <FolderTree className="mr-2 text-blue-600" size={20} />
              <h3 className="font-semibold text-lg">项目组织与分类</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">创建一个结构化的项目目录系统，帮助您清晰地管理多个Next.js项目：</p>

            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              ~/Projects/ ├── active/ # 活跃开发中的项目 ├── archived/ # 已完成但可能会重用的项目 ├── learning/ #
              学习和实验性项目 └── client-projects/ # 按客户名分类的项目
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-gray-700">创建这个结构的命令：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                mkdir -p ~/Projects/{"{"} active,archived,learning,client-projects {"}"}
              </div>

              <p className="text-gray-700 mt-2">将现有项目移动到对应目录：</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                # 例如，将一个项目移动到archived目录 mv ~/Projects/my-nextjs-app ~/Projects/archived/
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <HardDrive className="mr-2 text-green-600" size={20} />
              <h3 className="font-semibold text-lg">空间优化技术</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">对不活跃项目进行空间优化，而不是完全删除它们：</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="border rounded p-3">
                <h4 className="font-medium text-gray-800 mb-2">1. 清理非活跃项目的依赖</h4>
                <div className="bg-gray-100 p-2 rounded-md font-mono text-sm mb-2">
                  # 创建清理脚本 echo '#!/bin/bash rm -rf node_modules rm -rf .next echo "dependencies:" {">"}{" "}
                  package.json.bak ' {">"} ~/Projects/clean-project.sh chmod +x ~/Projects/clean-project.sh
                </div>
                <p className="text-xs text-gray-600">此脚本删除node_modules和构建文件，但保留项目代码和结构</p>
              </div>

              <div className="border rounded p-3">
                <h4 className="font-medium text-gray-800 mb-2">2. 项目压缩存档</h4>
                <div className="bg-gray-100 p-2 rounded-md font-mono text-sm mb-2">
                  # 压缩不活跃项目 tar -czf my-project.tar.gz -C ~/Projects/archived my-nextjs-app
                  --exclude="node_modules" --exclude=".next" # 压缩后可以删除原目录 rm -rf
                  ~/Projects/archived/my-nextjs-app
                </div>
                <p className="text-xs text-gray-600">将不活跃项目压缩为tar.gz文件，排除大型依赖目录，大幅节省空间</p>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-medium text-gray-800 mb-2">3. 创建项目恢复脚本</h4>
              <div className="bg-gray-100 p-2 rounded-md font-mono text-sm">
                # 创建恢复脚本 echo '#!/bin/bash # 用法: ./restore-project.sh my-project.tar.gz [目标目录] if [ -z "$1"
                ]; then echo "请指定项目压缩包" exit 1 fi PROJECT=$(basename "$1" .tar.gz) TARGET=${"{"}{" "}
                2:-~/Projects/active/$PROJECT {"}"}
                mkdir -p "$TARGET" tar -xzf "$1" -C "$TARGET" --strip-components=1 cd "$TARGET" && npm install echo
                "项目已恢复到: $TARGET" ' {">"} ~/Projects/restore-project.sh chmod +x ~/Projects/restore-project.sh
              </div>
              <p className="text-xs text-gray-600 mt-1">当需要重新使用项目时，此脚本可以从压缩包恢复项目并安装依赖</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Terminal className="mr-2 text-purple-600" size={20} />
              <h3 className="font-semibold text-lg">项目管理命令别名</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">创建便捷的命令别名，简化Next.js项目的日常管理：</p>

            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 编辑~/.zshrc或~/.bashrc nano ~/.zshrc # 添加以下别名和函数 # Next.js项目管理别名 alias nxclean='rm -rf
              node_modules .next && echo "已清理node_modules和.next目录"' alias nxinstall='npm install && echo
              "依赖安装完成"' alias nxrefresh='nxclean && nxinstall' # 项目导航函数 nxprojects() {"{"}
              cd ~/Projects/$1 && ls -la
              {"}"}# 项目压缩函数 nxarchive() {"{"}
              if [ -z "$1" ]; then echo "用法: nxarchive 项目目录 [目标文件名]" return 1 fi SRC=$(realpath "$1")
              PROJECT=$(basename "$SRC") TARGET=${"{"} 2:-"$PROJECT.tar.gz" {"}"}
              tar -czf "$TARGET" -C "$(dirname "$SRC")" "$PROJECT" --exclude="node_modules" --exclude=".next" echo
              "已创建压缩包: $TARGET"
              {"}"}# 保存并应用更改 source ~/.zshrc
            </div>

            <div className="mt-3">
              <h4 className="font-medium text-gray-700">使用这些别名：</h4>
              <div className="space-y-2 mt-1">
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">nxclean</code> -
                  清理当前项目的node_modules和.next目录
                </p>
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">nxrefresh</code> - 清理并重新安装依赖
                </p>
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">nxprojects active</code> - 快速导航到活跃项目目录
                </p>
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">nxarchive my-project</code> - 创建项目的压缩归档
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex items-center">
              <Clock className="mr-2 text-amber-600" size={20} />
              <h3 className="font-semibold text-lg">项目元数据跟踪</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-gray-700">
              创建一个简单的项目跟踪系统，记录项目元数据，帮助您记住每个项目的用途和状态：
            </p>

            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              # 创建项目跟踪脚本 echo '#!/bin/bash PROJECTS_DB=~/Projects/projects.json # 确保数据库文件存在 if [ ! -f
              "$PROJECTS_DB" ]; then echo "[]" {">"} "$PROJECTS_DB" fi case "$1" in add) # 添加项目:
              ./project-tracker.sh add 项目路径 "项目描述" "状态" path=$(realpath "$2") name=$(basename "$path")
              desc="$3" status="${"{"} 4:-inactive {"}"}" date=$(date +"%Y-%m-%d") # 使用临时文件添加项目信息
              tmp=$(mktemp) jq --arg name "$name" \ --arg path "$path" \ --arg desc "$desc" \ --arg status "$status" \
              --arg date "$date" \ ". + [{"{"}name: \$name, path: \$path, description: \$desc, status: \$status,
              last_updated: \$date{"}"}]" \ "$PROJECTS_DB" {">"} "$tmp" && mv "$tmp" "$PROJECTS_DB" echo "添加了项目:
              $name" ;; list) # 列出项目: ./project-tracker.sh list [状态] status="$2" if [ -z "$status" ]; then jq -r
              ".[] | \"\\(.name) (\\(.status)) - \\(.description) - \\(.path)\"" "$PROJECTS_DB" | sort else jq -r ".[] |
              select(.status == \"$status\") | \"\\(.name) - \\(.description) - \\(.path)\"" "$PROJECTS_DB" | sort fi ;;
              update) # 更新项目状态: ./project-tracker.sh update 项目名 状态 name="$2" status="$3" date=$(date
              +"%Y-%m-%d") tmp=$(mktemp) jq --arg name "$name" \ --arg status "$status" \ --arg date "$date" \ "map(if
              .name == \$name then .status = \$status | .last_updated = \$date else . end)" \ "$PROJECTS_DB" {">"}{" "}
              "$tmp" && mv "$tmp" "$PROJECTS_DB" echo "更新了项目状态: $name -{">"} $status" ;; *) echo "用法:" echo "
              $0 add 项目路径 \"项目描述\" [状态]" echo " $0 list [状态]" echo " $0 update 项目名 状态" ;; esac ' {">"}{" "}
              ~/Projects/project-tracker.sh chmod +x ~/Projects/project-tracker.sh
            </div>

            <div className="mt-3">
              <h4 className="font-medium text-gray-700">使用项目跟踪器：</h4>
              <div className="space-y-2 mt-1">
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    ~/Projects/project-tracker.sh add ~/Projects/my-nextjs-app "我的电商项目" "active"
                  </code>
                  <br />
                  添加项目到跟踪系统
                </p>
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">~/Projects/project-tracker.sh list</code>
                  <br />
                  列出所有项目
                </p>

                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">~/Projects/project-tracker.sh list active</code>
                  <br />
                  列出所有活跃项目
                </p>
                <p className="text-sm">
                  <code className="bg-gray-100 px-1 py-0.5 rounded">
                    ~/Projects/project-tracker.sh update my-nextjs-app archived
                  </code>
                  <br />
                  更新项目状态为已归档
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-3">
              <p className="text-sm text-blue-700">
                <strong>提示：</strong> 此脚本需要安装jq工具来处理JSON。可以通过
                <code className="px-1 py-0.5 bg-blue-100 rounded">brew install jq</code>（Mac）安装。
                如果您熟悉Node.js，也可以创建一个Node.js版本的跟踪器，它可能更适合管理Next.js项目。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
