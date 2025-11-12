[根目录](../../../../CLAUDE.md) > [src](../../../) > [vs](../../) > [workbench](../) > [contrib](../../) > **void**

# Void 核心功能模块

Void 的核心功能实现，包含 AI 聊天、代码编辑、设置管理等功能。

## 模块职责

这个模块是 Void 项目的核心，实现了所有 AI 辅助编程功能：
- AI 聊天界面和线程管理
- 代码编辑和应用功能
- 设置和提供商管理
- 工具服务和 MCP 集成
- 指标收集和用户反馈

## 目录结构

```
void/
├── browser/           # 浏览器进程组件
├── common/           # 跨进程共享服务和类型定义
├── electron-main/    # 主进程服务
└── CLAUDE.md        # 本文档
```

## 子模块说明

### browser/ - 浏览器进程组件
负责用户界面渲染和用户交互处理，包含：
- React UI 组件和界面逻辑
- 浏览器端的服务实现
- 用户输入处理和事件管理

### common/ - 跨进程共享服务
定义了可以在浏览器进程和主进程之间共享的：
- 服务接口和类型定义
- 数据模型和配置结构
- 通信协议和消息格式

### electron-main/ - 主进程服务
处理需要在主进程中运行的功能：
- LLM 消息发送（避免 CSP 问题）
- 系统级文件操作
- 外部工具集成

## 核心服务

### IVoidSettingsService
管理所有 Void 相关的设置，包括：
- LLM 提供商配置
- 模型选择和参数
- 全局设置和用户偏好
- 加密存储敏感信息

### IChatThreadService
处理聊天线程的生命周期管理：
- 消息历史记录
- 线程状态管理
- 上下文收集
- 重试机制

### ISendLLMMessageService
LLM 消息发送的核心服务：
- 支持多个 LLM 提供商
- 统一的消息格式处理
- 错误处理和重试
- 流式响应支持

### IEditCodeService
代码编辑和应用功能：
- 快速应用模式（Search/Replace）
- 慢速应用模式（文件重写）
- 差异计算和显示
- 批量编辑操作

### IToolsService
工具调用服务：
- 内置工具（Edit, Read, Write 等）
- 自定义工具扩展
- 工具权限管理
- 执行结果处理

## 关键文件

| 文件路径 | 描述 |
|---------|------|
| `browser/voidSettingsPane.ts` | 设置界面编辑器 |
| `browser/sidebarPane.ts` | 侧边栏聊天界面 |
| `browser/chatThreadService.ts` | 聊天线程管理服务 |
| `common/voidSettingsService.ts` | 设置服务核心实现 |
| `common/sendLLMMessageService.ts` | LLM 消息发送服务 |
| `common/voidSettingsTypes.ts` | 设置类型定义 |
| `electron-main/sendLLMMessageChannel.ts` | 主进程 LLM 消息通道 |

## 开发指南

### 添加新功能
1. 在 `common/` 中定义类型和接口
2. 在 `browser/` 中实现 UI 组件
3. 在 `electron-main/` 中实现需要主进程访问的功能
4. 通过 Channel 进行进程间通信

### 修改现有功能
- UI 修改：主要在 `browser/react/src/` 目录
- 服务逻辑：在 `common/` 或对应的进程目录
- 类型定义：在 `common/` 的类型文件中

### 调试技巧
- 浏览器进程：使用 Chrome DevTools
- 主进程：使用 VS Code 调试配置
- 进程间通信：查看 Console 日志

## 依赖关系

```
Void 模块依赖关系：
├── VS Code Platform Services
├── React (UI 组件)
├── Electron (进程管理)
└── 外部 LLM 提供商 APIs
```

## 测试

### 单元测试
- 服务层逻辑测试
- 类型定义验证
- 消息格式测试

### 集成测试
- UI 组件交互测试
- 进程间通信测试
- 端到端功能测试

## 常见问题 (FAQ)

### Q: 如何添加新的 LLM 提供商？
A: 在 `common/modelCapabilities.ts` 中添加提供商定义，并在 `electron-main/sendLLMMessage.ts` 中实现发送逻辑。

### Q: React 组件如何与 VS Code 服务交互？
A: 通过 `util/services.tsx` 中的服务访问函数，在组件挂载时获取服务实例。

### Q: 主进程和浏览器进程如何通信？
A: 使用 VS Code 的 Channel 机制，在 `electron-main/` 中定义 Channel，在 `browser/` 中通过服务代理访问。

## 相关文件清单

- **服务接口**：`common/*Service.ts`, `common/*Types.ts`
- **UI 组件**：`browser/react/src/**/*.tsx`
- **主进程服务**：`electron-main/*.ts`
- **工具服务**：`common/toolsServiceTypes.ts`
- **设置管理**：`common/voidSettings*.ts`

## 变更记录 (Changelog)

### 2025-11-12 16:33:50
- 创建 Void 核心模块文档
- 分析模块结构和关键服务
- 整理开发指南和常见问题

---
*本文档是 Void 项目架构文档的一部分，专注于核心功能模块的实现细节。*