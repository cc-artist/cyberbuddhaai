# 清理仓库脚本
# 安全删除不必要的大文件，只保留必要的源代码和图片

Write-Host "开始清理仓库..." -ForegroundColor Green

# 清理不必要的目录
$directoriesToDelete = @(
    "github-upload",
    "github-upload-v2",
    "minimal-repo",
    "test-clone",
    "test-repo"
)

foreach ($dir in $directoriesToDelete) {
    $dirPath = Join-Path "d:\Trae CN\Buddha s consecration 2" $dir
    if (Test-Path $dirPath) {
        Write-Host "删除目录: $dir" -ForegroundColor Yellow
        Remove-Item -Path $dirPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 清理大文件
$largeFiles = @(
    "blessing-1761387898015.png",
    "blessing.png",
    "cyber-buddha-blessing-high (1).png",
    "cyber-buddha-blessing-high (2).png",
    "cyber-buddha-blessing-high.png",
    "cyber-buddha-blessing-high2026.3.8.png",
    "cyber-buddha-item.png",
    "cyber-buddha-lamp-blessing-1772952141756.png",
    "cyber_blessing_1761042524044.png",
    "cyber_blessing_1761292898141.png",
    "dharma-form-cyber-2026年1月25日.png",
    "dharma-form-minimalist-2026年1月25日.png",
    "domain-certificate-cyberbuddhaai.qzz.io.pdf",
    "github-upload-v2.zip",
    "github-upload.zip",
    "paypal_KWCN3QN74N4X4.pdf",
    "paypal_VJGYEAUJ7GH6L.pdf",
    "pingpongpay报价单_1623295214889_ucq7o.jpg",
    "开光-1768126822048.png",
    "开光-1768127357144.png",
    "开光-1768127798902.png",
    "开光-1768202685900.png",
    "开光-1768203006180.png",
    "开光-1768204041339.png",
    "开光-1768205091354.png",
    "开光-1768205493065.png",
    "开光-1768208389855.png",
    "微信图片_20260118182205_355_149.png",
    "微信图片_20260208173829_421_149.png",
    "微信图片_20260213122450_424_149.jpg",
    "微信图片_20260308172626_463_149.png",
    "法相-1768364113410.png",
    "法相-1768364417897.png",
    "法相-1768364435601.png",
    "法相-1768384629215.png",
    "赛博佛祖背景图 - 副本.png",
    "赛博佛祖背景图.png",
    "cyberbuddhaai.bundle",
    "h origin master'",
    "ter",
    "ter --dry-run",
    "ter --force",
    "test-synthesis.ps1"
)

foreach ($file in $largeFiles) {
    $filePath = Join-Path "d:\Trae CN\Buddha s consecration 2" $file
    if (Test-Path $filePath) {
        $fileInfo = Get-Item $filePath
        $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
        Write-Host "删除文件: $file ($sizeMB MB)" -ForegroundColor Yellow
        Remove-Item -Path $filePath -Force -ErrorAction SilentlyContinue
    }
}

# 清理根目录下的寺庙图片
$templeImages = @(
    "佛顶宫.webp",
    "南华寺.webp",
    "南普陀寺.jpg",
    "卧佛寺.webp",
    "国清寺.webp",
    "地藏禅寺.jpg",
    "塔尔寺.webp",
    "塔院寺.png",
    "大昭寺.png",
    "寒山寺.webp",
    "少林寺.webp",
    "法门寺.jpg",
    "灵山大佛.jpg",
    "灵山大佛.webp",
    "灵隐寺.webp",
    "白马寺.jpg",
    "金山寺.webp",
    "金顶华藏寺.jpg",
    "隆兴寺.webp"
)

foreach ($image in $templeImages) {
    $imagePath = Join-Path "d:\Trae CN\Buddha s consecration 2" $image
    if (Test-Path $imagePath) {
        $fileInfo = Get-Item $imagePath
        $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
        Write-Host "删除根目录寺庙图片: $image ($sizeMB MB)" -ForegroundColor Yellow
        Remove-Item -Path $imagePath -Force -ErrorAction SilentlyContinue
    }
}

# 清理 node_modules 和构建目录
$cleanPaths = @(
    "node_modules",
    ".next",
    "cyber-buddha-blessing\node_modules",
    "cyber-buddha-blessing\.next"
)

foreach ($path in $cleanPaths) {
    $fullPath = Join-Path "d:\Trae CN\Buddha s consecration 2" $path
    if (Test-Path $fullPath) {
        Write-Host "删除: $path" -ForegroundColor Yellow
        Remove-Item -Path $fullPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "\n清理完成！" -ForegroundColor Green
Write-Host "\n仓库现在应该更轻量，便于推送。" -ForegroundColor Green
Write-Host "\n建议接下来运行: git gc --aggressive --prune=now" -ForegroundColor Cyan
