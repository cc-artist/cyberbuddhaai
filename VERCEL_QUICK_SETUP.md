# Vercel 快速配置指南

## 步骤 1: 在 Vercel 中配置环境变量

1. 登录 Vercel 控制台: https://vercel.com
2. 进入你的项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下环境变量：

### 必需配置

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | 替换为你的实际域名 |
| `NEXTAUTH_SECRET` | `2b4974693dfaf7c5458b8aeb0840ee40fcf6650d51859f52079ed27ab9ea63c2` | 使用此密钥或生成新的 |
| `ADMIN_EMAIL` | `admin@example.com` | 管理员邮箱 |
| `ADMIN_PASSWORD` | `admin123` | 管理员密码（生产环境请修改） |
| `DATABASE_URL` | `mongodb+srv://cherryhou_db_user:db_zLaSlu3M7JRHaGl1@cluster0.5lhsrrz.mongodb.net/cyber-buddha?retryWrites=true&w=majority&appName=Cluster0` | MongoDB Atlas连接字符串 |
| `NODE_ENV` | `production` | 生产环境 |

## 步骤 2: MongoDB Atlas 网络访问配置

**重要提示：**
- 确保在 MongoDB Atlas 中配置了网络访问（添加 IP `0.0.0.0/0`）
- 确保数据库用户名和密码已正确配置
- 数据库名称已设置为 `cyber-buddha`

## 步骤 3: 重新部署

配置完环境变量后：
1. 在 Vercel 项目页面，点击 **Deployments**
2. 找到最新的部署，点击 **...** → **Redeploy**
3. 等待部署完成

## 步骤 4: 验证部署

部署完成后：
1. 访问你的 Vercel 域名
2. 登录管理后台 `/admin/login`
3. 检查是否能正常连接数据库（不应显示"演示模式"提示）

## 本地开发

本地开发已配置完成，环境变量位于 `.env.local`：
- 如果没有安装本地 MongoDB，系统会自动使用模拟数据
- 管理后台会显示"演示模式"提示

## 生成新的 NEXTAUTH_SECRET（可选）

如果需要生成新的密钥，可以使用以下 PowerShell 命令：
```powershell
$bytes = New-Object byte[] 32; [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString("x2") })
```
