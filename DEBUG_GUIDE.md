# Vercel 部署调试指南

## 已修复的问题

✅ **数据库连接超时设置过短** - 已将超时时间从3秒增加到10秒，适应MongoDB Atlas的连接延迟

---

## 验证部署和数据库连接的步骤

### 步骤 1: 推送代码更新到 GitHub

将修复后的代码推送到GitHub，触发Vercel重新部署。

### 步骤 2: 检查 Vercel 部署状态

1. 登录 Vercel 控制台
2. 进入你的项目
3. 查看最新的部署状态
4. 确认部署成功完成

### 步骤 3: 检查环境变量

确认以下环境变量已正确配置：

- `NEXTAUTH_URL` - 你的Vercel域名
- `NEXTAUTH_SECRET` - 安全密钥
- `ADMIN_EMAIL` - 管理员邮箱
- `ADMIN_PASSWORD` - 管理员密码
- `DATABASE_URL` - MongoDB Atlas连接字符串
- `NODE_ENV` - 设置为 `production`

### 步骤 4: 验证 MongoDB Atlas 配置

1. 登录 MongoDB Atlas 控制台
2. 进入 **Network Access**
3. 确认已添加 IP `0.0.0.0/0` 到白名单（允许所有IP访问）
4. 进入 **Database Access**，确认数据库用户存在且权限正确

### 步骤 5: 初始化数据库（关键！）

**重要：** 新的MongoDB数据库是空的，需要先初始化示例数据！

1. 访问你的Vercel网站
2. 登录管理后台：`/admin/login`
   - 邮箱：`admin@example.com`
   - 密码：`admin123`
3. 登录后，访问数据库初始化API（需要手动调用或在管理后台操作）

**手动初始化数据库的方法：**

方法A - 使用浏览器开发者工具：
1. 登录管理后台后，打开浏览器开发者工具（F12）
2. 在Console中执行：
```javascript
fetch('/api/admin/init-db', {
  method: 'POST',
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

方法B - 使用Postman或类似工具：
1. 先登录获取session
2. POST 请求到 `https://your-domain.vercel.app/api/admin/init-db`

### 步骤 6: 验证功能

初始化数据库后，检查：

1. **首页** - 评论区应该显示真实数据（不是默认的5条）
2. **管理后台** - 不应该显示"演示模式"提示
3. **评论管理** - 应该能看到示例评论数据
4. **咨询管理** - 应该能看到示例咨询数据
5. **支付管理** - 应该能看到示例支付数据

---

## 常见问题排查

### 问题1: 仍然显示"演示模式"

**原因：** 数据库连接失败
**解决：**
- 确认MongoDB Atlas IP白名单已配置
- 确认连接字符串正确
- 查看Vercel部署日志中的错误信息

### 问题2: 评论区显示默认数据

**原因：** 数据库是空的
**解决：** 按照步骤5初始化数据库

### 问题3: 部署失败

**原因：** 环境变量配置错误
**解决：**
- 检查所有必需的环境变量是否已添加
- 确认连接字符串格式正确
- 查看Vercel构建日志

---

## 查看Vercel日志

要查看详细的错误信息：

1. 进入Vercel项目
2. 点击 **Functions** 标签
3. 选择最新的部署
4. 查看函数日志，寻找MongoDB连接相关的错误

---

## 需要帮助？

如果按照以上步骤操作后仍有问题，请检查：
1. Vercel函数日志中的具体错误信息
2. MongoDB Atlas的连接日志
3. 确认所有配置都正确无误
