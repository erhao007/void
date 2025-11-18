[根目录](../CLAUDE.md) > **test**

# Void 测试模块

Void 的完整测试套件，确保代码质量和功能正确性。

## 模块职责

这个模块负责 Void 的所有测试活动：
- 单元测试：测试独立的功能模块
- 集成测试：测试模块间的交互
- 冒烟测试：端到端功能测试
- 自动化测试：基于 Playwright 的 UI 自动化测试
- 性能测试：性能和稳定性测试

## 目录结构

```
test/
├── README.md                    # 测试说明文档
├── package.json                 # 测试依赖配置
├── unit/                        # 单元测试
│   ├── browser/                 # 浏览器环境测试
│   │   ├── index.js             # 浏览器测试入口
│   │   ├── renderer.html        # 浏览器测试页面
│   │   └── *.test.js            # 具体测试文件
│   ├── electron/                # Electron 环境测试
│   │   ├── index.js             # Electron 测试入口
│   │   ├── preload.js           # 预加载脚本
│   │   └── *.test.js            # 具体测试文件
│   ├── node/                    # Node.js 环境测试
│   │   ├── index.js             # Node.js 测试入口
│   │   └── *.test.js            # 具体测试文件
│   └── *.test.js                # 通用单元测试
├── integration/                 # 集成测试
│   ├── browser/                 # 浏览器集成测试
│   │   ├── package.json         # 浏览器测试配置
│   │   ├── src/                 # 测试源码
│   │   │   └── index.ts         # 集成测试入口
│   │   └── tsconfig.json        # TypeScript 配置
│   └── electron/                # Electron 集成测试
│       ├── testrunner.js        # Electron 测试运行器
│       └── testrunner.d.ts      # 类型定义
├── smoke/                       # 冒烟测试
│   ├── README.md                # 冒烟测试说明
│   ├── package.json             # 冒烟测试配置
│   ├── src/                     # 冒烟测试源码
│   │   ├── main.ts              # 测试主入口
│   │   ├── utils.ts             # 测试工具函数
│   │   └── areas/               # 功能区域测试
│   │       ├── extensions/      # 扩展测试
│   │       ├── languages/       # 语言支持测试
│   │       ├── multiroot/       # 多根目录测试
│   │       ├── notebook/        # 笔记本测试
│   │       ├── preferences/     # 偏好设置测试
│   │       ├── search/          # 搜索功能测试
│   │       ├── statusbar/       # 状态栏测试
│   │       ├── task/            # 任务测试
│   │       ├── terminal/        # 终端测试
│   │       └── workbench/       # 工作台测试
│   └── test/                    # 测试配置
│       └── index.js             # 测试运行器
├── automation/                  # 自动化测试
│   ├── README.md                # 自动化测试说明
│   ├── package.json             # 自动化测试配置
│   ├── package-lock.json        # 依赖锁定文件
│   └── src/                     # 自动化测试源码
│       ├── application.ts       # 应用程序测试
│       ├── code.ts              # VS Code 测试基础
│       ├── editor.ts            # 编辑器测试
│       ├── extensions.ts        # 扩展测试
│       ├── terminal.ts          # 终端测试
│       ├── workbench.ts         # 工作台测试
│       ├── playwrightBrowser.ts # Playwright 浏览器
│       ├── playwrightDriver.ts  # Playwright 驱动
│       ├── playwrightElectron.ts # Playwright Electron
│       └── index.ts             # 测试入口
├── monaco/                      # Monaco 编辑器测试
│   ├── README.md                # Monaco 测试说明
│   ├── package.json             # Monaco 测试配置
│   ├── runner.js                # 测试运行器
│   ├── core.js                  # 核心测试
│   ├── monaco.test.ts           # Monaco 测试
│   ├── webpack.config.js        # Webpack 配置
│   └── dist/                    # 构建输出
├── leaks/                       # 内存泄漏测试
│   ├── index.html               # 内存测试页面
│   ├── package.json             # 内存测试配置
│   └── server.js                # 测试服务器
└── CLAUDE.md                    # 本文档
```

## 测试层次

### 1. 单元测试

#### 单元测试目标
- **功能正确性**：验证独立模块的功能
- **边界条件**：测试边界和异常情况
- **代码覆盖率**：确保高代码覆盖率
- **快速反馈**：提供快速的开发反馈

#### 测试环境
```javascript
// test/unit/browser/index.js
// 浏览器环境单元测试
const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
  try {
    const extensionPath = path.resolve(__dirname, '../../..');
    const testRunnerPath = path.resolve(__dirname, 'runner');

    await runTests({
      extensionPath,
      launchArgs: ['--disable-extensions'],
      extensionDevelopmentPath: extensionPath,
      extensionTestsPath: testRunnerPath
    });
  } catch (err) {
    console.error('测试失败:', err);
    process.exit(1);
  }
}

main();
```

#### 测试用例示例
```javascript
// test/unit/voidSettingsService.test.js
const assert = require('assert');
const { VoidSettingsService } = require('../../src/vs/workbench/contrib/void/common/voidSettingsService');

suite('VoidSettingsService', () => {
  let settingsService;

  setup(() => {
    settingsService = new VoidSettingsService();
  });

  teardown(() => {
    settingsService.dispose();
  });

  test('应该正确初始化默认设置', () => {
    const state = settingsService.state;
    assert.strictEqual(state.modelSelectionOfFeature.Chat, null);
    assert.strictEqual(state.globalSettings.chatMode, 'normal');
  });

  test('应该能够设置提供商配置', async () => {
    await settingsService.setSettingOfProvider('openAI', 'apiKey', 'test-key');
    const state = settingsService.state;
    assert.strictEqual(state.settingsOfProvider.openAI.apiKey, 'test-key');
  });
});
```

### 2. 集成测试

#### 集成测试目标
- **模块交互**：测试模块间的交互
- **数据流**：验证数据在不同模块间的流动
- **错误传播**：测试错误处理的正确性
- **性能指标**：监控关键性能指标

#### 集成测试配置
```typescript
// test/integration/browser/src/index.ts
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  try {
    const extensionPath = path.resolve(__dirname, '../../..');
    const testRunnerPath = path.resolve(__dirname, '../../out/test/suite');

    await runTests({
      extensionPath,
      launchArgs: ['--disable-extensions', '--new-window'],
      extensionDevelopmentPath: extensionPath,
      extensionTestsPath: testRunnerPath
    });
  } catch (err) {
    console.error('集成测试失败:', err);
    process.exit(1);
  }
}

main();
```

### 3. 冒烟测试

#### 冒烟测试目标
- **端到端功能**：验证完整的功能流程
- **用户场景**：模拟真实用户使用场景
- **性能基准**：确保性能不回退
- **稳定性验证**：长期运行稳定性测试

#### 核心功能测试
```typescript
// test/smoke/src/areas/workbench/launch.test.ts
import { Application, Quality } from '../../../../../automation/out';
import { installAllHandlers } from '../../utils';

describe('Void 工作台启动', function () {
  this.timeout(120 * 1000); // 2分钟超时

  let app: Application;

  before(async () => {
    app = await new Application({
      quality: Quality.Dev,
      executablePath: process.env.VSCODE_PATH,
      userDataPath: process.env.VSCODE_USER_DATA,
      extensions: ['void.void'],
      installExtensions: true
    }).start();

    await app.workbench.quickaccess.openFile('app.js');
  });

  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('应该正确显示 Void 侧边栏', async () => {
    const sidebar = app.workbench.activityBar.getViewControl('Void');
    assert.ok(sidebar, 'Void 侧边栏应该存在');

    await sidebar.open();
    const chatView = app.code.driver.findElement('.void-chat-view');
    assert.ok(chatView, 'Void 聊天视图应该存在');
  });

  it('应该能够发送聊天消息', async () => {
    const chatInput = await app.code.driver.findElement('.void-chat-input');
    await chatInput.sendKeys('Hello, Void!');

    const sendButton = await app.code.driver.findElement('.void-send-button');
    await sendButton.click();

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 3000));

    const messages = await app.code.driver.findElements('.void-chat-message');
    assert.ok(messages.length >= 2, '应该有至少两条消息（用户和助手）');
  });
});
```

### 4. 自动化测试

#### Playwright 自动化
```typescript
// test/automation/src/playwrightBrowser.ts
import { Page, BrowserContext, Browser, chromium } from 'playwright';

export class PlaywrightBrowser {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;

  async launch(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.CI === 'true',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1200, height: 800 },
      userAgent: 'VSCode Test Runner'
    });

    this.page = await this.context.newPage();
  }

  async navigateToVoid(): Promise<void> {
    await this.page.goto('vscode://extensions/void.void');
  }

  async sendChatMessage(message: string): Promise<void> {
    const input = await this.page.locator('.void-chat-input');
    await input.fill(message);

    const sendButton = await this.page.locator('.void-send-button');
    await sendButton.click();
  }

  async waitForResponse(): Promise<string> {
    const response = await this.page.waitForSelector('.void-assistant-message');
    return await response.textContent();
  }

  async close(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}
```

## Void 特定测试

### AI 功能测试

#### LLM 集成测试
```typescript
// test/unit/sendLLMMessageService.test.ts
import { SendLLMMessageService } from '../../src/vs/workbench/contrib/void/common/sendLLMMessageService';

suite('SendLLMMessageService', () => {
  let service: SendLLMMessageService;

  setup(() => {
    service = new SendLLMMessageService();
  });

  test('应该正确格式化 OpenAI 消息', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ];

    const formatted = service.formatOpenAIMessages(messages);
    assert.strictEqual(formatted.length, 2);
    assert.strictEqual(formatted[0].role, 'user');
    assert.strictEqual(formatted[0].content, 'Hello');
  });

  test('应该正确处理工具调用', () => {
    const toolCall = {
      id: 'test-call',
      type: 'function',
      function: {
        name: 'edit',
        arguments: JSON.stringify({ file: 'test.js', content: 'console.log("test");' })
      }
    };

    const processed = service.processToolCall(toolCall);
    assert.strictEqual(processed.name, 'edit');
    assert.deepStrictEqual(processed.args, { file: 'test.js', content: 'console.log("test");' });
  });
});
```

#### React UI 测试
```typescript
// test/unit/sidebar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../../src/vs/workbench/contrib/void/browser/react/src/sidebar-tsx/Sidebar';

describe('Sidebar 组件', () => {
  const mockVoidSettingsService = {
    state: {
      modelSelectionOfFeature: { Chat: { providerName: 'openAI', modelName: 'gpt-4' } },
      globalSettings: { chatMode: 'normal' }
    },
    onDidChangeState: {
      fire: jest.fn()
    }
  };

  test('应该正确渲染聊天界面', () => {
    render(<Sidebar voidSettingsService={mockVoidSettingsService} />);

    expect(screen.getByPlaceholderText(/Ask Void anything/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  test('应该能够发送消息', () => {
    render(<Sidebar voidSettingsService={mockVoidSettingsService} />);

    const input = screen.getByPlaceholderText(/Ask Void anything/);
    const sendButton = screen.getByRole('button', { name: /Send/i });

    fireEvent.change(input, { target: { value: 'Hello, Void!' } });
    fireEvent.click(sendButton);

    // 验证消息发送逻辑
    expect(mockVoidSettingsService.onDidChangeState.fire).toHaveBeenCalled();
  });
});
```

## 测试配置

### 测试依赖

#### package.json
```json
{
  "name": "void-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "npm run test-unit && npm run test-browser && npm run test-node",
    "test-unit": "mocha test/unit/node/index.js --delay --ui=tdd --timeout=5000",
    "test-browser": "npx playwright install && node test/unit/browser/index.js",
    "test-node": "mocha test/unit/node/index.js --delay --ui=tdd --timeout=5000",
    "test-integration": "node test/integration/browser/src/index.js",
    "test-smoke": "node test/smoke/src/main.js",
    "test-automation": "playwright test test/automation/src/"
  },
  "devDependencies": {
    "@playwright/test": "^1.50.0",
    "@types/mocha": "^9.1.1",
    "@types/node": "20.x",
    "mocha": "^10.8.2",
    "playwright": "^1.50.0"
  }
}
```

### Mocha 配置
```javascript
// test/unit/node/index.js
const path = require('path');
const { Mocha } = require('mocha');
const glob = require('glob');

const mocha = new Mocha({
  ui: 'tdd',
  timeout: 5000,
  color: true
});

// 添加测试文件
const testFiles = glob.sync('test/unit/node/**/*.test.js');
testFiles.forEach(file => mocha.addFile(file));

// 运行测试
mocha.run((failures) => {
  process.exit(failures ? 1 : 0);
});
```

### Playwright 配置
```javascript
// playwright.config.js
module.exports = {
  testDir: './test/automation/src',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
};
```

## 测试数据

### Mock 数据
```typescript
// test/mock/data.ts
export const mockLLMResponse = {
  choices: [
    {
      message: {
        role: 'assistant',
        content: '这是一个测试响应',
        tool_calls: [
          {
            id: 'test-call-1',
            type: 'function',
            function: {
              name: 'read',
              arguments: JSON.stringify({ file: 'test.js' })
            }
          }
        ]
      }
    }
  ]
};

export const mockVoidSettings = {
  settingsOfProvider: {
    openAI: {
      apiKey: 'test-key',
      baseURL: 'https://api.openai.com/v1',
      models: [
        { modelName: 'gpt-4', type: 'default', isHidden: false },
        { modelName: 'gpt-3.5-turbo', type: 'default', isHidden: false }
      ]
    }
  },
  modelSelectionOfFeature: {
    Chat: { providerName: 'openAI', modelName: 'gpt-4' },
    Autocomplete: { providerName: 'openAI', modelName: 'gpt-3.5-turbo' }
  },
  globalSettings: {
    chatMode: 'normal',
    syncApplyToChat: true,
    syncSCMToChat: false
  }
};
```

### 测试工具函数
```typescript
// test/utils/helpers.ts
import { Application, Page } from '@vscode/automation';

export async function createVoidApp(): Promise<Application> {
  return new Application({
    quality: Quality.Dev,
    executablePath: process.env.VSCODE_PATH,
    userDataPath: process.env.VSCODE_USER_DATA,
    extensions: ['void.void'],
    installExtensions: true
  });
}

export async function waitForVoidView(app: Application): Promise<void> {
  await app.workbench.activityBar.getViewControl('Void').open();
  await app.code.driver.findElement('.void-chat-view');
}

export async function sendChatMessage(app: Application, message: string): Promise<void> {
  const input = await app.code.driver.findElement('.void-chat-input');
  await input.sendKeys(message);

  const sendButton = await app.code.driver.findElement('.void-send-button');
  await sendButton.click();
}

export async function waitForResponse(app: Application, timeout = 30000): Promise<void> {
  await app.code.driver.waitUntil(
    () => app.code.driver.findElements('.void-assistant-message'),
    { timeout, timeoutMessage: '等待 AI 响应超时' }
  );
}
```

## 性能测试

### 性能基准测试
```typescript
// test/performance/llmPerformance.test.ts
import { performance } from 'perf_hooks';
import { SendLLMMessageService } from '../../src/vs/workbench/contrib/void/common/sendLLMMessageService';

suite('LLM 性能测试', () => {
  let service: SendLLMMessageService;

  setup(() => {
    service = new SendLLMMessageService();
  });

  test('消息格式化性能', () => {
    const messages = Array(1000).fill(null).map((_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}: ${'test content '.repeat(10)}`
    }));

    const startTime = performance.now();
    const formatted = service.formatOpenAIMessages(messages);
    const endTime = performance.now();

    const duration = endTime - startTime;
    assert.ok(duration < 100, `格式化 1000 条消息应在 100ms 内完成，实际耗时: ${duration}ms`);
    assert.strictEqual(formatted.length, 1000);
  });
});
```

### 内存使用测试
```typescript
// test/performance/memoryUsage.test.ts
import { VoidSettingsService } from '../../src/vs/workbench/contrib/void/common/voidSettingsService';

suite('内存使用测试', () => {
  test('大量设置更改不应造成内存泄漏', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    const service = new VoidSettingsService();

    // 执行大量设置更改
    for (let i = 0; i < 1000; i++) {
      await service.setGlobalSetting('chatMode', i % 2 === 0 ? 'normal' : 'advanced');
    }

    // 强制垃圾回收（如果可用）
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    // 内存增长应该在合理范围内（例如 < 10MB）
    assert.ok(memoryIncrease < 10 * 1024 * 1024,
      `内存增长过大: ${memoryIncrease / 1024 / 1024}MB`);

    service.dispose();
  });
});
```

## 运行测试

### 开发环境测试
```bash
# 运行所有单元测试
npm test

# 运行浏览器测试
npm run test-browser

# 运行 Node.js 测试
npm run test-node

# 运行集成测试
npm run test-integration

# 运行冒烟测试
npm run smoketest

# 运行自动化测试
npm run test-automation
```

### CI/CD 测试
```yaml
# azure-pipelines/test.yml
steps:
- task: NodeTool@0
  inputs:
    versionSpec: '20.x'

- script: npm ci
  displayName: '安装依赖'

- script: npm run test-unit
  displayName: '运行单元测试'

- script: npm run test-browser
  displayName: '运行浏览器测试'

- script: npm run smoketest
  displayName: '运行冒烟测试'

- script: npm run test-automation
  displayName: '运行自动化测试'

- task: PublishTestResults@2
  condition: succeededOrFailed()
  inputs:
    testResultsFiles: '**/test-results.xml'
    testRunTitle: 'Void 测试结果'
```

## 相关文件清单

### 测试配置
- `package.json` - 测试依赖和脚本
- `mocha.opts` - Mocha 测试配置
- `playwright.config.js` - Playwright 配置

### 单元测试
- `test/unit/browser/index.js` - 浏览器测试入口
- `test/unit/node/index.js` - Node.js 测试入口
- `test/unit/electron/index.js` - Electron 测试入口

### 集成测试
- `test/integration/browser/src/index.ts` - 浏览器集成测试
- `test/integration/electron/testrunner.js` - Electron 集成测试

### 端到端测试
- `test/smoke/src/main.ts` - 冒烟测试入口
- `test/automation/src/index.ts` - 自动化测试入口

### 测试工具
- `test/utils.ts` - 测试工具函数
- `test/mock/` - Mock 数据和对象
- `test/fixtures/` - 测试夹具数据

## 变更记录 (Changelog)

### 2025-11-18 14:13:25
- 创建测试模块文档
- 分析测试架构和配置
- 整理测试用例和工具函数
- 添加性能测试和自动化测试说明

---
*本文档是 Void 项目架构文档的一部分，专注于测试系统的设计和实现。*