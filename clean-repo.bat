@echo off

echo 开始清理仓库...

rem 删除不必要的目录
rd /s /q "github-upload" 2>nul
rd /s /q "github-upload-v2" 2>nul
rd /s /q "minimal-repo" 2>nul
rd /s /q "test-clone" 2>nul
rd /s /q "test-repo" 2>nul

rem 删除大文件
del /f /q "blessing-1761387898015.png" 2>nul
del /f /q "blessing.png" 2>nul
del /f /q "cyber-buddha-blessing-high (1).png" 2>nul
del /f /q "cyber-buddha-blessing-high (2).png" 2>nul
del /f /q "cyber-buddha-blessing-high.png" 2>nul
del /f /q "cyber-buddha-blessing-high2026.3.8.png" 2>nul
del /f /q "cyber-buddha-item.png" 2>nul
del /f /q "cyber-buddha-lamp-blessing-1772952141756.png" 2>nul
del /f /q "cyber_blessing_1761042524044.png" 2>nul
del /f /q "cyber_blessing_1761292898141.png" 2>nul
del /f /q "dharma-form-cyber-2026年1月25日.png" 2>nul
del /f /q "dharma-form-minimalist-2026年1月25日.png" 2>nul
del /f /q "domain-certificate-cyberbuddhaai.qzz.io.pdf" 2>nul
del /f /q "github-upload-v2.zip" 2>nul
del /f /q "github-upload.zip" 2>nul
del /f /q "paypal_KWCN3QN74N4X4.pdf" 2>nul
del /f /q "paypal_VJGYEAUJ7GH6L.pdf" 2>nul
del /f /q "pingpongpay报价单_16232952141756_ucq7o.jpg" 2>nul
del /f /q "cyberbuddhaai.bundle" 2>nul
del /f /q "h origin master'" 2>nul
del /f /q "ter" 2>nul
del /f /q "ter --dry-run" 2>nul
del /f /q "ter --force" 2>nul
del /f /q "test-synthesis.ps1" 2>nul

rem 删除开光相关图片
del /f /q "开光-*.png" 2>nul

rem 删除微信图片
del /f /q "微信图片_*.png" 2>nul
del /f /q "微信图片_*.jpg" 2>nul

rem 删除法相相关图片
del /f /q "法相-*.png" 2>nul

rem 删除赛博佛祖背景图
del /f /q "赛博佛祖背景图 - 副本.png" 2>nul
del /f /q "赛博佛祖背景图.png" 2>nul

rem 删除根目录寺庙图片
del /f /q "佛顶宫.webp" 2>nul
del /f /q "南华寺.webp" 2>nul
del /f /q "南普陀寺.jpg" 2>nul
del /f /q "卧佛寺.webp" 2>nul
del /f /q "国清寺.webp" 2>nul
del /f /q "地藏禅寺.jpg" 2>nul
del /f /q "塔尔寺.webp" 2>nul
del /f /q "塔院寺.png" 2>nul
del /f /q "大昭寺.png" 2>nul
del /f /q "寒山寺.webp" 2>nul
del /f /q "少林寺.webp" 2>nul
del /f /q "法门寺.jpg" 2>nul
del /f /q "灵山大佛.jpg" 2>nul
del /f /q "灵山大佛.webp" 2>nul
del /f /q "灵隐寺.webp" 2>nul
del /f /q "白马寺.jpg" 2>nul
del /f /q "金山寺.webp" 2>nul
del /f /q "金顶华藏寺.jpg" 2>nul
del /f /q "隆兴寺.webp" 2>nul

rem 清理 node_modules 和构建目录
rd /s /q "node_modules" 2>nul
rd /s /q ".next" 2>nul
rd /s /q "cyber-buddha-blessing\node_modules" 2>nul
rd /s /q "cyber-buddha-blessing\.next" 2>nul

echo.
echo 清理完成！
echo.
echo 仓库现在应该更轻量，便于推送。
echo.
echo 建议接下来运行: git gc --aggressive --prune=now
echo.

pause
