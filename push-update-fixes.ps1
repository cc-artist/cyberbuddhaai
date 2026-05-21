# 推送脚本
Write-Host "正在检查当前分支..." -ForegroundColor Green
git branch --show-current

Write-Host "`n正在检查状态..." -ForegroundColor Green
git status

Write-Host "`n正在推送到 update-fixes 分支..." -ForegroundColor Yellow
git push origin update-fixes

Write-Host "`n完成！" -ForegroundColor Green
