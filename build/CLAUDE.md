[根目录](../CLAUDE.md) > **build**

# Void 构建系统模块

Void 的构建和打包系统，负责项目的编译、打包和发布流程。

## 模块职责

这个模块负责 Void 的完整构建生命周期：
- TypeScript 代码编译和打包
- React UI 组件构建
- 资源处理和优化
- 多平台打包和发布
- CI/CD 流水线配置
- 开发环境支持

## 目录结构

```
build/
├── gulpfile.js                    # 主构建文件入口
├── gulpfile.*.js                 # 各模块构建配置
├── azure-pipelines/              # Azure DevOps CI/CD 配置
│   ├── common/                   # 通用构建任务
│   ├── cli/                      # CLI 构建
│   ├── linux/                    # Linux 平台
│   ├── win32/                    # Windows 平台
│   ├── darwin/                   # macOS 平台
│   └── web/                      # Web 平台
├── eslint.js                     # ESLint 配置
├── builtInExtensions.js          # 内置扩展管理
├── lib/                          # 构建工具库
│   ├── electron.js               # Electron 应用构建
│   ├── extensions.js             # 扩展打包
│   └── ...
├── npm/                          # NPM 脚本
│   ├── preinstall.js             # 预安装检查
│   ├── postinstall.js            # 后安装处理
│   └── ...
├── tsconfig.*.json               # TypeScript 配置
└── CLAUDE.md                     # 本文档
```

## 核心构建流程

### 主构建文件 (gulpfile.js)

```javascript
// 主构建入口，代理到实际的构建文件
require('./build/gulpfile');
```

### 模块化构建配置

#### gulpfile.compile.js - 编译配置
- **TypeScript 编译**：使用 TypeScript 编译器处理所有 TS 文件
- **增量编译**：支持增量编译提高构建速度
- **错误处理**：完善的编译错误处理和报告
- **依赖管理**：处理模块间依赖关系

#### gulpfile.vscode.js - VS Code 核心构建
- **VS Code 编译**：编译 VS Code 核心代码
- **扩展集成**：集成 VS Code 扩展系统
- **资源打包**：打包必要的资源文件
- **平台适配**：不同平台的特殊处理

#### gulpfile.cli.js - CLI 构建
- **Rust 编译**：调用 Cargo 编译 Rust CLI 工具
- **二进制打包**：打包不同平台的可执行文件
- **依赖优化**：优化 CLI 工具的依赖
- **版本管理**：处理版本号和构建信息

### React UI 构建

#### 独立构建流程
React 组件采用独立的构建流程：

```bash
# 在 react 目录下执行
node build.js --watch  # 开发模式
node build.js          # 生产构建
```

#### 构建特性
- **TypeScript 编译**：使用 tsup 快速编译
- **React 处理**：JSX 转换和优化
- **Tailwind CSS**：样式编译和优化
- **模块打包**：生成可在 VS Code 中使用的模块
- **类型声明**：生成 .d.ts 类型文件

## 平台构建

### 多平台支持

#### Linux 构建
```yaml
# azure-pipelines/linux/product-build-linux.yml
steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"
  - script: npm install
  - script: npm run compile
  - script: npm run buildreact
  - script: npm run compile-cli
```

#### Windows 构建
```yaml
# azure-pipelines/win32/product-build-win32.yml
steps:
  - task: NodeTool@0
  - script: npm install
  - script: npm run compile
  - script: npm run buildreact
  - script: npm run compile-cli
  - task: VSCodeBuild
```

#### macOS 构建
```yaml
# azure-pipelines/darwin/product-build-darwin.yml
steps:
  - task: NodeTool@0
  - script: npm install
  - script: npm run compile
  - script: npm run buildreact
  - script: npm run compile-cli
  - task: ElectronBuild
```

### 产物管理

#### 构建产物
- **VS Code 包**：包含 VS Code 核心和 Void 扩展
- **CLI 工具**：各平台的命令行工具
- **安装包**：不同格式的安装包（.exe, .dmg, .deb, .rpm）
- **压缩包**：便携版压缩包

#### 版本管理
- **语义化版本**：遵循 SemVer 规范
- **构建编号**：自动生成构建编号
- **变更日志**：自动生成变更日志
- **发布标签**：自动创建 Git 标签

## CI/CD 流水线

### Azure DevOps 配置

#### 构建触发
```yaml
# azure-pipelines/product-build.yml
trigger:
  branches:
    include:
      - main
      - release/*
pr:
  branches:
    include:
      - main
```

#### 构建阶段
1. **环境准备**：安装 Node.js、Rust 等依赖
2. **代码检出**：获取源代码和依赖
3. **编译构建**：编译 TypeScript、构建 React、编译 CLI
4. **测试验证**：运行单元测试、集成测试
5. **打包发布**：生成安装包和发布包
6. **质量检查**：代码质量检查、安全扫描

#### 多矩阵构建
```yaml
strategy:
  matrix:
    Linux_x64:
      imageName: 'ubuntu-latest'
      arch: x64
    macOS_x64:
      imageName: 'macOS-latest'
      arch: x64
    macOS_ARM64:
      imageName: 'macOS-11'
      arch: ARM64
    Windows_x64:
      imageName: 'windows-latest'
      arch: x64
```

## 开发工具

### 代码质量

#### ESLint 配置
```javascript
// build/eslint.js
module.exports = {
  extends: [
    '@vscode/eslint-config',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // 自定义规则
  }
};
```

#### 代码格式化
- **Prettier**：代码格式化
- **TypeScript**：类型检查
- **TSLint**：遗留的 TypeScript 检查
- **风格检查**：统一的代码风格

### 性能优化

#### 编译优化
- **增量编译**：只编译变更的文件
- **并行编译**：利用多核 CPU 并行编译
- **缓存机制**：编译结果缓存
- **Tree Shaking**：移除未使用代码

#### 打包优化
- **代码分割**：按模块分割代码
- **压缩优化**：代码和资源压缩
- **资源优化**：图片、字体等资源优化
- **依赖优化**：减少不必要的依赖

## 开发命令

### NPM 脚本

#### 开发命令
```bash
npm run watch           # 监听文件变化，增量编译
npm run watch-client    # 监听客户端代码
npm run watch-extensions # 监听扩展代码
npm run watch-web       # 监听 Web 平台代码
npm run watch-cli       # 监听 CLI 代码
```

#### 构建命令
```bash
npm run compile         # 完整编译
npm run compile-cli     # 编译 CLI 工具
npm run compile-web     # 编译 Web 版本
npm run buildreact      # 构建 React 组件
npm run minify-vscode   # 压缩 VS Code
```

#### 质量检查
```bash
npm run eslint          # ESLint 检查
npm run stylelint       # 样式检查
npm run hygiene         # 代码规范检查
npm run tsec-compile-check # TSec 安全检查
```

### Gulp 任务

#### 基础任务
```javascript
// 常用 Gulp 任务
gulp.task('compile')    // 编译所有代码
gulp.task('watch')      // 监听文件变化
gulp.task('clean')      // 清理构建产物
gulp.task('lint')       // 代码检查
gulp.task('test')       // 运行测试
```

#### 平台任务
```javascript
gulp.task('vscode-linux-x64')     // Linux x64 构建
gulp.task('vscode-darwin-x64')    // macOS x64 构建
gulp.task('vscode-win32-x64')     // Windows x64 构建
gulp.task('vscode-web')           // Web 版本构建
```

## 配置管理

### TypeScript 配置

#### 主配置
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "out"]
}
```

#### React 配置
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "NodeNext",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "exactOptionalPropertyTypes": false
  }
}
```

### 构建配置

#### Webpack 配置
```javascript
// webpack.config.js
module.exports = {
  target: 'electron-main',
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

## 依赖管理

### 依赖安装

#### 预安装检查
```javascript
// build/npm/preinstall.js
// 检查 Node.js 版本
const nodeVersion = process.version;
const requiredVersion = '>=20.0.0';

if (!semver.satisfies(nodeVersion, requiredVersion)) {
  console.error(`需要 Node.js ${requiredVersion}，当前版本: ${nodeVersion}`);
  process.exit(1);
}
```

#### 后安装处理
```javascript
// build/npm/postinstall.js
// 下载内置扩展
// 生成必要文件
// 设置权限
```

### 依赖优化

#### 生产依赖
- 移除开发依赖
- 优化依赖版本
- 减少依赖大小
- 修复安全漏洞

#### 开发依赖
- 更新到最新版本
- 检查兼容性
- 测试新功能
- 文档更新

## 故障排除

### 常见问题

#### 编译错误
1. **类型错误**：检查 TypeScript 配置
2. **依赖缺失**：运行 `npm install`
3. **版本冲突**：检查依赖版本兼容性
4. **权限问题**：检查文件和目录权限

#### 构建失败
1. **内存不足**：增加 Node.js 内存限制
2. **网络问题**：检查网络连接和代理设置
3. **磁盘空间**：清理构建产物和临时文件
4. **并发限制**：减少并发任务数量

#### 平台特定问题
1. **Windows**：检查 PowerShell 执行策略
2. **macOS**：检查 Xcode 命令行工具
3. **Linux**：检查必要的系统库
4. **Docker**：检查容器配置

### 调试技巧

#### 构建日志
```bash
# 启用详细日志
DEBUG=* npm run compile

# 查看构建时间
npm run compile -- --profile

# 分析构建产物
npm run analyze
```

#### 性能分析
```bash
# 分析构建性能
npm run build -- --analyze

# 监控内存使用
node --inspect scripts/build.js

# 生成构建报告
npm run build-report
```

## 相关文件清单

### 核心构建文件
- `gulpfile.js` - 主构建入口
- `gulpfile.compile.js` - 编译配置
- `gulpfile.vscode.js` - VS Code 构建
- `gulpfile.cli.js` - CLI 构建

### CI/CD 配置
- `azure-pipelines/product-build.yml` - 主流水线
- `azure-pipelines/linux/` - Linux 构建
- `azure-pipelines/win32/` - Windows 构建
- `azure-pipelines/darwin/` - macOS 构建

### 开发工具
- `eslint.js` - ESLint 配置
- `tsconfig.json` - TypeScript 配置
- `npm/preinstall.js` - 预安装检查
- `npm/postinstall.js` - 后安装处理

## 变更记录 (Changelog)

### 2025-11-18 14:13:25
- 创建构建系统模块文档
- 分析构建流程和 CI/CD 配置
- 整理开发命令和故障排除指南

---
*本文档是 Void 项目架构文档的一部分，专注于构建系统的设计和实现。*