# 管理后台真实数据修复 - 实现计划

## [x] Task 1: 修复支付管理API，移除模拟数据依赖
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 移除payments API中的samplePayments模拟数据
  - 确保数据库连接成功时直接使用真实数据
  - 添加完整的CRUD操作（POST创建、PUT更新、DELETE删除）
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `human-judgement` TR-1.1: 支付管理页面显示真实数据，无模拟数据
  - `human-judgement` TR-1.2: 支持支付状态更新和删除操作

## [x] Task 2: 修复咨询管理API，确保真实数据获取
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 确保contact API正确获取数据库中的咨询记录
  - 添加DELETE删除操作
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `human-judgement` TR-2.1: 咨询管理页面显示真实数据
  - `human-judgement` TR-2.2: 支持咨询状态更新和删除操作

## [x] Task 3: 修复评论管理API，移除模拟数据依赖
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 移除comments API中的sampleComments模拟数据
  - 确保数据库连接成功时直接使用真实数据
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `human-judgement` TR-3.1: 评论管理页面显示真实数据，无模拟数据
  - `human-judgement` TR-3.2: 支持评论审核和删除操作

## [x] Task 4: 修复API密钥管理API，显示真实状态
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 确保API密钥管理API正确检查各服务的密钥状态
  - 修复TypeScript类型错误
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `human-judgement` TR-4.1: API密钥管理页面显示正确的状态（已激活/未配置）
  - `programmatic` TR-4.2: 构建时无TypeScript错误

## [x] Task 5: 修复管理后台布局组件异步问题
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修复admin/layout.tsx中的异步问题
  - 确保客户端组件正确检查认证状态
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3, AC-4]
- **Test Requirements**:
  - `human-judgement` TR-5.1: 管理后台首页能正常加载
  - `human-judgement` TR-5.2: 未登录用户正确重定向到登录页面

## [x] Task 6: 添加数据库初始化脚本
- **Priority**: P2
- **Depends On**: Task 1, Task 2, Task 3
- **Description**: 
  - 创建数据库初始化脚本，在数据库为空时自动创建示例数据
  - 确保所有集合都有初始数据用于测试
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-6.1: 首次访问后台时自动初始化数据
  - `human-judgement` TR-6.2: 数据只初始化一次，不会重复插入