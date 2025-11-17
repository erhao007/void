# Void 项目开发模式启动脚本 (Windows版本)

# 设置控制台编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 使用PowerShell的Write-Host输出中文信息
Write-Host "Starting Void project development mode..." -ForegroundColor Green

# 设置开发环境变量
$env:NODE_ENV = "development"
$env:VSCODE_DEV = "1"
$env:VSCODE_CLI = "1"
$env:ELECTRON_ENABLE_STACK_DUMPING = "1"
$env:ELECTRON_ENABLE_LOGGING = "1"

# 添加额外的环境变量来解决原生模块问题
$env:NODE_OPTIONS = "--max-old-space-size=4096"
# 移除禁用原生模块的设置，允许原生模块正常加载
# $env:VSCODE_DISABLE_NATIVE_MODULES = "1"
# $env:DISABLE_NATIVE_MODULES = "1"

# 运行预启动脚本（准备环境）
Write-Host "Preparing environment..." -ForegroundColor Yellow
if (-not $env:VSCODE_SKIP_PRELAUNCH) {
    node build/lib/preLaunch.js
}

# 从 product.json 获取应用程序名称
$productJson = Get-Content -Raw -Path "product.json" | ConvertFrom-Json
$appName = "$($productJson.nameShort).exe"
$electronPath = ".build\electron\$appName"

# 创建策略文件目录和文件
$POLICY_DIR = "$env:USERPROFILE\.vscode-oss"
if (-not (Test-Path $POLICY_DIR)) {
    New-Item -ItemType Directory -Path $POLICY_DIR -Force | Out-Null
}
"{}" | Out-File -FilePath "$POLICY_DIR\policy.json" -Encoding utf8
Write-Host "Policy file created: $POLICY_DIR\policy.json" -ForegroundColor Green

Write-Host "Starting Void..." -ForegroundColor Green

# 检查 Electron 可执行文件是否存在
if (Test-Path $electronPath) {
    Write-Host "Starting with Electron: $electronPath" -ForegroundColor Cyan
    
    # 启动应用程序
    & $electronPath . --disable-extension=vscode.vscode-api-tests
} else {
    Write-Host "Electron executable not found: $electronPath" -ForegroundColor Red
    
    # 方案2: 尝试使用scripts/code.bat
    Write-Host "Trying to start with scripts/code.bat..." -ForegroundColor Yellow
    & ".\scripts\code.bat"
}