# 后端完整配置 - 实现计划

## [x] Task 1: 创建API密钥数据库模型
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建APIKey数据库模型，包含name、type、value、status等字段
  - 支持OpenAI、PayPal、PingPong等密钥类型
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `human-judgement` TR-1.1: API密钥模型正确创建
  - `programmatic` TR-1.2: 数据库能正确存储和查询API密钥

## [x] Task 2: 更新API密钥管理API使用数据库
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 修改api-keys/route.ts使用数据库存储
  - 移除内存模拟数据
  - 添加完整CRUD操作
- **Acceptance Criteria Addressed**: [AC-1]
- **Test Requirements**:
  - `human-judgement` TR-2.1: API密钥管理页面显示数据库数据
  - `human-judgement` TR-2.2: 支持API密钥的增删改查

## [x] Task 3: 创建AI大模型服务
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 创建OpenAI服务封装
  - 添加图片生成API端点
  - 支持文本生成和图片生成
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic` TR-3.1: 调用AI生成接口返回200状态
  - `human-judgement` TR-3.2: 成功生成图片或文本内容

## [x] Task 4: 更新数据库初始化脚本
- **Priority**: P1
- **Depends On**: Task 1
- **Description**: 
  - 添加API密钥初始化数据
  - 确保首次启动时自动初始化所有集合
- **Acceptance Criteria Addressed**: [AC-1, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-4.1: 首次访问时自动初始化API密钥数据

## [x] Task 5: 更新环境变量配置
- **Priority**: P1
- **Depends On**: None
- **Description**: 
  - 更新.env.local添加必要的环境变量
  - 添加OpenAI API密钥配置
  - 添加数据库连接字符串
- **Acceptance Criteria Addressed**: [AC-2, AC-3]
- **Test Requirements**:
  - `programmatic` TR-5.1: 环境变量正确加载
  - `human-judgement` TR-5.2: 数据库连接成功

## [x] Task 6: 验证所有模块正常工作
- **Priority**: P0
- **Depends On**: All previous tasks
- **Description**: 
  - 验证支付管理、咨询管理、评论管理、API密钥管理模块
  - 确保AI生成功能正常
- **Acceptance Criteria Addressed**: [AC-1, AC-2, AC-3]
- **Test Requirements**:
  - `human-judgement` TR-6.1: 所有管理页面显示真实数据
  - `programmatic` TR-6.2: 所有API端点返回200状态