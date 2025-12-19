#!/bin/bash
# 前端构建脚本

set -e

echo "=========================================="
echo "GraphMemory WebUI 构建脚本"
echo "=========================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未安装 Node.js"
    echo "请访问 https://nodejs.org/ 下载安装"
    exit 1
fi

echo "Node.js 版本: $(node --version)"
echo "npm 版本: $(npm --version)"
echo ""

# 进入前端目录
cd "$(dirname "$0")/../webui-src"

# 检查 package.json
if [ ! -f "package.json" ]; then
    echo "错误: 未找到 package.json"
    exit 1
fi

# 安装依赖
echo "=========================================="
echo "安装依赖..."
echo "=========================================="
npm install

# 构建
echo ""
echo "=========================================="
echo "构建前端..."
echo "=========================================="
npm run build

# 检查构建产物
echo ""
echo "=========================================="
echo "构建完成！"
echo "=========================================="
echo ""
echo "构建产物:"
ls -lh ../webui/static/
echo ""
echo "Assets:"
ls -lh ../webui/static/assets/ | head -20

echo ""
echo "=========================================="
echo "构建成功！"
echo "=========================================="
