# 后台管理系统优化规划文档

## 1. 产品需求文档 (PRD)

### 1.1 项目概述
优化赛博佛祖在线加持服务的后台管理系统，移除模拟数据，使用真实 MongoDB 数据库数据，并整合重复的功能模块。

### 1.2 功能需求

| 需求编号 | 需求名称 | 详细说明 | 优先级 |
|---------|---------|---------|-------|
| FR-001 | 移除模拟数据 | 从代码库中移除所有硬编码的示例数据，仅依赖数据库存储 | P0 |
| FR-002 | 支付管理模块 | 确保支付管理页面完全从 MongoDB 获取和展示真实数据 | P0 |
| FR-003 | 订单管理模块 | 确保订单管理页面完全从 MongoDB 获取和展示真实数据 | P0 |
| FR-004 | 咨询管理模块 | 确保咨询管理页面完全从 MongoDB 获取和展示真实数据 | P0 |
| FR-005 | 删除账单管理模块 | 删除功能重复的账单管理页面 | P1 |
| FR-006 | 更新导航菜单 | 从侧边栏导航中移除"账单管理"链接 | P1 |

### 1.3 非功能需求

| 需求编号 | 需求名称 | 详细说明 |
|---------|---------|---------|
| NFR-001 | 性能要求 | 页面加载时间 < 2s |
| NFR-002 | 可靠性要求 | 数据库连接失败时有友好的错误提示 |
| NFR-003 | 可维护性要求 | 代码结构清晰，无硬编码模拟数据 |

---

## 2. 技术实施计划

### 2.1 技术栈
- Next.js 14 (App Router)
- React 18+
- MongoDB + Mongoose
- Tailwind CSS

### 2.2 文件变更清单

| 文件路径 | 操作类型 | 说明 |
|---------|---------|------|
| `src/app/admin/AdminClientLayout.tsx` | 修改 | 移除"账单管理"导航项 |
| `src/app/admin/billing/page.tsx` | 删除 | 删除整个账单管理页面 |
| `src/app/api/admin/payments/route.ts` | 修改 | 移除模拟数据初始化逻辑 |
| `src/app/admin/payments/page.tsx` | 修改 | 优化数据字段映射，匹配真实数据库字段 |
| `src/app/admin/orders/page.tsx` | 修改 | 优化数据字段映射，匹配真实数据库字段 |
| `src/app/api/contact/route.ts` | 检查 | 确认咨询数据 API 完整性 |

### 2.3 实施步骤

#### 步骤 1: 删除账单管理页面
- 删除 `src/app/admin/billing/` 目录
- 确认路由不再可访问

#### 步骤 2: 更新导航菜单
- 编辑 `AdminClientLayout.tsx`
- 从 `navItems` 数组中移除账单管理项

#### 步骤 3: 清理 API 模拟数据
- 修改 `src/app/api/admin/payments/route.ts`
- 移除 `samplePayments` 数组
- 移除自动初始化示例数据的逻辑
- 保留真实数据库查询逻辑

#### 步骤 4: 优化页面组件数据映射
- 检查 `payments/page.tsx` 和 `orders/page.tsx`
- 确保字段正确映射到 Mongoose 模型字段（`_id` 处理等）

### 2.4 数据模型映射

| 前端字段 | MongoDB 字段 | 说明 |
|---------|-------------|------|
| id | _id \|\| id | 使用 MongoDB ObjectId 或自定义 id 字段 |
| user | user | 用户名称 |
| amount | amount | 支付金额 |
| status | status | 支付状态 |
| paymentPlatform | paymentPlatform | 支付平台 |
| createdAt | createdAt | 创建时间 |

---

## 3. 验证清单

### 3.1 功能验证

- [ ] 侧边栏导航中不再显示"账单管理"
- [ ] 访问 `/admin/billing` 返回 404 或重定向
- [ ] 支付管理页面能正常从数据库加载数据
- [ ] 订单管理页面能正常从数据库加载数据
- [ ] 咨询管理页面能正常从数据库加载数据
- [ ] 代码库中无硬编码的模拟数据

### 3.2 数据一致性验证

- [ ] 支付、订单、咨询数据能正确展示
- [ ] 日期格式显示正常
- [ ] 状态标签正确显示
- [ ] 统计数据计算准确

### 3.3 边界情况验证

- [ ] 数据库为空时显示空状态提示
- [ ] 网络错误时显示友好提示
- [ ] 加载状态显示正常

---

## 附录 A. 当前系统架构图

```
Admin Panel
├── Dashboard
├── Comments
├── Payments (← 使用 MongoDB)
├── Orders (← 使用 MongoDB, 与 Payments 共享数据源)
├── Consultations (← 使用 MongoDB)
├── API Keys
└── Billing (← 功能重复，待删除)
```

## 附录 B. 优化后系统架构图

```
Admin Panel
├── Dashboard
├── Comments
├── Payments (← 统一支付/订单管理入口)
├── Consultations
└── API Keys
```
