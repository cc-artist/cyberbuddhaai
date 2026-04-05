// 图片路径处理工具函数
import { getMappedImageUrl } from './imageMap';

/**
 * 获取完整的图片URL
 * @param path 图片路径
 * @returns 完整的图片URL，中文文件名已正确编码
 */
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  
  // 移除前后空白字符
  const trimmedPath = path.trim();
  
  // 如果是完整URL，直接返回
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }
  
  // 处理路径
  let processedPath = trimmedPath;
  
  // 替换Windows路径分隔符
  processedPath = processedPath.split('\\').join('/');
  
  // 移除多余的斜杠
  while (processedPath.includes('//')) {
    processedPath = processedPath.replace('//', '/');
  }
  
  // 确保路径以斜杠开头（Next.js需要绝对路径来加载静态资源）
  if (!processedPath.startsWith('/')) {
    processedPath = '/' + processedPath;
  }
  
  return processedPath;
};

/**
 * 获取生产环境安全的图片路径
 * 专为Vercel部署优化
 * @param path 图片路径
 * @returns 生产环境安全的图片路径
 */
export const getProductionSafeImageUrl = (path: string): string => {
  if (!path) return '';
  
  // 处理完整URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 标准化路径
  let normalizedPath = path;
  
  // 替换Windows路径分隔符
  normalizedPath = normalizedPath.split('\\').join('/');
  
  // 移除多余的斜杠
  while (normalizedPath.includes('//')) {
    normalizedPath = normalizedPath.replace('//', '/');
  }
  
  // 确保路径格式正确
  let safePath = normalizedPath;
  if (!safePath.startsWith('/')) {
    safePath = `/${safePath}`;
  }
  
  // 对于Vercel，使用相对路径格式
  if (safePath.startsWith('/temple-images/')) {
    return safePath.substring(1); // 移除开头的斜杠
  }
  
  return safePath;
};

/**
 * 检查图片路径是否为有效URL
 * @param path 图片路径
 * @returns 是否为有效URL
 */
export const isValidImageUrl = (path: string): boolean => {
  try {
    new URL(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * 确保图片路径使用正确的格式
 * 用于Vercel部署时的中文文件名处理
 * @param path 图片路径
 * @returns 标准化的图片路径
 */
export const normalizeImagePath = (path: string): string => {
  // 移除可能的重复斜杠
  const normalizedPath = path.replace(/\/+/g, '/');
  
  // 确保路径以斜杠开头
  if (!normalizedPath.startsWith('/')) {
    return `/${normalizedPath}`;
  }
  
  return normalizedPath;
};
