[根目录](../../../../../CLAUDE.md) > [src](../../../../) > [vs](../../../) > [workbench](../../) > [contrib](../../../) > [void](../../) > **common**

# Void 通用服务模块

Void 的跨进程共享服务和类型定义，提供核心业务逻辑和数据模型。

## 模块职责

这个模块定义了 Void 的核心服务和类型，可以在浏览器进程和主进程之间共享：
- 服务接口和抽象定义
- 数据模型和类型结构
- 通信协议和消息格式
- 工具集成和 MCP 支持
- 提示词和模型能力管理

## 目录结构

```
common/
├── services/                   # 服务接口和类型
│   ├── voidSettingsService.ts  # 设置服务接口
│   ├── chatThreadService.ts    # 聊天线程服务类型
│   ├── sendLLMMessageService.ts # LLM 消息服务接口
│   ├── toolsService.ts         # 工具服务接口
│   ├── mcpService.ts          # MCP 服务接口
│   └── metricsService.ts      # 指标收集服务
├── types/                      # 类型定义
│   ├── voidSettingsTypes.ts   # 设置相关类型
│   ├── chatThreadServiceTypes.ts # 聊天线程类型
│   ├── sendLLMMessageTypes.ts # LLM 消息类型
│   ├── toolsServiceTypes.ts   # 工具服务类型
│   ├── mcpServiceTypes.ts     # MCP 类型定义
│   └── editCodeServiceTypes.ts # 代码编辑类型
├── helpers/                    # 辅助函数
│   ├── util.ts               # 通用工具函数
│   ├── languageHelpers.ts    # 语言检测辅助
│   ├── systemInfo.ts         # 系统信息获取
│   ├── extractCodeFromResult.ts # 代码提取
│   └── colors.ts             # 颜色处理
├── prompts/                    # AI 提示词
│   └── prompts.ts            # 系统提示词定义
├── capabilities/               # 模型能力
│   └── modelCapabilities.ts  # 模型能力配置
├── i18n/                      # 国际化
│   ├── en-US.json           # 英文翻译
│   └── zh-CN.json           # 中文翻译
├── storageKeys.ts             # 存储键定义
└── CLAUDE.md                 # 本文档
```

## 核心服务接口

### IVoidSettingsService
管理所有 Void 相关的设置：

#### 主要功能
- **提供商管理**：添加、编辑、删除 LLM 提供商
- **模型配置**：选择和配置不同的 AI 模型
- **全局设置**：管理 Void 的全局配置
- **加密存储**：安全存储敏感信息如 API 密钥

#### 关键类型
```typescript
type ProviderName = 'openAI' | 'anthropic' | 'ollama' | 'google' | 'mistral'
type FeatureName = 'chat' | 'autocomplete' | 'ctrlK' | 'apply'
type ModelSelection = { providerName: ProviderName, modelName: string }
```

### IChatThreadService
处理聊天线程的生命周期管理：

#### 主要功能
- **线程管理**：创建、删除、切换聊天线程
- **消息处理**：管理消息的发送、接收和存储
- **上下文收集**：收集相关代码上下文
- **工具调用**：处理 AI 工具调用请求

#### 关键类型
```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ToolCall[]
  timestamp: number
}
```

### ISendLLMMessageService
LLM 消息发送的核心服务：

#### 主要功能
- **多提供商支持**：统一接口支持不同 LLM 提供商
- **流式响应**：支持流式消息接收
- **错误处理**：完善的错误重试机制
- **工具调用**：支持工具调用和函数执行

#### 关键类型
```typescript
interface LLMMessage {
  role: 'user' | 'assistant' | 'system'
  content?: string
  toolCalls?: RawToolCallObj[]
  toolResponses?: ToolResponse[]
}
```

### IToolsService
工具调用服务：

#### 内置工具
- **Edit**：代码编辑工具
- **Read**：文件读取工具
- **Write**：文件写入工具
- **Search**：代码搜索工具

#### 自定义工具
- 支持用户定义自定义工具
- 工具权限管理
- 工具执行结果处理

### IMCPService
Model Context Protocol 服务：

#### 主要功能
- **MCP 服务器管理**：连接和管理 MCP 服务器
- **工具扩展**：通过 MCP 扩展可用工具
- **资源管理**：访问外部资源和 API

## 数据模型和类型

### 设置相关类型 (voidSettingsTypes.ts)

#### ProviderSettings
```typescript
interface ProviderSettings {
  apiKey?: string
  baseURL?: string
  organization?: string
  customHeaders?: Record<string, string>
}
```

#### ModelSelectionOptions
```typescript
interface ModelSelectionOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}
```

### 聊天相关类型 (chatThreadServiceTypes.ts)

#### StagingSelectionItem
```typescript
interface StagingSelectionItem {
  id: string
  uri: string
  selection: { start: number, end: number }
  content: string
  language: string
}
```

#### CheckpointEntry
```typescript
interface CheckpointEntry {
  id: string
  name: string
  timestamp: number
  description?: string
  changes: FileChange[]
}
```

## 提示词管理

### prompts.ts
定义了系统级别的 AI 提示词：

#### 系统提示词
- 定义 AI 助手的行为和角色
- 设置代码生成和编辑的指导原则
- 指定工具使用规则

#### 特定功能提示词
- 代码审查提示词
- 代码生成提示词
- 错误修复提示词

## 模型能力管理

### modelCapabilities.ts
定义不同 AI 模型的能力配置：

#### 模型能力定义
- **支持的上下文长度**
- **工具调用能力**
- **流式响应支持**
- **代码生成能力**
- **多模态支持**

#### 模型配置
```typescript
interface ModelCapability {
  maxTokens: number
  supportsTools: boolean
  supportsStreaming: boolean
  supportedFeatures: FeatureName[]
  costPer1MInputTokens?: number
  costPer1MOutputTokens?: number
}
```

## 工具集成

### 工具服务类型 (toolsServiceTypes.ts)

#### 内置工具定义
- **EditTool**：编辑代码文件
- **ReadTool**：读取文件内容
- **WriteTool**：写入新文件
- **SearchTool**：搜索代码

#### 工具调用流程
1. AI 请求工具调用
2. 服务验证工具权限
3. 执行工具操作
4. 返回执行结果
5. AI 基于结果继续响应

### MCP 集成 (mcpServiceTypes.ts)

#### MCP 服务器管理
- 服务器连接和认证
- 工具列表同步
- 资源访问控制

#### MCP 工具调用
- 标准化的工具调用协议
- 跨平台的工具支持
- 实时的工具更新

## 国际化支持

### 翻译文件
- `en-US.json`：英文翻译
- `zh-CN.json`：中文翻译

### 翻译键命名约定
```typescript
{
  "settings.provider.title": "Provider Settings",
  "chat.placeholder": "Ask Void anything about your code...",
  "errors.network.title": "Network Error"
}
```

## 存储管理

### storageKeys.ts
定义所有存储键常量：

#### 设置存储
```typescript
export const VOID_SETTINGS_STORAGE_KEY = 'void.voidSettings'
export const THREAD_STORAGE_KEY = 'void.threads'
export const METRICS_STORAGE_KEY = 'void.metrics'
```

#### 存储策略
- 使用 VS Code 的存储服务
- 敏感信息加密存储
- 自动数据迁移和版本管理

## 开发指南

### 添加新服务
1. 在 `types/` 中定义接口和类型
2. 在 `services/` 中实现服务接口
3. 注册到依赖注入系统
4. 添加必要的错误处理

### 类型定义规范
- 使用 interface 定义对象结构
- 使用 type 定义联合类型和别名
- 保持类型的一致性和可扩展性
- 添加详细的 JSDoc 注释

### 错误处理
- 定义统一的错误类型
- 提供有意义的错误消息
- 实现适当的重试机制
- 记录详细的错误日志

## 性能优化

### 类型优化
- 使用类型推导减少冗余
- 避免过深的类型嵌套
- 合理使用泛型和条件类型

### 内存管理
- 及时释放资源引用
- 避免内存泄漏
- 优化大对象的存储

## 常见问题 (FAQ)

### Q: 如何添加新的 LLM 提供商？
A: 在 `modelCapabilities.ts` 中添加提供商定义，并实现相应的消息发送逻辑。

### Q: 工具调用的安全机制是什么？
A: 通过权限验证、沙箱执行和结果验证确保工具调用的安全性。

### Q: 如何处理模型上下文长度限制？
A: 实现智能的上下文截断和优先级管理机制。

### Q: MCP 服务器如何连接和认证？
A: 通过标准化的 MCP 协议，支持多种认证方式。

## 相关文件清单

### 核心服务
- `voidSettingsService.ts` - 设置管理服务
- `chatThreadService.ts` - 聊天线程服务
- `sendLLMMessageService.ts` - LLM 消息服务

### 类型定义
- `voidSettingsTypes.ts` - 设置相关类型
- `chatThreadServiceTypes.ts` - 聊天类型
- `sendLLMMessageTypes.ts` - 消息类型

### 工具和配置
- `modelCapabilities.ts` - 模型能力配置
- `prompts/prompts.ts` - 系统提示词
- `storageKeys.ts` - 存储键定义

## 变更记录 (Changelog)

### 2025-11-12 16:33:50
- 创建通用服务模块文档
- 分析核心服务接口和类型
- 整理开发指南和最佳实践

---
*本文档是 Void 项目架构文档的一部分，专注于通用服务模块的设计和实现。*