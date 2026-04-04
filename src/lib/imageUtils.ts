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
  
  // 处理Windows路径分隔符
  const normalizedPath = trimmedPath.replace(/\\/g, '/');
  
  // 移除多余的斜杠
  const cleanPath = normalizedPath.replace(/\/+/g, '/');
  
  // 确保路径以斜杠开头
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  // 从映射表中获取图片路径
  const mappedPath = getMappedImageUrl(finalPath);
  
  // 检查是否为客户端环境
  if (typeof window !== 'undefined') {
    // 客户端环境，返回直接路径，浏览器会自动处理中文编码
    return mappedPath;
  } else {
    // 服务端环境，需要手动编码中文文件名部分
    // 分离路径和文件名
    const pathParts = mappedPath.split('/');
    const fileName = pathParts.pop();
    const directoryPath = pathParts.join('/');
    
    if (fileName) {
      // 编码文件名
      const encodedFileName = encodeURIComponent(fileName);
      // 重组路径
      return `${directoryPath}/${encodedFileName}`;
    }
    
    return mappedPath;
  }
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
