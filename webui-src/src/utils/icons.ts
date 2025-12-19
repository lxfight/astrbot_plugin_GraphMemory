import { h, render } from 'vue'
import {
  User,
  MapPin,
  Package,
  Lightbulb,
  Calendar,
  Circle,
  HelpCircle
} from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'

// 图标组件映射
const iconMap: Record<string, FunctionalComponent> = {
  User,
  MapPin,
  Package,
  Lightbulb,
  Calendar,
  Circle,
  HelpCircle
}

// 实体类型映射到图标名称
const entityIcons: Record<string, string> = {
  // 英文类型
  PERSON: 'User',
  PLACE: 'MapPin',
  THING: 'Package',
  CONCEPT: 'Lightbulb',
  EVENT: 'Calendar',
  // 中文类型
  '人物': 'User',
  '地点': 'MapPin',
  '事物': 'Package',
  '概念': 'Lightbulb',
  '事件': 'Calendar',
  // 默认
  default: 'Circle',
}

// 缓存生成的 SVG
const svgCache: Record<string, string> = {}

/**
 * 获取图标名称
 */
export const getIconName = (type: string): string => {
  return entityIcons[type] || entityIcons.default
}

/**
 * 获取图标组件
 */
export const getIconComponent = (type: string): FunctionalComponent => {
  const iconName = getIconName(type)
  return iconMap[iconName] || Circle
}

/**
 * 生成 SVG Data URI 用于 Cytoscape 节点背景
 */
export const getIconSvg = async (type: string, color: string = '#ffffff'): Promise<string> => {
  const cacheKey = `${type}-${color}`
  if (svgCache[cacheKey]) {
    return svgCache[cacheKey]
  }

  const IconComponent = getIconComponent(type)

  // 创建 VNode
  const vnode = h(IconComponent, {
    size: 24,
    color: color,
    strokeWidth: 2,
  })

  // 在浏览器环境中渲染为字符串
  const div = document.createElement('div')
  render(vnode, div)
  const svgString = div.innerHTML
  
  // 清理
  render(null, div)

  // 转换为 Data URI
  // 需要对 SVG 字符串进行编码
  const encodedSvg = encodeURIComponent(svgString)
  const dataUri = `data:image/svg+xml;utf8,${encodedSvg}`
  
  svgCache[cacheKey] = dataUri
  return dataUri
}

/**
 * 获取纯 SVG 字符串（不带 Data URI 前缀，用于直接插入 DOM）
 */
export const getIconSvgString = async (name: string, props: any = {}): Promise<string> => {
  const IconComponent = iconMap[name] || Circle
  const vnode = h(IconComponent, props)
  
  const div = document.createElement('div')
  render(vnode, div)
  const str = div.innerHTML
  render(null, div)
  
  return str
}
