// Vercel部署状态检查脚本
// 用于检查Vercel部署状态和图片加载情况

import fs from 'fs';
import path from 'path';

// 检查图片文件是否存在
function checkImageFiles() {
  console.log('=== Checking Image Files ===');
  
  const publicDir = path.join(__dirname, 'public');
  const templeImagesDir = path.join(publicDir, 'temple-images');
  
  if (!fs.existsSync(templeImagesDir)) {
    console.error('❌ temple-images directory does not exist');
    return false;
  }
  
  console.log('✅ temple-images directory exists');
  
  const images = fs.readdirSync(templeImagesDir);
  console.log(`📁 Found ${images.length} images in temple-images`);
  
  // 检查几个关键图片是否存在
  const keyImages = ['南华寺.webp', '少林寺.webp', '灵隐寺.webp', '赛博佛祖背景图.png'];
  let allExist = true;
  
  keyImages.forEach(image => {
    const imagePath = path.join(templeImagesDir, image);
    if (fs.existsSync(imagePath)) {
      console.log(`✅ ${image} exists`);
    } else {
      console.error(`❌ ${image} does not exist`);
      allExist = false;
    }
  });
  
  return allExist;
}

// 检查图片路径配置
function checkImagePathConfig() {
  console.log('\n=== Checking Image Path Config ===');
  
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  
  // 读取并解析next.config.js作为文本文件
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  // 提取images配置部分
  const imagesMatch = nextConfigContent.match(/images:\s*\{[\s\S]*?\}/g);
  if (imagesMatch) {
    console.log('📋 Image config in next.config.js:');
    console.log(imagesMatch[0]);
    
    // 检查unoptimized设置
    if (imagesMatch[0].includes('unoptimized: true')) {
      console.log('✅ unoptimized is set to true (good for Vercel)');
    } else {
      console.warn('⚠️  unoptimized is not set to true (may cause issues with Vercel)');
    }
  } else {
    console.error('❌ No images config found in next.config.js');
  }
  
  return true;
}

// 检查TempleData中的图片路径格式
function checkTempleData() {
  console.log('\n=== Checking TempleData Image Paths ===');
  
  const templeDataPath = path.join(__dirname, 'src', 'data', 'TempleData.ts');
  const templeDataContent = fs.readFileSync(templeDataPath, 'utf8');
  
  // 提取所有图片路径
  const imagePathRegex = /image:\s*['"]([^'"]+)['"]/g;
  const matches = templeDataContent.matchAll(imagePathRegex);
  
  let hasRelativePaths = false;
  let hasAbsolutePath = false;
  
  for (const match of matches) {
    const imagePath = match[1];
    console.log(`📌 Image path: ${imagePath}`);
    
    if (imagePath.startsWith('/')) {
      hasAbsolutePath = true;
    } else {
      hasRelativePaths = true;
    }
  }
  
  console.log(`\n📊 Path analysis:`);
  console.log(`   - Relative paths: ${hasRelativePaths ? 'Yes' : 'No'}`);
  console.log(`   - Absolute paths: ${hasAbsolutePath ? 'Yes' : 'No'}`);
  
  return true;
}

// 运行所有检查
function runAllChecks() {
  console.log('🚀 Starting Vercel Deploy Check\n');
  
  const checks = [
    checkImageFiles,
    checkImagePathConfig,
    checkTempleData
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    if (!check()) {
      allPassed = false;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ All checks passed! Your deployment should work correctly.');
    console.log('📝 Next steps:');
    console.log('   1. Check Vercel deployment status in your Vercel dashboard');
    console.log('   2. Clear your browser cache before testing');
    console.log('   3. Try accessing the site with a different browser');
    console.log('   4. Check Vercel logs for any deployment errors');
  } else {
    console.error('❌ Some checks failed. Please fix the issues above.');
  }
}

// 执行检查
runAllChecks();
