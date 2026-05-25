# 数据库连接调试指南

## 问题排查步骤

如果在 Vercel 上配置了 DATABASE_URL 但仍然无法连接数据库，请按照以下步骤排查：

### 1. 健康检查 API
访问以下端点查看详细状态：
```
https://your-domain.vercel.app/api/health
```

### 2. 常见问题及解决方案

#### A. 环境变量检查
- 在 Vercel 项目设置中确认：
  - 变量名是 `DATABASE_URL`（不是 MONGO_URL 或其他名字）
  - 变量值完整且没有拼写错误
  - 变量已添加到正确的环境（Production/Preview）

#### B. MongoDB Atlas 配置（如果使用 MongoDB Atlas）
1. **网络访问配置**：
   - 登录 MongoDB Atlas
   - 进入 Security → Network Access
   - 添加 IP 地址：`0.0.0.0/0`（允许所有 IP，适合 Vercel）
   - 或者添加 Vercel 的 IP 范围

2. **连接字符串格式**：
   确保连接字符串格式正确：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<databaseName>?retryWrites=true&w=majority
   ```
   - 确保包含数据库名
   - 确保用户名和密码已正确编码

3. **数据库用户权限**：
   - 确认用户有读写权限
   - 确认密码没有特殊字符需要 URL 编码

#### C. Vercel 日志检查
- 进入 Vercel 项目：
1. 部署后检查函数日志（Function Logs）
2. 查找 [MongoDB] 前缀的日志
3. 查看详细错误信息

### 3. 本地测试
如果可以先在本地测试数据库连接：

1. 创建 `.env.local` 文件
2. 添加你的 `DATABASE_URL`
3. 运行 `npm run dev`
4. 访问 `http://localhost:3000/api/health

### 4. 手动验证连接字符串
确保连接字符串：
- 可以用 MongoDB Compass 等工具测试连接

## 修改数据库连接

## 注意事项
- Vercel 无服务器环境对超时设置已优化
- 连接超时设置为 30 秒
- 有详细的日志记录帮助排查
