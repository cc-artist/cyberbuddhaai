# 管理后台真实数据修复 - 产品需求文档

## Overview
- **Summary**: 修复管理后台使用模拟数据的问题，确保所有管理模块使用真实数据库数据，并具备完整的CRUD操作功能。
- **Purpose**: 解决生产环境中支付管理、咨询管理、评论管理等模块数据无法获取的问题，确保后台管理功能正常运行。
- **Target Users**: 管理员用户

## Goals
- 移除所有模拟数据，确保后台使用真实数据库数据
- 修复数据库连接问题，确保数据正常获取
- 实现完整的CRUD操作（增删改查）
- 确保API密钥管理模块正常显示状态

## Non-Goals (Out of Scope)
- 不修改前端用户界面功能
- 不添加新的业务功能

## Background & Context
当前管理后台存在以下问题：
1. 支付管理、咨询管理数据无法获取
2. API信息状态异常
3. 首页评论区帖子管理模块未设置

## Functional Requirements
- **FR-1**: 支付管理模块能够获取真实数据库数据并支持状态更新
- **FR-2**: 咨询管理模块能够获取真实数据库数据并支持状态更新
- **FR-3**: 评论管理模块能够获取真实数据库数据并支持审核和删除
- **FR-4**: API密钥管理模块能够显示真实状态并支持管理

## Non-Functional Requirements
- **NFR-1**: 数据库连接必须稳定可靠
- **NFR-2**: API响应时间<2秒
- **NFR-3**: 数据必须实时同步

## Constraints
- **Technical**: MongoDB数据库连接
- **Dependencies**: NextAuth认证系统

## Assumptions
- 数据库已正确配置并可访问
- 环境变量已正确设置

## Acceptance Criteria

### AC-1: 支付管理模块正常工作
- **Given**: 管理员已登录后台
- **When**: 访问支付管理页面
- **Then**: 显示真实数据库中的支付记录，支持状态筛选和详情查看
- **Verification**: `human-judgment`

### AC-2: 咨询管理模块正常工作
- **Given**: 管理员已登录后台
- **When**: 访问咨询管理页面
- **Then**: 显示真实数据库中的咨询记录，支持状态更新
- **Verification**: `human-judgment`

### AC-3: 评论管理模块正常工作
- **Given**: 管理员已登录后台
- **When**: 访问评论管理页面
- **Then**: 显示真实数据库中的评论，支持审核和删除操作
- **Verification**: `human-judgment`

### AC-4: API密钥管理模块正常工作
- **Given**: 管理员已登录后台
- **When**: 访问API密钥管理页面
- **Then**: 显示真实的API密钥状态（已激活/未配置）
- **Verification**: `human-judgment`

## Open Questions
- [ ] 数据库连接字符串是否正确配置？
- [ ] 是否需要添加数据初始化脚本？