# Void 编辑器项目说明文档

## 项目概述

**Void** 是一个基于 VS Code 的开源编辑器项目，旨在成为 Cursor 的替代品。该项目完全开源，提供了强大的 AI 智能编程功能，支持使用任何模型或本地托管 AI 服务。

### 主要特性
- 🤖 **AI 智能编程**：支持多种 AI 模型集成
- 🔒 **数据隐私**：AI 消息直接发送给提供商，不保留用户数据
- 🛠️ **可扩展**：基于 VS Code 架构，支持丰富的扩展生态
- 🖥️ **多平台支持**：支持 Windows、macOS、Linux
- 🎯 **本地化部署**：可完全本地部署

## 技术架构

### 核心技术栈
- **前端框架**：基于 VS Code（Electron + TypeScript）
- **构建系统**：Gulp + Webpack
- **测试框架**：Mocha + Playwright
- **包管理器**：npm
- **AI 集成**：支持 OpenAI、Mistral、Ollama 等多种 AI 服务

### 项目结构
```
void/
├── src/                                    # 源代码目录
│   ├── main.ts                           # 主进程入口
│   ├── vs/                               # VS Code 核心代码
│   │   ├── workbench/                    # 工作台代码
│   │   │   └── contrib/void/             # Void 专用代码（重点关注）
│   │   │       ├── browser/              # 浏览器端代码
│   │   │       │   ├── react/            # React 组件
│   │   │       │   └── void-sidebar/     # 侧边栏组件
│   │   │       └── node/                 # 主进程代码
│   │   ├── base/                         # 基础工具类
│   │   ├── editor/                       # 编辑器核心
│   │   ├── loader.js                     # 模块加载器
│   │   └── platform/                     # 平台相关代码
│   └── vscode-dts/                       # 类型定义
├── build/                                 # 构建相关文件
│   ├── gulpfile.js                       # Gulp 构建配置
│   ├── lib/                              # 构建工具库
│   ├── electron/                         # Electron 应用
│   └── filters.js                        # 构建过滤器
├── extensions/                            # 扩展目录
│   ├── bat/                             # 批处理语法支持
│   ├── git/                             # Git 集成
│   ├── python/                          # Python 支持
│   └── [其他语言扩展...]/
├── cli/                                  # CLI 工具代码（Rust）
│   ├── src/                             # Rust 源码
│   ├── Cargo.toml                       # Rust 依赖配置
│   └── target/                          # Rust 编译输出
├── scripts/                              # 脚本工具
│   ├── code.sh                          # 启动脚本
│   ├── code-web.sh                      # Web 版本启动
│   └── test.sh                          # 测试脚本
├── test/                                 # 测试文件
│   ├── unit/                            # 单元测试
│   ├── smoke/                           # 冒烟测试
│   └── integration/                     # 集成测试
├── package.json                         # 项目配置
├── gulpfile.js                          # Gulp 任务定义
├── HOW_TO_CONTRIBUTE.md                 # 贡献指南
├── VOID_CODEBASE_GUIDE.md               # 代码库指南
└── product.json                         # 产品配置
```

### 核心开发目录
- **`src/vs/workbench/contrib/void/`**: Void 特有功能的核心代码
- **`src/vs/workbench/contrib/void/browser/react/`**: React UI 组件
- **`src/vs/workbench/contrib/void/browser/void-sidebar/`**: 侧边栏功能
- **`src/vs/workbench/contrib/void/node/`**: 主进程 AI 集成逻辑

## 快速开始

### 环境要求
- Node.js 20.x
- npm
- Python (某些依赖需要)
- C++ 编译环境

### 安装依赖
```bash
# 安装项目依赖
npm install

# 或者使用 pnpm
pnpm install
```

## 构建指令

### 完整构建
```bash
# 编译所有组件
npm run compile

# 完整的生产构建
npm run minify-vscode
```

### 开发模式构建
```bash
# 启动开发模式构建（实时编译）
npm run watch

# 启动客户端开发模式
npm run watch-client

# 启动扩展开发模式
npm run watch-extensions
```

### Web 版本构建
```bash
# 编译 Web 版本
npm run compile-web

# 启动 Web 版本开发模式
npm run watch-web
```

### React 组件构建
```bash
# 构建 React 组件
npm run buildreact

# 启动 React 组件实时编译
npm run watchreact

# 后台守护模式
npm run watchreactd
```

## 调试指令

### Electron 应用调试
```bash
# 启动 Electron 应用
npm run electron

# 启动开发版本
npm run gulp watch
```

### 进程管理
```bash
# 启动后台守护进程
npm run watchd

# 停止后台守护进程
npm run kill-watchd

# 重启后台守护进程
npm run restart-watchd
```

### 命令行接口调试
```bash
# 编译 CLI 工具
npm run compile-cli

# 启动 CLI 开发模式
npm run watch-cli
```

## 测试指令

### 单元测试
```bash
# 运行所有测试
npm test

# 运行浏览器测试
npm run test-browser

# 运行 Node.js 测试
npm run test-node

# 运行扩展测试
npm run test-extension
```

### 集成测试
```bash
# 启动浏览器测试（带依赖安装）
npm run test-browser

# 启动浏览器测试（不重新安装依赖）
npm run test-browser-no-install
```

### 冒烟测试
```bash
# 完整冒烟测试
npm run smoketest

# 快速冒烟测试
npm run smoketest-no-compile
```

### 性能测试
```bash
# 运行性能测试
npm run perf
```

## 代码质量检查

### 代码规范检查
```bash
# ESLint 检查
npm run eslint

# Stylelint 检查
npm run stylelint

# 类型检查
npm run monaco-compile-check
npm run tsec-compile-check
npm run vscode-dts-compile-check
```

### 依赖检查
```bash
# 检查空行使用
npm run valid-layers-check

# 检查属性初始化顺序
npm run property-init-order-check
```

## 持续集成指令

### 核心 CI 流程
```bash
# 核心持续集成
npm run core-ci

# 核心持续集成（PR 模式）
npm run core-ci-pr
```

### 扩展 CI 流程
```bash
# 扩展持续集成
npm run extensions-ci

# 扩展持续集成（PR 模式）
npm run extensions-ci-pr
```

## 专项任务指令

### 语法更新
```bash
# 更新所有语法文件
npm run update-grammars
```

### 本地化更新
```bash
# 更新本地化扩展
npm run update-localization-extension

# 更新发行版信息
npm run update-distro
```

### 内置扩展管理
```bash
# 下载内置扩展
npm run download-builtin-extensions

# 下载内置扩展（代码生成）
npm run download-builtin-extensions-cg
```

### 卫生检查
```bash
# 预提交检查
npm run precommit

# 完整卫生检查
npm run hygiene
```

## 启动应用

### 开发者模式启动
```bash
# 方法 1: 使用 VSCode 内部构建（推荐）
# 打开 VSCode，按 Cmd+Shift+B (Mac) 或 Ctrl+Shift+B (Windows/Linux)

# 方法 2: 使用脚本启动
# Mac/Linux
./scripts/code.sh

# Windows
./scripts/code.bat

# 方法 3: 使用 npm 脚本
npm run watch
npm run electron
```

### 独立数据目录启动（推荐开发时使用）
```bash
# Mac/Linux
./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions

# Windows
./scripts/code.bat --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
```

### Web 版本启动
```bash
# 启动 Web 版本开发服务器
./scripts/code-web.sh

# 或者使用 npm
npm run compile-web
npm run watch-web
```

### 服务器模式启动
```bash
# 启动服务器版本
./scripts/code-server.sh
```

## 故障排除

### 常见问题

#### 1. 内存不足错误
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=8192"
npm run watch-client

# 或者在命令中直接指定
NODE_OPTIONS="--max-old-space-size=8192" npm run watch
```

#### 2. Node.js 版本不匹配
```bash
# 确保使用 Node.js 20.x 版本
node --version

# 如果版本不正确，使用 nvm 切换
nvm install
nvm use
```

#### 3. 路径包含空格
确保 Void 项目路径中没有空格字符。

#### 4. 构建失败
```bash
# 清理缓存重新构建
rm -rf node_modules
rm -rf .tmp
rm -rf out
rm -rf .build
npm install

# 重新编译
npm run compile
```

#### 5. React 相关错误
```bash
# 重新构建 React 组件
NODE_OPTIONS="--max-old-space-size=8192" npm run buildreact
```

#### 6. Playwright 测试失败
```bash
# 重新安装 Playwright 浏览器
npm run playwright-install
```

#### 7. 权限问题（Linux/macOS）
```bash
# 修复 SUID sandbox 问题
sudo chown root:root .build/electron/chrome-sandbox
sudo chmod 4755 .build/electron/chrome-sandbox
```

#### 8. 依赖库问题（macOS）
如果遇到 libtool 相关错误，安装 GNU libtool：
```bash
brew install libtool
```

### 调试技巧

#### 1. 开发者工具
- **打开方式**：在 Electron 应用中按 `Cmd/Ctrl+Shift+I`
- **主进程调试**：使用 `node --inspect` 启动应用

#### 2. 启用详细日志
```bash
# 启用所有日志输出
export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1
./scripts/code.sh --trace
```

#### 3. 性能跟踪
```bash
# 启用内存和性能跟踪
./scripts/code.sh --trace --trace-memory-infra
```

#### 4. React 开发调试
```bash
# 实时编译 React 组件
npm run watchreact

# 查看 React 构建输出
ls -la src/vs/workbench/contrib/void/browser/react/out/
```

#### 5. 数据重置（开发时使用）
```bash
# 删除临时数据目录重置所有设置
rm -rf .tmp/

# 然后重新启动
./scripts/code.sh --user-data-dir ./.tmp/user-data --extensions-dir ./.tmp/extensions
```

### 环境变量配置
```bash
# 开发环境变量
export NODE_ENV=development
export VSCODE_DEV=1
export VSCODE_CLI=1

# 日志级别
export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1

# 禁用某些功能（开发时）
export VSCODE_SKIP_PRELAUNCH=1
```

## 贡献指南

### 开发流程
1. **准备环境**：
   ```bash
   # Fork 并克隆项目
   git clone https://github.com/your-username/void.git
   cd void
   
   # 安装依赖
   npm install
   
   # 启动开发者模式
   ./scripts/code.sh --user-data-dir ./.tmp/user-data
   ```

2. **开发新功能**：
   ```bash
   # 创建功能分支
   git checkout -b feature/your-feature-name
   
   # 启动实时构建
   npm run watch
   
   # 在新终端窗口中启动应用
   ./scripts/code.sh --user-data-dir ./.tmp/user-data
   ```

3. **测试和提交**：
   ```bash
   # 运行测试
   npm run test-node
   npm run eslint
   
   # 提交更改
   git add .
   git commit -m "feat: add new feature description"
   git push origin feature/your-feature-name
   ```

4. **创建 Pull Request**：
   - 在 GitHub 上创建 PR
   - 填写详细的描述
   - 链接相关 Issue

### 代码规范
- **TypeScript 编码规范**：遵循项目的 ESLint 配置
- **代码风格**：使用 Prettier 格式化代码
- **测试要求**：所有新功能需要包含单元测试
- **API 变更**：及时更新类型定义和文档
- **提交信息格式**：
  - `feat:` 新功能
  - `fix:` 错误修复
  - `docs:` 文档更新
  - `refactor:` 代码重构
  - `test:` 测试相关

### Void 特色功能开发指南

#### AI 消息处理流程
1. **浏览器端**：用户输入 → 发送到主进程
2. **主进程**：接收消息 → 路由到 AI 提供商
3. **响应处理**：流式响应 → 更新 UI

关键文件：
- `src/vs/workbench/contrib/void/browser/void-sidebar/`
- `src/vs/workbench/contrib/void/node/`
- `src/vs/workbench/contrib/void/browser/react/`

#### 编辑功能开发
Void 的编辑功能包括：
- **Fast Apply**：搜索/替换模式
- **Slow Apply**：重写整个文件
- **DiffZone**：显示代码差异

核心文件：
- `editCodeService`：编辑核心逻辑
- `voidModelService`：文件操作服务
- `approvalService`：变更审批服务

### 项目信息
- **项目地址**：[https://github.com/voideditor/void](https://github.com/voideditor/void)
- **官方网站**：[https://voideditor.com](https://voideditor.com)
- **Discord 社区**：[https://discord.gg/RSNjgaugJs](https://discord.gg/RSNjgaugJs)
- **联系邮箱**：hello@voideditor.com

## 许可证
本项目使用 MIT 许可证，详情请查看 [LICENSE.txt](./LICENSE.txt) 文件。

---

**注意**：项目目前正在暂停 IDE 开发，专注于实验新的 AI 编程想法。如有更新，请关注 Discord 社区获取最新信息。