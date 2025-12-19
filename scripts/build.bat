@echo off
REM 前端构建脚本 (Windows)

echo ==========================================
echo GraphMemory WebUI 构建脚本
echo ==========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未安装 Node.js
    echo 请访问 https://nodejs.org/ 下载安装
    exit /b 1
)

echo Node.js 版本:
node --version
echo npm 版本:
npm --version
echo.

REM 进入前端目录
cd /d "%~dp0..\webui-src"

REM 检查 package.json
if not exist "package.json" (
    echo 错误: 未找到 package.json
    exit /b 1
)

REM 安装依赖
echo ==========================================
echo 安装依赖...
echo ==========================================
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 依赖安装失败
    exit /b 1
)

REM 构建
echo.
echo ==========================================
echo 构建前端...
echo ==========================================
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 构建失败
    exit /b 1
)

REM 检查构建产物
echo.
echo ==========================================
echo 构建完成！
echo ==========================================
echo.
echo 构建产物:
dir /b ..\webui\static

echo.
echo ==========================================
echo 构建成功！
echo ==========================================
pause
