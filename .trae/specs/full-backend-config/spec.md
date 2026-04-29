# 后端完整配置 - 产品需求文档

## Overview
- **Summary**: 移除所有模拟数据，创建完整的数据库驱动后端，配置AI大模型，确保管理后台所有模块都能正常获取和管理真实数据。
- **Purpose**: 解决后端使用模拟数据的问题，确保系统能真实运作。
- **Target Users**: 管理员用户

## Goals
- 移除所有内存模拟数据，改用数据库存储
- 创建API密钥数据库模型
- 配置AI大模型（OpenAI）
- 确保所有管理模块能正常获取真实数据
- 添加必要的环境变量配置

## Non-Goals (Out of Scope)
- 不修改前端用户界面功能
- 不添加新的业务功能

## Background & Context
当前后端存在以下问题：
1. API密钥管理使用内存模拟数据
2. AI大模型没有配置
3. 部分模块数据无法获取

## Functional Requirements
- **FR-1**: API密钥管理使用数据库存储
- **FR-2**: AI大模型（OpenAI）正确配置
- **FR-3**: 所有管理模块使用真实数据库数据
- **FR-4**: 提供完整的环境变量配置说明

## Non-Functional Requirements
- **NFR-1**: 数据库连接稳定可靠
- **NFR-2**: API响应时间<2秒
- **NFR-3**: 数据实时同步

## Constraints
- **Technical**: MongoDB数据库连接
- **Dependencies**: OpenAI API

## Assumptions
- 数据库已正确配置并可访问
- OpenAI API密钥已获取

## Acceptance Criteria

### AC-1: API密钥管理使用数据库
- **Given**: 管理员已登录后台
- **When**: 访问API密钥管理页面
- **Then**: 显示数据库中的API密钥记录，支持增删改查
- **Verification**: `human-judgment`

### AC-2: AI大模型配置完成
- **Given**: 管理员已配置OpenAI API密钥
- **When**: 调用AI生成接口
- **Then**: 成功生成内容，无错误
- **Verification**: `programmatic`

### AC-3: 所有管理模块正常工作
- **Given**: 管理员已登录后台
- **When**: 访问各管理页面
- **Then**: 所有模块显示真实数据库数据
- **Verification**: `human-judgment`

## Open Questions
- [ ] OpenAI API密钥是否已获取？
- [ ] 是否需要配置其他AI模型？