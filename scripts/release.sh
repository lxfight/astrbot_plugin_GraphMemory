#!/bin/bash
# WebUI 构建和发布脚本

set -e

echo "🚀 开始构建 WebUI..."

# 1. 进入前端目录
cd "$(dirname "$0")/../webui-src"

# 2. 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 3. 构建
echo "🔨 构建中..."
npm run build

# 4. 返回插件根目录
cd ..

# 5. 检查是否有变更
if git diff --quiet resources/; then
    echo "✅ 没有变更，无需提交"
    exit 0
fi

# 6. 提交构建产物
echo "📝 提交构建产物..."
git add resources/
git commit -m "chore: update WebUI build $(date +%Y-%m-%d)"

# 7. 询问是否推送
read -p "是否推送到远程仓库？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    echo "✅ 已推送到远程仓库"
fi

# 8. 询问是否创建 Release
read -p "是否创建新版本标签？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "请输入版本号 (例如 v1.0.0): " version
    git tag "$version"
    git push origin "$version"
    echo "✅ 已创建标签: $version"
    echo "📦 请在 GitHub 上创建 Release: https://github.com/lxfight/astrbot_plugin_GraphMemory/releases/new?tag=$version"
fi

echo "🎉 完成！"