# Anaconda PowerShell 环境中 Claude CLI 命令修复指南

## 问题描述
在 Anaconda PowerShell 环境中，无法识别 `claude` 命令，提示"无法将"claude"项识别为 cmdlet、函数、脚本文件或可运行程序的名称"。

## 问题原因
Anaconda PowerShell 使用独立的 PATH 环境变量配置，不包含 npm 全局安装目录 `C:\Users\Admin\AppData\Roaming\npm`，而 Claude CLI 安装在该目录中。

## 解决方案

### 方案一：修改 Anaconda PowerShell 配置文件（推荐）
已在 Anaconda PowerShell 配置文件中添加以下内容：

```powershell
#region conda initialize
# !! Contents within this block are managed by 'conda init' !!
(& "C:\Users\Admin\anaconda3\Scripts\conda.exe" "shell.powershell" "hook") | Out-String | Invoke-Expression
#endregion


# 添加npm全局目录到PATH
$env:PATH += ";C:\Users\Admin\AppData\Roaming\npm"
```

### 方案二：临时添加路径（当前会话）
在 Anaconda PowerShell 中执行：
```powershell
$env:PATH += ";C:\Users\Admin\AppData\Roaming\npm"
```

## 验证步骤
1. 关闭当前 Anaconda PowerShell 窗口
2. 重新打开一个新的 Anaconda PowerShell 窗口
3. 执行以下命令验证：
   ```powershell
   claude --version
   ```
   应该显示：`2.0.44 (Claude Code)`

## 替代方案
如果上述方法无效，可以使用完整路径运行 Claude：
```powershell
C:\Users\Admin\AppData\Roaming\npm\claude.cmd --version
```

## 注意事项
- 配置文件修改后需要重新打开终端才能生效
- 该配置只影响 PowerShell 终端，不影响其他终端环境
- 如果 Anaconda 更新，可能需要重新配置