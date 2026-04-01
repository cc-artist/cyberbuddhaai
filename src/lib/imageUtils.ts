// 图片路径处理工具函数

/**
 * 获取完整的图片URL
 * @param path 图片路径
 * @returns 完整的图片URL
 */
export const getImageUrl = (path: string): string => {
  // 如果是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 如果路径已经以斜杠开头，直接使用
  if (path.startsWith('/')) {
    return path;
  }
  
  // 否则添加斜杠前缀
  return `/${path}`;
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
