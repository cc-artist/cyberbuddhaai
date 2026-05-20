# Vercel 环境变量更新问题解决方案

## 问题描述
在 Vercel 中更新了 `DATABASE_URL` 后，仍然显示旧的 `postgres://user:pass@db.example.com:5432/app` 值。

## 解决方案（按顺序尝试）

### 方案 1：确认在正确的环境中更新（最常见原因）

Vercel 有三个独立的环境：`Development`、`Preview`、`Production`

1. 登录 Vercel 控制台
2. 进入项目 → **Settings** → **Environment Variables**
3. 检查你是在哪个环境中更新的变量
4. 确保同时更新所有环境：
   - ✅ **Production**（生产环境）
   - ✅ **Preview**（预览环境）
   - ✅ **Development**（开发环境）

### 方案 2：删除旧变量，重新添加

1. 在 Vercel 环境变量页面，找到所有 `DATABASE_URL` 变量
2. 点击每个右侧的 ⋮ 菜单，选择 **Delete** 删除
3. 点击 **Add New** → **Environment Variable**
4. 重新添加：
   - **Key**: `DATABASE_URL`
   - **Value**:
   ```
   mongodb+srv://cyber%20buddha%20ai:gYkZwd1JM51WTmEM@cluster0.5lhsrrz.mongodb.net/cyber-buddha?retryWrites=true&w=majority&appName=Cluster0
   ```
   - 选中所有三个环境：✅ Production ✅ Preview ✅ Development
5. 点击 **Save**

### 方案 3：必须重新部署（关键！）

**环境变量更新后，必须重新部署才能生效！**

1. 进入项目的 **Deployments** 标签页
2. 找到最新的成功部署
3. 点击右侧的 ⋮ 菜单，选择 **Redeploy**
4. 或者直接推送新的代码到 GitHub 触发自动部署

### 方案 4：检查是否有多个项目

1. 在 Vercel 控制台查看所有项目
2. 确认你正在更新的是正确的项目（`cyberbuddhaai`）
3. 可能存在多个同名项目

### 方案 5：清除 Vercel 缓存

1. 在项目页面点击 **Settings**
2. 滚动到 **Git** 部分
3. 点击 **Ignored Build Step** 检查设置
4. 或者尝试：
   - 删除 Vercel 项目
   - 重新从 GitHub 导入项目
   - 重新设置所有环境变量

## 验证环境变量是否生效

部署完成后，可以通过以下方式验证：

### 方法 1：查看部署日志

1. 进入 **Deployments** → 选择最新部署
2. 点击 **Functions** 标签
3. 查看构建日志，搜索 `DATABASE_URL` 确认是否使用了新值

### 方法 2：创建测试 API 端点

（如果需要，可以创建一个临时的测试 API 来打印环境变量）

## 正确的 MongoDB 连接字符串

```
mongodb+srv://cyber%20buddha%20ai:gYkZwd1JM51WTmEM@cluster0.5lhsrrz.mongodb.net/cyber-buddha?retryWrites=true&w=majority&appName=Cluster0
```

## 快速检查清单

- [ ] 同时更新了 Production、Preview、Development 三个环境
- [ ] 删除了旧的 `DATABASE_URL` 变量
- [ ] 重新添加了新的变量
- [ ] 重新部署了项目
- [ ] 确认正在使用正确的 Vercel 项目
