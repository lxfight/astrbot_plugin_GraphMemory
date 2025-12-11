import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:7860'
  
  return {
    plugins: [vue()],
    
    // 构建配置
    build: {
      outDir: '../resources',  // 输出到插件的 resources 目录
      emptyOutDir: true,       // 清空输出目录
      
      rollupOptions: {
        output: {
          // 资源文件命名
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      
      // 生产环境优化
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,  // 移除 console
          drop_debugger: true
        }
      },
      
      // 代码分割
      chunkSizeWarningLimit: 1000,
      
      // Source map（可选，调试用）
      sourcemap: false
    },
    
    // 开发服务器配置
    server: {
      port: 5173,
      proxy: {
        // 代理 API 请求到后端（从环境变量读取）
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true
        },
        '/ws': {
          target: apiBaseUrl.replace('http', 'ws'),
          ws: true
        }
      }
    },
    
    // 路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})