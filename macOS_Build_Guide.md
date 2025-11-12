# Void macOS安装包生成指南

## 概述
Void项目使用基于Gulp的构建系统，支持生成Intel Mac (x64) 和 Apple Silicon Mac (arm64) 两种架构的安装包。

## 前置条件
- Node.js 环境
- 项目已编译完成：`npm run compile`
- 确保所有依赖已安装：`npm install`

## 构建目标

### 1. 主要构建任务

#### Intel Mac (x64架构)
```bash
# 完整版本 (包含所有功能)
npx gulp vscode-darwin-x64

# 最小化版本 (构建更快，文件更小)
npx gulp vscode-darwin-x64-min
```

#### Apple Silicon Mac (arm64架构)
```bash
# 完整版本
npx gulp vscode-darwin-arm64

# 最小化版本
npx gulp vscode-darwin-arm64-min
```

#### 通用二进制包 (Universal Binary)
```bash
# 同时支持Intel和Apple Silicon
npx gulp vscode-darwin-universal
```

### 2. 查看所有可用任务
```bash
npx gulp --tasks | grep -i darwin
```

## 构建流程

### 标准构建流程
1. **编译项目**
   ```bash
   npm run compile
   ```

2. **选择架构进行构建**
   ```bash
   # Intel Mac
   npx gulp vscode-darwin-x64-min
   
   # Apple Silicon Mac
   npx gulp vscode-darwin-arm64-min
   ```

3. **等待构建完成**
   - 构建过程通常需要5-15分钟
   - 包含编译、打包、签名等步骤

### 构建输出

#### 文件位置
构建完成后，应用程序位于：
- **Intel Mac**: `./VSCode-darwin-x64/Void.app`
- **Apple Silicon**: `./VSCode-darwin-arm64/Void.app`
- **通用版本**: `./VSCode-darwin-universal/Void.app`

#### 应用程序结构
```
Void.app/
├── Contents/
│   ├── Info.plist          # 应用元数据
│   ├── MacOS/
│   │   └── Electron        # 可执行文件
│   ├── Resources/
│   │   └── app/
│   │       ├── package.json
│   │       ├── product.json
│   │       ├── node_modules.asar  # 打包的Node.js模块
│   │       └── ...
│   └── Frameworks/         # 依赖库
```

## 构建选项说明

### 完整版本 vs 最小化版本

| 特性 | 完整版本 | 最小化版本 |
|------|----------|------------|
| 文件大小 | 较大 | 较小 |
| 构建时间 | 较长 | 较短 |
| 功能 | 全部功能 | 核心功能 |
| 适用场景 | 开发测试 | 快速验证 |

### 架构选择指南

| Mac类型 | 推荐构建目标 | 说明 |
|---------|-------------|------|
| Intel Mac (2019及之前) | `vscode-darwin-x64` | 仅支持x64架构 |
| Apple Silicon Mac (2020及之后) | `vscode-darwin-arm64` | 原生支持arm64 |
| 需要同时支持两种架构 | `vscode-darwin-universal` | 通用二进制包 |

## 高级构建选项

### 1. 自定义构建配置

可以修改 `product.json` 来自定义应用信息：
```json
{
  "nameLong": "Void",
  "nameShort": "Void",
  "darwinBundleIdentifier": "com.voideditor.code"
}
```

### 2. 代码签名

在生产环境中，可能需要进行代码签名：

```bash
# 设置签名证书
export CSC_NAME="Developer ID Application: Your Name"

# 构建时自动签名
npx gulp vscode-darwin-x64
```

### 3. 清理构建缓存

```bash
# 清理构建目录
rm -rf ./VSCode-darwin-*

# 清理npm缓存
npm run clean

# 重新编译
npm run compile
```

## 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本兼容性
   - 确保所有依赖已安装：`npm install`
   - 清理构建缓存后重试

2. **内存不足**
   - 增加Node.js内存限制：
   ```bash
   node --max-old-space-size=8192 ./node_modules/gulp/bin/gulp.js vscode-darwin-x64-min
   ```

3. **Electron构建问题**
   - 检查Electron版本兼容性
   - 重新下载Electron预编译版本：
   ```bash
   npm run electron
   ```

### 性能优化

1. **使用最小化版本进行开发**
   ```bash
   npx gulp vscode-darwin-x64-min
   ```

2. **并行构建多个架构**
   ```bash
   # 在不同终端中并行运行
   terminal 1: npx gulp vscode-darwin-x64-min
   terminal 2: npx gulp vscode-darwin-arm64-min
   ```

## 发布准备

### 构建发布版本
```bash
# 构建所有架构
npx gulp vscode-darwin-x64
npx gulp vscode-darwin-arm64

# 创建通用二进制包
npx gulp vscode-darwin-universal
```

### 验证构建结果
```bash
# 检查应用程序是否可以启动
open ./VSCode-darwin-x64/Void.app

# 检查应用程序信息
mdls ./VSCode-darwin-x64/Void.app
```

## 总结

Void项目的macOS安装包构建系统成熟且功能完整，支持：

- ✅ 多种架构支持 (Intel + Apple Silicon)
- ✅ 完整版和最小化版本
- ✅ 自动化构建流程
- ✅ 代码签名支持
- ✅ 通用二进制包生成

选择合适的构建目标，基于你的需求（开发测试 vs 生产发布）来执行相应的构建命令。