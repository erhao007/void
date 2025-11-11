# GLM大模型支持实现指南

## 概述
本指南详细说明了如何在VOID扩展中添加对GLM大模型的支持。GLM（General Language Model）是智谱AI开发的类Anthropic大模型，API格式与Anthropic兼容。

## 实现的更改

### 1. 添加GLM默认设置 (modelCapabilities.ts)

在`defaultProviderSettings`对象中添加了GLM的基本配置：
```typescript
glm: {
    apiKey: '',
},
```

在`defaultModelsOfProvider`对象中添加了GLM支持的模型列表：
```typescript
glm: [ // https://open.bigmodel.cn/
    'glm-4-plus',
    'glm-4-plus-latest', 
    'glm-4-flash',
    'glm-4-flash-latest',
],
```

### 2. 添加GLM模型配置 (modelCapabilities.ts)

添加了完整的GLM模型选项配置，包括：
- **glm-4-plus**: 标准高性能模型，100万token上下文
- **glm-4-plus-latest**: 最新版本的GLM-4-Plus
- **glm-4-flash**: 快速版本，成本更低，相同上下文长度
- **glm-4-flash-latest**: 最新版本的GLM-4-Flash

每个模型都配置了：
- 上下文窗口：1,000,000 tokens
- 预留输出空间：8,192 tokens
- 成本设置（基于实际价格）
- Anthropic风格的消息格式（因为API兼容）
- 分离式系统消息支持

### 3. 添加GLM回退逻辑 (modelCapabilities.ts)

实现了模型回退逻辑：
```typescript
modelOptionsFallback: (modelName) => {
    const lower = modelName.toLowerCase()
    let fallbackName: keyof typeof glmModelOptions | null = null
    if (lower.includes('glm-4-plus') || lower.includes('glm-4-plus-latest')) fallbackName = 'glm-4-plus'
    if (lower.includes('glm-4-flash') || lower.includes('glm-4-flash-latest')) fallbackName = 'glm-4-flash'
    if (fallbackName) return { modelName: fallbackName, recognizedModelName: fallbackName, ...glmModelOptions[fallbackName] }
    return null
},
```

### 4. 添加推理设置 (modelCapabilities.ts)

配置了推理能力设置，参考Anthropic实现：
```typescript
providerReasoningIOSettings: {
    input: {
        includeInPayload: (reasoningInfo) => {
            // GLM作为Anthropic兼容提供商，可以参考Anthropic的实现
            if (!reasoningInfo?.isReasoningEnabled) return null

            if (reasoningInfo.type === 'budget_slider_value') {
                return { thinking: { type: 'enabled', budget_tokens: reasoningInfo.reasoningBudget } }
            }
            return null
        }
    },
},
```

### 5. 添加UI显示信息 (voidSettingsTypes.ts)

在ProviderName判断逻辑中添加了GLM的显示标题：
```typescript
if (providerName === 'glm') return 'GLM (智谱 AI)'
```

添加了API Key获取链接和文档链接：
```typescript
if (providerName === 'glm') return 'Get your [API Key here](https://open.bigmodel.cn/usercenter/apikeys). Read about GLM API [here](https://open.bigmodel.cn/docs/).'
```

添加了API Key占位符：
```typescript
providerName === 'glm' ? 'glm-api-key...' :
```

### 6. 集成到模型设置提供者 (modelCapabilities.ts)

将GLM设置集成到`modelSettingsOfProvider`对象中：
```typescript
const modelSettingsOfProvider: { [providerName in ProviderName]: VoidStaticProviderInfo } = {
    // ... 其他提供商
    glm: glmSettings,
    // ... 其他提供商
}
```

## 配置说明

### 环境变量设置
根据用户提供的信息，GLM的配置类似于Anthropic：
```json
{
    "env": {
        "ANTHROPIC_AUTH_TOKEN": "your_zhipu_api_key",
        "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
        "API_TIMEOUT_MS": "3000000",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
    }
}
```

### 在VOID中的配置
用户需要在VOID扩展的设置中：
1. 选择GLM作为LLM提供商
2. 输入从智谱AI平台获取的API Key
3. 选择合适的模型（推荐glm-4-plus用于高质量对话，glm-4-flash用于快速响应）

## 特性支持

✅ **已支持的特性**：
- 基本的文本生成和对话
- 系统消息（分离式格式）
- Anthropic兼容的工具调用格式
- 模型回退逻辑
- 推理能力（如果模型支持）
- 成本追踪

❌ **暂不支持的特性**：
- FIM（Fill-in-Middle）功能
- 流式响应优化
- 特定的GLM特有功能

## 验证步骤

1. **检查设置**：
   - 确认在提供商列表中能看到"GLM (智谱 AI)"
   - 确认API Key输入框显示正确的占位符
   - 确认有API Key获取链接和文档链接

2. **测试连接**：
   - 输入有效的API Key
   - 选择GLM模型
   - 发送测试消息

3. **验证功能**：
   - 确认响应正常
   - 验证工具调用功能（如有需要）
   - 检查推理功能是否工作

## 注意事项

1. **API兼容性**：GLM使用Anthropic兼容的API格式，因此特殊工具格式设置为'anthropic-style'
2. **模型选择**：glm-4-plus提供更好的质量，glm-4-flash提供更快的速度和更低的成本
3. **推理功能**：当前GLM模型的推理能力配置为false，如果智谱AI推出支持推理的新模型，需要更新配置
4. **成本估算**：成本设置基于公开信息，可能需要根据实际使用情况调整

## 后续优化建议

1. **监控使用情况**：收集用户反馈，了解实际使用模式
2. **模型更新**：随着智谱AI发布新模型，及时更新模型列表
3. **性能优化**：根据使用情况优化API调用和响应处理
4. **功能扩展**：如果GLM推出新的API功能，考虑添加支持

---

**实现完成日期**：2025年1月
**实现状态**：✅ 完成
**测试状态**：🔄 待测试