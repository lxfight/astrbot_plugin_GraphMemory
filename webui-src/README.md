# GraphMemory WebUI - Vue 3 前端项目

这是 GraphMemory 插件的 Vue 3 前端源码目录。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📁 项目结构

```
webui-src/
├── src/
│   ├── components/      # 可复用组件
│   │   ├── GraphCanvas.vue      # 图谱画布
│   │   ├── NodeInfoPanel.vue    # 节点信息面板
│   │   ├── SearchBar.vue        # 搜索栏
│   │   └── ...
│   ├── views/           # 页面视图
│   │   └── MainView.vue
│   ├── stores/          # Pinia 状态管理
│   │   ├── graph.js     # 图谱数据状态
│   │   └── ui.js        # UI 状态
│   ├── api/             # API 请求封装
│   │   └── index.js
│   ├── utils/           # 工具函数
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── public/              # 静态资源
├── package.json
└── vite.config.js       # Vite 配置
```

## 🔧 开发说明

### 配置后端端口

如果你的后端运行在非默认端口（8081），需要修改 `.env.development` 文件：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:7860  # 改为你的实际端口
```

### 开发流程

1. **启动后端**（在项目根目录）：
```bash
python main.py
```

2. **启动前端开发服务器**：
```bash
npm run dev
```

3. 访问 `http://localhost:5173` 进行开发

开发环境下，所有 `/api` 和 `/ws` 请求会自动代理到配置的后端地址。

### 构建输出

运行 `npm run build` 后，构建产物会输出到 `../resources/` 目录，可直接被 Python 后端使用。

**注意**：生产环境下，前端使用相对路径访问API，会自动适配后端的任何端口配置，无需重新构建。

### 技术栈

- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 下一代前端构建工具
- **Pinia**: Vue 官方状态管理库
- **Force-Graph**: 力导向图可视化库
- **Axios**: HTTP 客户端

## 📖 更多文档

详细的开发和部署指南请参考 [`../WEBUI_DEVELOPMENT.md`](../WEBUI_DEVELOPMENT.md)