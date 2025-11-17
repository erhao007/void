#!/bin/bash

# Void 项目开发模式启动脚本
echo "🚀 启动 Void 项目开发模式..."

# 设置开发环境变量
export NODE_ENV=development
export VSCODE_DEV=1
export VSCODE_CLI=1
export ELECTRON_ENABLE_STACK_DUMPING=1
export ELECTRON_ENABLE_LOGGING=1

# 添加额外的环境变量来解决原生模块问题
export NODE_OPTIONS="--max-old-space-size=4096"
# 移除禁用原生模块的设置，允许原生模块正常加载
# export VSCODE_DISABLE_NATIVE_MODULES=1
# export DISABLE_NATIVE_MODULES=1

# 检查是否已编译
if [ ! -d "out" ]; then
    echo "⚠️  编译项目..."
    npm run compile
fi

# 创建策略文件目录和文件
POLICY_DIR="$HOME/.vscode-oss"
mkdir -p "$POLICY_DIR"
echo '{}' > "$POLICY_DIR/policy.json"
echo "已创建策略文件：$POLICY_DIR/policy.json"

echo "✅ 启动 Void..."

# 方案1: 使用预构建的Electron
if [ -f ".build/electron/Void.app/Contents/MacOS/Electron" ]; then
    echo "🔧 使用预构建的Electron启动..."
    echo "Electron路径: .build/electron/Void.app/Contents/MacOS/Electron"
    echo "主文件: out/main.js"
    
    # 尝试直接启动
    ".build/electron/Void.app/Contents/MacOS/Electron" out/main.js \
        --disable-features=VizDisplayCompositor \
        --no-sandbox \
        --disable-dev-shm-usage \
        --enable-logging \
        --log-level=0 \
        --enable-file-policy
else
    echo "❌ 找不到预构建的Electron"
fi