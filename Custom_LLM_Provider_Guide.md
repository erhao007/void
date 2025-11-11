# VOID扩展添加自定义LLM提供商指南

## 概述
VOID扩展已支持多种LLM提供商，您可以通过以下两种方式添加自定义提供商：

1. **简单方式**: 配置为OpenAI兼容提供商（推荐）
2. **完整方式**: 添加专用提供商支持

---

## 🎯 方案一：OpenAI兼容提供商（推荐）

这是最简单的添加方式，适用于大多数自定义LLM服务（如自建模型、代理服务等）。

### 实现步骤

#### 1. 在voidSettingsTypes.ts中添加提供商选项

```typescript
// 在 displayInfoOfProviderName 函数中添加
else if (providerName === 'myCustomProvider') {
    return { title: 'My Custom Provider' }
}

// 在 subTextMdOfProviderName 函数中添加
if (providerName === 'myCustomProvider') return 'Your custom API documentation link.'

// 在 displayInfoOfSettingName 函数中添加支持字段
if (settingName === 'apiKey') {
    return {
        title: 'API Key',
        placeholder: 'your-api-key...',
        isPasswordField: true,
    }
} else if (settingName === 'endpoint') {
    return {
        title: 'baseURL',
        placeholder: 'https://your-api.com/v1'
    }
}
```

#### 2. 在modelCapabilities.ts中添加模型配置

```typescript
// 在 defaultModelsOfProvider 中添加
myCustomProvider: [
    'your-model-name-1',
    'your-model-name-2',
],

// 添加完整的提供商配置
myCustomProvider: {
    modelOptions: {
        'your-model-name-1': {
            providerName: 'myCustomProvider',
            modelName: 'your-model-name-1',
            recognizedModelName: 'your-model-name-1',
            supportsSystemMessage: 'system-role',
            specialToolFormat: 'openai-style',
            maxContextLength: 8192,
            supportsStreaming: true,
            supportsFIM: true,
        },
        // 更多模型配置...
    },
    modelName: 'your-default-model-name',
    recognizedModelName: 'your-default-model-name',
},
```

#### 3. 在voidSettingsService.ts中添加默认配置

```typescript
// 在 getState 函数中添加
myCustomProvider: {
    ...defaultProviderSettings.myCustomProvider,
    ...modelInfoOfDefaultModelNames(defaultModelsOfProvider.myCustomProvider),
},
```

---

## 🛠️ 方案二：专用提供商实现

如果需要特殊的API逻辑或功能，需要实现专用支持。

### 1. 修改类型定义

#### voidSettingsTypes.ts
```typescript
// 在 ProviderName 类型中添加新提供商
export type ProviderName = keyof typeof defaultProviderSettings // 现在包含 'myCustomProvider'

// 在 localProviderNames 和 nonlocalProviderNames 中适当添加
```

#### modelCapabilities.ts
```typescript
// 添加模型能力配置
const myCustomProviderCapabilities = {
    supportsSystemMessage: 'system-role' as const,
    specialToolFormat: 'openai-style' as const,
    supportsStreaming: true,
    supportsFIM: true,
    maxContextLength: 8192,
}
```

### 2. 实现API调用逻辑

#### sendLLMMessage.impl.ts
```typescript
// 添加新的提供商SDK初始化逻辑
else if (providerName === 'myCustomProvider') {
    // 特殊API密钥验证
    if (!thisConfig.apiKey) {
        throw new Error('API key is required for MyCustomProvider')
    }
    
    // 初始化自定义SDK或客户端
    // 这里可以初始化专门的SDK或者使用通用的HTTP客户端
    const client = new CustomLLMClient({
        apiKey: thisConfig.apiKey,
        baseURL: thisConfig.endpoint,
        // 其他配置...
    })
    
    return client
}
```

### 3. 添加模型列表支持

如果需要动态获取模型列表：

#### voidSettingsTypes.ts
```typescript
// 添加模型响应类型
export type MyCustomModelResponse = {
    id: string;
    name: string;
    created: number;
    // 其他字段...
}
```

#### voidSettingsService.ts
```typescript
// 实现模型列表获取
const getMyCustomModels = async (settings: MyCustomProviderSettings) => {
    const response = await fetch(`${settings.endpoint}/models`, {
        headers: {
            'Authorization': `Bearer ${settings.apiKey}`,
            // 其他必需的headers...
        }
    })
    return response.json()
}
```

---

## 📁 需要修改的文件列表

### 核心文件
1. `src/vs/workbench/contrib/void/common/voidSettingsTypes.ts`
2. `src/vs/workbench/contrib/void/common/modelCapabilities.ts` 
3. `src/vs/workbench/contrib/void/common/voidSettingsService.ts`

### 实现文件
4. `src/vs/workbench/contrib/void/electron-main/llmMessage/sendLLMMessage.impl.ts`

### 类型文件（如果需要）
5. `src/vs/workbench/contrib/void/common/sendLLMMessageTypes.ts`

---

## 🔧 配置示例

### 基础配置结构
```typescript
// defaultProviderSettings 中的配置
myCustomProvider: {
    endpoint: 'https://your-api.com/v1',
    apiKey: '', // 用户填写
    models: [], // 动态填充
    _didFillInProviderSettings: false,
}
```

### 客户端配置示例
```typescript
// 如果使用HTTP客户端
const config = {
    baseURL: settings.endpoint,
    headers: {
        'Authorization': `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
        // 其他headers...
    },
    timeout: 30000,
}
```

---

## ⚡ 快速开始步骤

### 1. 选择实现方式
- 如果您的LLM服务兼容OpenAI格式 → 使用方案一
- 如果需要特殊功能 → 使用方案二

### 2. 添加基础配置
按照上面的步骤修改相关文件

### 3. 测试配置
```typescript
// 测试连接
const testConnection = async () => {
    try {
        const response = await fetch(`${endpoint}/models`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        })
        console.log('Connection successful:', response.status)
    } catch (error) {
        console.error('Connection failed:', error)
    }
}
```

### 4. 调试常见问题
- 检查API端点URL是否正确
- 验证API密钥格式
- 确认支持的请求格式（OpenAI兼容 vs 自定义）
- 检查CORS配置（对于Web应用）

---

## 📚 参考现有实现

VOID中已有多个提供商的实现可以参考：
- **OpenAI**: 官方SDK + Azure扩展
- **Anthropic**: 官方SDK 
- **Ollama**: OpenAI兼容 + 特殊模型列表
- **LiteLLM**: 聚合器模式
- **Gemini**: Google SDK

通过分析这些现有实现，您可以理解不同提供商的集成模式。

---

## 🎯 推荐方案

对于大多数自定义LLM服务，**强烈推荐使用方案一（OpenAI兼容）**，因为：
- 实施简单快速
- 复用现有代码
- 支持流式响应
- 支持函数调用
- 自动模型发现

只有在需要特殊功能时才考虑方案二。