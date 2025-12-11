#!/bin/bash
# GraphMemory WebUI 构建与发布脚本

set -e

VERSION=$1
if [ -z "$VERSION" ]; then
    echo "用法: ./build_and_release.sh <版本号>"
    echo "示例: ./build_and_release.sh v1.0.0"
    exit 1
fi

echo "🔨 开始构建 WebUI..."
cd webui-src
npm install
npm run build

echo "📦 打包构建产物..."
cd ..
mkdir -p dist
tar -czf dist/webui-${VERSION}.tar.gz resources/

echo "✅ 构建完成！"
echo "📤 请手动上传 dist/webui-${VERSION}.tar.gz 到 GitHub Releases"
echo ""
echo "发布步骤："
echo "1. 访问 https://github.com/lxfight/astrbot_plugin_GraphMemory/releases/new"
echo "2. 创建标签: ${VERSION}"
echo "3. 上传文件: dist/webui-${VERSION}.tar.gz"
echo "4. 发布 Release"