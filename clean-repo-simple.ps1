# 简单清理脚本
Write-Host "开始清理仓库..." -ForegroundColor Green

# 切换到项目目录
cd "d:\Trae CN\Buddha s consecration 2"

# 删除不必要的目录
Remove-Item -Path "github-upload" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "github-upload-v2" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "minimal-repo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-clone" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-repo" -Recurse -Force -ErrorAction SilentlyContinue

# 删除大文件
Remove-Item -Path "blessing-1761387898015.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "blessing.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-blessing-high (1).png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-blessing-high (2).png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-blessing-high.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-blessing-high2026.3.8.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-item.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-lamp-blessing-1772952141756.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber_blessing_1761042524044.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber_blessing_1761292898141.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dharma-form-cyber-2026年1月25日.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dharma-form-minimalist-2026年1月25日.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "domain-certificate-cyberbuddhaai.qzz.io.pdf" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "github-upload-v2.zip" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "github-upload.zip" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "paypal_KWCN3QN74N4X4.pdf" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "paypal_VJGYEAUJ7GH6L.pdf" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "pingpongpay报价单_1623295214889_ucq7o.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyberbuddhaai.bundle" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "h origin master'" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "ter" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "ter --dry-run" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "ter --force" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-synthesis.ps1" -Force -ErrorAction SilentlyContinue

# 删除开光相关图片
Get-ChildItem -Path "." -Name "开光-*.png" | ForEach-Object {
    Remove-Item -Path $_ -Force -ErrorAction SilentlyContinue
}

# 删除微信图片
Get-ChildItem -Path "." -Name "微信图片_*.png" | ForEach-Object {
    Remove-Item -Path $_ -Force -ErrorAction SilentlyContinue
}
Get-ChildItem -Path "." -Name "微信图片_*.jpg" | ForEach-Object {
    Remove-Item -Path $_ -Force -ErrorAction SilentlyContinue
}

# 删除法相相关图片
Get-ChildItem -Path "." -Name "法相-*.png" | ForEach-Object {
    Remove-Item -Path $_ -Force -ErrorAction SilentlyContinue
}

# 删除赛博佛祖背景图
Remove-Item -Path "赛博佛祖背景图 - 副本.png" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "赛博佛祖背景图.png" -Force -ErrorAction SilentlyContinue

# 删除根目录寺庙图片
$templeImages = @(
    "佛顶宫.webp", "南华寺.webp", "南普陀寺.jpg", "卧佛寺.webp", "国清寺.webp",
    "地藏禅寺.jpg", "塔尔寺.webp", "塔院寺.png", "大昭寺.png", "寒山寺.webp",
    "少林寺.webp", "法门寺.jpg", "灵山大佛.jpg", "灵山大佛.webp", "灵隐寺.webp",
    "白马寺.jpg", "金山寺.webp", "金顶华藏寺.jpg", "隆兴寺.webp"
)

foreach ($image in $templeImages) {
    Remove-Item -Path $image -Force -ErrorAction SilentlyContinue
}

# 清理 node_modules 和构建目录
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-blessing\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "cyber-buddha-blessing\.next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "\n清理完成！" -ForegroundColor Green
Write-Host "\n仓库现在应该更轻量，便于推送。" -ForegroundColor Green
Write-Host "\n建议接下来运行: git gc --aggressive --prune=now" -ForegroundColor Cyan
