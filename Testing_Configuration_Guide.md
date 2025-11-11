# 自定义LLM提供商测试和配置指南

## 🧪 测试策略

### 1. 单元测试

#### API连接测试
```typescript
// tests/connectivity.test.ts
describe('MyCustomLLM Connectivity', () => {
    test('should connect to API endpoint', async () => {
        const endpoint = 'https://your-api.com/v1'
        const response = await fetch(`${endpoint}/models`, {
            headers: { 'Authorization': 'Bearer test-key' }
        })
        expect(response.status).toBe(200)
    })
    
    test('should validate API key format', () => {
        const validKey = 'sk-1234567890abcdef...'
        const invalidKey = 'invalid-key-format'
        
        expect(isValidAPIKey(validKey)).toBe(true)
        expect(isValidAPIKey(invalidKey)).toBe(false)
    })
    
    test('should handle endpoint validation', () => {
        const validEndpoint = 'https://your-api.com/v1'
        const invalidEndpoint = 'not-a-valid-url'
        
        expect(isValidEndpoint(validEndpoint)).toBe(true)
        expect(isValidEndpoint(invalidEndpoint)).toBe(false)
    })
})
```

#### 消息处理测试
```typescript
// tests/message-handling.test.ts
describe('Message Handling', () => {
    test('should convert messages to correct format', () => {
        const messages = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' }
        ]
        
        const converted = convertMessagesForMyCustomLLM(messages)
        expect(converted).toHaveLength(2)
        expect(converted[0].role).toBe('user')
        expect(converted[1].role).toBe('assistant')
    })
    
    test('should handle tool calls', () => {
        const toolMessage = {
            role: 'tool',
            content: 'Tool result data',
            tool_call_id: 'call_123'
        }
        
        const formatted = formatToolMessage(toolMessage)
        expect(formatted.type).toBe('tool_result')
        expect(formatted.tool_use_id).toBe('call_123')
    })
})
```

### 2. 集成测试

#### 完整工作流测试
```typescript
// tests/integration.test.ts
describe('MyCustomLLM Integration', () => {
    let settings: MyCustomLLMSettings
    
    beforeEach(() => {
        settings = {
            endpoint: 'https://your-api.com/v1',
            apiKey: process.env.TEST_API_KEY || 'test-key',
            _didFillInProviderSettings: true
        }
    })
    
    test('should send chat message and receive response', async () => {
        const service = new LLMMessageService()
        const message: ChatMessage = {
            role: 'user',
            content: 'What is 2+2?'
        }
        
        const response = await service.sendMessage(settings, message)
        expect(response).toBeDefined()
        expect(response.content).toBeTruthy()
    })
    
    test('should handle streaming responses', async () => {
        const stream = await service.streamMessage(settings, testMessage)
        const chunks: string[] = []
        
        for await (const chunk of stream) {
            chunks.push(chunk)
        }
        
        expect(chunks.length).toBeGreaterThan(0)
        expect(chunks.join('')).toContain('4')
    })
})
```

### 3. 端到端测试

#### 用户界面测试
```typescript
// tests/e2e/void-settings.e2e.test.ts
describe('VOID Settings E2E', () => {
    test('user can configure MyCustomLLM', async () => {
        // 打开设置页面
        await vscode.commands.executeCommand('workbench.action.openSettings')
        
        // 输入API Key
        const apiKeyInput = await page.waitForSelector('[data-testid="apiKeyInput"]')
        await apiKeyInput.fill('test-api-key')
        
        // 选择模型
        const modelSelector = await page.waitForSelector('[data-testid="modelSelector"]')
        await modelSelector.select('custom-model-1')
        
        // 测试连接
        const testButton = await page.waitForSelector('[data-testid="testConnectionButton"]')
        await testButton.click()
        
        // 验证连接状态
        const status = await page.waitForSelector('[data-testid="connectionStatus"]')
        await expect(status).toHaveText('Connected')
    })
})
```

---

## ⚙️ 配置建议

### 1. 开发环境配置

```typescript
// .env.development
VOID_MY_CUSTOM_LLM_ENDPOINT=https://api.dev.yourdomain.com/v1
VOID_MY_CUSTOM_LLM_API_KEY=your-dev-api-key
VOID_DEBUG_MODE=true
```

```typescript
// src/vs/workbench/contrib/void/common/developmentConfig.ts
export const developmentConfig = {
    myCustomLLM: {
        endpoint: process.env.VOID_MY_CUSTOM_LLM_ENDPOINT,
        apiKey: process.env.VOID_MY_CUSTOM_LLM_API_KEY,
        debug: process.env.VOID_DEBUG_MODE === 'true'
    }
}
```

### 2. 生产环境配置

```typescript
// src/vs/workbench/contrib/void/common/productionConfig.ts
export const productionConfig = {
    myCustomLLM: {
        // 确保在生产环境中使用安全的配置方式
        getEndpoint: () => {
            const endpoint = vscode.workspace.getConfiguration().get<string>('void.myCustomLLM.endpoint')
            if (!endpoint) {
                throw new Error('MyCustomLLM endpoint not configured')
            }
            return endpoint
        },
        getApiKey: () => {
            const apiKey = vscode.workspace.getConfiguration().get<string>('void.myCustomLLM.apiKey')
            if (!apiKey) {
                throw new Error('MyCustomLLM API key not configured')
            }
            return apiKey
        }
    }
}
```

### 3. 设置验证配置

```typescript
// src/vs/workbench/contrib/void/common/settingValidators.ts
export class MyCustomLLMValidator {
    static validateEndpoint(endpoint: string): ValidationResult {
        try {
            const url = new URL(endpoint)
            if (!['http:', 'https:'].includes(url.protocol)) {
                return { isValid: false, error: 'Endpoint must use HTTP or HTTPS' }
            }
            return { isValid: true }
        } catch {
            return { isValid: false, error: 'Invalid URL format' }
        }
    }
    
    static validateApiKey(apiKey: string): ValidationResult {
        if (!apiKey || apiKey.length < 10) {
            return { isValid: false, error: 'API key must be at least 10 characters' }
        }
        
        // 添加更多验证规则
        if (!/^[a-zA-Z0-9-_]+$/.test(apiKey)) {
            return { isValid: false, error: 'API key contains invalid characters' }
        }
        
        return { isValid: true }
    }
    
    static validateModel(model: string, availableModels: string[]): ValidationResult {
        if (!availableModels.includes(model)) {
            return { isValid: false, error: `Model ${model} not available` }
        }
        return { isValid: true }
    }
}
```

---

## 🔧 调试配置

### 1. 启用调试模式

```typescript
// 在 package.json 中添加调试命令
{
    "scripts": {
        "dev:debug": "npm run build && npm run test:debug",
        "test:debug": "node --inspect-brk ./node_modules/.bin/vscode-test",
        "void:debug:custom": "VOID_DEBUG=customProvider npm run void:test"
    }
}
```

### 2. 调试工具配置

```typescript
// src/vs/workbench/contrib/void/common/debugTools.ts
export class MyCustomLLMDebugger {
    static enableDebugMode() {
        vscode.workspace.getConfiguration().update(
            'void.myCustomLLM.debug', 
            true, 
            vscode.ConfigurationTarget.Global
        )
    }
    
    static logRequest(request: any) {
        if (this.isDebugEnabled()) {
            console.group('🔍 MyCustomLLM Request')
            console.log('Endpoint:', request.endpoint)
            console.log('Headers:', request.headers)
            console.log('Payload:', request.payload)
            console.groupEnd()
        }
    }
    
    static logResponse(response: any) {
        if (this.isDebugEnabled()) {
            console.group('📤 MyCustomLLM Response')
            console.log('Status:', response.status)
            console.log('Headers:', response.headers)
            console.log('Data:', response.data)
            console.groupEnd()
        }
    }
    
    private static isDebugEnabled(): boolean {
        return vscode.workspace.getConfiguration().get('void.myCustomLLM.debug') === true
    }
}
```

---

## 📊 性能测试

### 1. 响应时间测试

```typescript
// tests/performance.test.ts
describe('MyCustomLLM Performance', () => {
    test('should respond within 5 seconds', async () => {
        const start = Date.now()
        const response = await service.sendMessage(settings, testMessage)
        const duration = Date.now() - start
        
        expect(duration).toBeLessThan(5000)
        expect(response).toBeDefined()
    })
    
    test('should handle concurrent requests', async () => {
        const requests = Array(10).fill(0).map(() => 
            service.sendMessage(settings, testMessage)
        )
        
        const responses = await Promise.all(requests)
        
        expect(responses).toHaveLength(10)
        responses.forEach(response => {
            expect(response).toBeDefined()
        })
    })
})
```

### 2. 内存使用测试

```typescript
// tests/memory.test.ts
describe('MyCustomLLM Memory Usage', () => {
    test('should not leak memory', async () => {
        const initialMemory = process.memoryUsage().heapUsed
        
        // 执行大量请求
        for (let i = 0; i < 100; i++) {
            await service.sendMessage(settings, testMessage)
        }
        
        const finalMemory = process.memoryUsage().heapUsed
        const memoryIncrease = finalMemory - initialMemory
        
        // 内存增长不应超过 50MB
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })
})
```

---

## 🚨 错误处理测试

### 1. 网络错误测试

```typescript
// tests/error-handling.test.ts
describe('MyCustomLLM Error Handling', () => {
    test('should handle network timeout', async () => {
        const timeoutSettings = { ...settings, timeout: 100 } // 100ms timeout
        
        await expect(service.sendMessage(timeoutSettings, testMessage))
            .rejects
            .toThrow('Request timeout')
    })
    
    test('should handle invalid API key', async () => {
        const invalidSettings = { ...settings, apiKey: 'invalid-key' }
        
        await expect(service.sendMessage(invalidSettings, testMessage))
            .rejects
            .toThrow('Unauthorized')
    })
    
    test('should handle API rate limiting', async () => {
        const rateLimitSettings = settings
        
        // 发送多个请求触发速率限制
        for (let i = 0; i < 100; i++) {
            await service.sendMessage(rateLimitSettings, testMessage)
        }
        
        // 最后一个请求应该被限制
        await expect(service.sendMessage(rateLimitSettings, testMessage))
            .rejects
            .toThrow('Rate limit exceeded')
    })
})
```

---

## 🔍 故障排除指南

### 1. 常见问题诊断

#### 连接问题
```typescript
// 诊断脚本
const diagnoseConnection = async (settings: MyCustomLLMSettings) => {
    const issues = []
    
    // 检查端点格式
    try {
        new URL(settings.endpoint)
    } catch {
        issues.push('❌ Invalid endpoint URL format')
    }
    
    // 检查API密钥格式
    if (!settings.apiKey || settings.apiKey.length < 10) {
        issues.push('❌ API key is missing or too short')
    }
    
    // 测试连接
    try {
        const response = await fetch(`${settings.endpoint}/models`, {
            headers: { 'Authorization': `Bearer ${settings.apiKey}` }
        })
        
        if (!response.ok) {
            issues.push(`❌ API returned status: ${response.status}`)
        }
    } catch (error) {
        issues.push(`❌ Connection failed: ${error.message}`)
    }
    
    if (issues.length === 0) {
        console.log('✅ All checks passed!')
    } else {
        console.log('Found issues:')
        issues.forEach(issue => console.log(issue))
    }
}
```

#### 模型不可用
```typescript
const troubleshootModel = async (settings: MyCustomLLMSettings, model: string) => {
    try {
        // 获取可用模型列表
        const response = await fetch(`${settings.endpoint}/models`, {
            headers: { 'Authorization': `Bearer ${settings.apiKey}` }
        })
        
        const data = await response.json()
        const availableModels = data.data.map((m: any) => m.id)
        
        if (!availableModels.includes(model)) {
            console.log(`❌ Model "${model}" not available`)
            console.log('Available models:', availableModels.join(', '))
            return false
        }
        
        console.log(`✅ Model "${model}" is available`)
        return true
    } catch (error) {
        console.log(`❌ Failed to check model availability: ${error.message}`)
        return false
    }
}
```

### 2. 日志配置

```typescript
// src/vs/workbench/contrib/void/common/logging.ts
export class MyCustomLLMLogger {
    static configure() {
        // 配置专用日志记录器
        const outputChannel = vscode.window.createOutputChannel('MyCustomLLM')
        
        return {
            info: (message: string) => outputChannel.appendLine(`[INFO] ${message}`),
            error: (message: string) => outputChannel.appendLine(`[ERROR] ${message}`),
            warn: (message: string) => outputChannel.appendLine(`[WARN] ${message}`),
            debug: (message: string) => outputChannel.appendLine(`[DEBUG] ${message}`)
        }
    }
}
```

---

## 📈 监控和指标

### 1. 使用情况监控

```typescript
// src/vs/workbench/contrib/void/common/metrics.ts
export class MyCustomLLMMetrics {
    private static metrics = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        lastUsed: null
    }
    
    static recordRequest(duration: number, success: boolean) {
        this.metrics.totalRequests++
        
        if (success) {
            this.metrics.successfulRequests++
        } else {
            this.metrics.failedRequests++
        }
        
        // 更新平均响应时间
        this.metrics.averageResponseTime = 
            (this.metrics.averageResponseTime + duration) / 2
        
        this.metrics.lastUsed = new Date()
    }
    
    static getMetrics() {
        return {
            ...this.metrics,
            successRate: this.metrics.totalRequests > 0 
                ? this.metrics.successfulRequests / this.metrics.totalRequests 
                : 0
        }
    }
}
```

---

## 🎯 配置最佳实践

### 1. 安全性最佳实践
- ✅ 使用环境变量存储API密钥
- ✅ 验证所有用户输入
- ✅ 使用HTTPS端点
- ✅ 实施速率限制
- ❌ 不在代码中硬编码敏感信息

### 2. 性能最佳实践
- ✅ 实施请求超时
- ✅ 使用连接池
- ✅ 缓存模型列表
- ✅ 实施重试逻辑
- ❌ 避免不必要的请求

### 3. 用户体验最佳实践
- ✅ 提供清晰的错误消息
- ✅ 实施设置验证
- ✅ 显示连接状态
- ✅ 提供测试连接功能
- ❌ 不暴露内部实现细节

---

通过以上测试和配置建议，您可以确保自定义LLM提供商在VOID扩展中稳定、高效地运行！