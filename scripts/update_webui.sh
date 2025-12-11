#!/bin/bash
set -e

echo "🔄 更新 WebUI..."

# 1. 拉取最新代码
git pull origin main

# 2. 检查是否需要重新构建
if [ -d "webui-src" ] && [ ! -f "resources/index.html" ]; then
    echo "📦 检测到需要构建..."
    cd webui-src
    npm install
    npm run build
    cd ..
fi

echo "✅ WebUI 更新完成！"
echo "🔄 请重启 AstrBot 插件以应用更改"