export const getImageUrl = (path: string): string => {
  if (!path) return '';
  
  const trimmedPath = path.trim();
  
  // 完整URL直接返回
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }
  
  // 处理Windows路径分隔符
  let processedPath = trimmedPath.split('\\').join('/');
  
  // 移除多余斜杠
  while (processedPath.includes('//')) {
    processedPath = processedPath.replace('//', '/');
  }
  
  // 确保绝对路径
  if (!processedPath.startsWith('/')) {
    processedPath = '/' + processedPath;
  }
  
  return processedPath;
};

export const getTempleImageUrl = (imageName: string): string => {
  return getImageUrl(`/temple-images/${imageName}`);
};
