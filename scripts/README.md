# 脚本说明

## 概述

本目录包含前端构建脚本和测试脚本，用于本地开发和测试。

## 脚本列表

### 构建脚本

#### build.sh (Linux/macOS)

Linux 和 macOS 系统使用的构建脚本。

**使用方法**:
```bash
cd scripts
./build.sh
```

或从项目根目录:
```bash
bash scripts/build.sh
```

### build.bat (Windows)

Windows 系统使用的构建脚本。

**使用方法**:
```cmd
cd scripts
build.bat
```

或双击 `build.bat` 文件运行。

### 测试脚本

#### run_tests.sh (Linux/macOS)

运行测试套件的脚本。

**使用方法**:
```bash
# 运行所有测试
bash scripts/run_tests.sh

# 运行单元测试
bash scripts/run_tests.sh unit

# 运行集成测试
bash scripts/run_tests.sh integration

# 运行 WebUI 测试
bash scripts/run_tests.sh webui

# 生成覆盖率报告
bash scripts/run_tests.sh coverage
```

#### run_tests.bat (Windows)

Windows 系统使用的测试脚本。

**使用方法**:
```cmd
REM 运行所有测试
scripts\run_tests.bat

REM 运行单元测试
scripts\run_tests.bat unit

REM 运行集成测试
scripts\run_tests.bat integration

REM 生成覆盖率报告
scripts\run_tests.bat coverage
```

## 前置要求

### 构建前端

- **Node.js**: 版本 18 或更高
- **npm**: 随 Node.js 一起安装

### 运行测试

- **Python**: 版本 3.10 或更高
- **pytest**: `pip install pytest pytest-asyncio pytest-cov`
- **FastAPI**: `pip install fastapi httpx`

## 构建流程

1. 检查 Node.js 和 npm 是否安装
2. 进入 `webui-src` 目录
3. 安装依赖 (`npm install`)
4. 构建前端 (`npm run build`)
5. 输出构建产物到 `webui/static/`

## 构建产物

构建完成后，产物位于:
```
webui/static/
├── index.html
└── assets/
    ├── vendor-vue-*.js
    ├── vendor-charts-*.js
    ├── vendor-graph-*.js
    ├── vendor-utils-*.js
    └── [其他组件文件]
```

## CI/CD 自动构建

### GitHub Actions

项目配置了两个 GitHub Actions 工作流:

#### 1. build-frontend.yml

**触发条件**:
- Push 到 master/main 分支且修改了 `webui-src/**` 文件
- Pull Request 到 master/main 分支且修改了 `webui-src/**` 文件
- 手动触发 (workflow_dispatch)

**功能**:
- 自动构建前端
- 上传构建产物为 Artifacts (保留 30 天)

#### 2. release.yml

**触发条件**:
- 创建 GitHub Release
- 手动触发 (workflow_dispatch)

**功能**:
- 自动构建前端
- 打包完整插件 (包含构建产物)
- 上传 `.tar.gz` 和 `.zip` 到 Release
- 用户下载后可直接使用，无需手动构建

## 用户使用说明

### 从 Release 下载

**推荐方式**，无需手动构建:

1. 访问 GitHub Releases 页面
2. 下载最新版本的 `.tar.gz` 或 `.zip`
3. 解压到 AstrBot 插件目录
4. 直接使用，WebUI 已预构建

### 从源码安装

如果从源码克隆，需要手动构建:

**Linux/macOS**:
```bash
cd astrbot_plugin_GraphMemory
bash scripts/build.sh
```

**Windows**:
```cmd
cd astrbot_plugin_GraphMemory
scripts\build.bat
```

## 开发说明

### 本地开发

开发时使用开发服务器:
```bash
cd webui-src
npm install
npm run dev
```

访问 `http://localhost:5173` 进行开发。

### 构建测试

测试构建流程:
```bash
bash scripts/build.sh
```

### Git 忽略规则

- `webui/static/` 不会被提交到 Git
- CI/CD 会在 Release 时自动构建
- 本地构建产物仅用于测试

## 故障排除

### Node.js 未安装

**错误**: `command not found: node`

**解决**: 安装 Node.js
- 访问 https://nodejs.org/
- 下载并安装 LTS 版本

### 依赖安装失败

**错误**: `npm install` 失败

**解决**:
```bash
cd webui-src
rm -rf node_modules package-lock.json
npm install
```

### 构建失败

**错误**: `npm run build` 失败

**解决**:
1. 检查 Node.js 版本 (需要 18+)
2. 清理并重新安装依赖
3. 查看错误日志

### 权限问题 (Linux/macOS)

**错误**: `Permission denied`

**解决**:
```bash
chmod +x scripts/build.sh
```

## 联系方式

如有问题，请提交 Issue 或 Pull Request。

---

**最后更新**: 2025-12-19
