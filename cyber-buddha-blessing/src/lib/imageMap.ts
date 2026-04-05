// 图片路径映射，用于确保生产环境中图片能正确访问
// 这个文件会在构建时自动生成或手动更新

// 映射表：原始文件名 -> 生产环境可用路径
export interface ImageMap {
  [key: string]: string;
}

// 手动创建的图片映射表，包含所有寺庙图片
export const imageMap: ImageMap = {
  // 赛博佛祖背景图
  '/temple-images/赛博佛祖背景图.png': '/temple-images/赛博佛祖背景图.png',
  
  // 寺庙图片
  '/temple-images/南华寺.webp': '/temple-images/南华寺.webp',
  '/temple-images/少林寺.webp': '/temple-images/少林寺.webp',
  '/temple-images/灵隐寺.webp': '/temple-images/灵隐寺.webp',
  '/temple-images/寒山寺.webp': '/temple-images/寒山寺.webp',
  '/temple-images/白马寺.jpg': '/temple-images/白马寺.jpg',
  '/temple-images/塔尔寺.webp': '/temple-images/塔尔寺.webp',
  '/temple-images/灵山大佛.jpg': '/temple-images/灵山大佛.jpg',
  '/temple-images/佛顶宫.webp': '/temple-images/佛顶宫.webp',
  '/temple-images/南普陀寺.jpg': '/temple-images/南普陀寺.jpg',
  '/temple-images/卧佛寺.webp': '/temple-images/卧佛寺.webp',
  '/temple-images/国清寺.webp': '/temple-images/国清寺.webp',
  '/temple-images/地藏禅寺.jpg': '/temple-images/地藏禅寺.jpg',
  '/temple-images/塔院寺.png': '/temple-images/塔院寺.png',
  '/temple-images/大昭寺.png': '/temple-images/大昭寺.png',
  '/temple-images/法门寺.jpg': '/temple-images/法门寺.jpg',
  '/temple-images/金山寺.webp': '/temple-images/金山寺.webp',
  '/temple-images/金顶华藏寺.jpg': '/temple-images/金顶华藏寺.jpg',
  '/temple-images/隆兴寺.webp': '/temple-images/隆兴寺.webp',
};

/**
 * 从映射表中获取图片路径
 * @param originalPath 原始图片路径
 * @returns 生产环境可用的图片路径
 */
export const getMappedImageUrl = (originalPath: string): string => {
  // 检查映射表中是否存在该路径
  if (imageMap[originalPath]) {
    return imageMap[originalPath];
  }
  
  // 如果映射表中没有，返回原始路径
  return originalPath;
};