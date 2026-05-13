# Vercel 部署配置完整指南

## 1. 环境变量配置

### 在 Vercel 中配置环境变量

1. 登录 Vercel 控制台
2. 进入你的项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下环境变量：

#### 必需配置

```
# Next Auth 配置
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here

# 管理员账号
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# 数据库连接（MongoDB Atlas）
DATABASE_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cyber-buddha?retryWrites=true&w=majority

# Node 环境
NODE_ENV=production
```

#### 可选配置

```
# PayPal 配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id

# API Key
API_KEY=your-api-key-here
```

### 生成 NEXTAUTH_SECRET

可以使用以下命令生成随机密钥：

```bash
openssl rand -hex 32
```

## 2. MongoDB Atlas 云数据库配置

### 步骤 1：创建 MongoDB Atlas 账户
1. 访问 https://www.mongodb.com/cloud/atlas
2. 注册免费账户
3. 创建免费的 M0 集群

### 步骤 2：配置网络访问
1. 在 Atlas 控制台，进入 "Network Access"
2. 点击 "Add IP Address"
3. 添加 `0.0.0.0/0`（允许所有 IP，生产环境建议限制）
4. 点击 "Confirm"

### 步骤 3：创建数据库用户
1. 进入 "Database Access"
2. 点击 "Add New Database User"
3. 设置用户名和密码（记住这些凭据）
4. 点击 "Add User"

### 步骤 4：获取连接字符串
1. 在 "Database" 页面，点击 "Connect"
2. 选择 "Connect your application"
3. 选择驱动：Node.js，版本：4.0+
4. 复制连接字符串
5. 将 `<password>` 替换为你设置的密码
6. 将数据库名改为 `cyber-buddha`

连接字符串格式示例：
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cyber-buddha?retryWrites=true&w=majority
```

## 3. 重新部署

配置完成后，重新部署项目：

1. 在 Vercel 项目页面，点击 "Deployments"
2. 找到最新的部署，点击 "..." → "Redeploy"
3. 或者推送新代码到 GitHub 自动触发部署

## 4. 验证部署

部署完成后：
1. 访问你的 Vercel 域名
2. 登录管理后台 `/admin/login`
3. 检查是否能正常连接数据库（不应显示"演示模式"提示）

## 本地 MongoDB 安装（可选）

如果需要本地开发数据库：

### Windows 安装
1. 下载：https://www.mongodb.com/try/download/community
2. 运行安装程序，选择 "Complete" 安装
3. 勾选 "Install MongoDB as a Service"
4. 完成后，MongoDB 会作为 Windows 服务自动启动

### 验证安装
```bash
mongod --version
```
