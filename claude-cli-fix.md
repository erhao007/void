# Claude CLI 环境变量修复指南

## 问题描述
在Windows系统中，Claude CLI已通过npm全局安装，但在PowerShell中运行`claude`命令时出现"无法将'claude'项识别为cmdlet、函数、脚本文件或可运行程序的名称"错误。

## 问题原因
Claude CLI已成功安装到`C:\Users\Admin\AppData\Roaming\npm`目录，但该目录未包含在系统的PATH环境变量中，导致命令行无法找到claude可执行文件。

## 解决方案
1. **临时解决（当前会话有效）**：
   ```powershell
   $env:PATH += ";C:\Users\Admin\AppData\Roaming\npm"
   ```

2. **永久解决（推荐）**：
   ```powershell
   [System.Environment]::SetEnvironmentVariable("PATH", [System.Environment]::GetEnvironmentVariable("PATH", "User") + ";C:\Users\Admin\AppData\Roaming\npm", "User")
   ```
   执行后需要重新打开PowerShell或终端使更改生效。

## 验证安装
执行以下命令验证Claude是否正常工作：
```powershell
claude --version
```

## 替代方案
如果不想修改PATH环境变量，也可以使用以下方式运行Claude：
1. 使用npx：
   ```powershell
   npx @anthropic-ai/claude-code --version
   ```
2. 使用完整路径：
   ```powershell
   C:\Users\Admin\AppData\Roaming\npm\claude.cmd --version
   ```

## 注意事项
- 修改PATH环境变量后，所有新打开的终端窗口都会生效
- 如果使用多个Node.js版本管理工具（如nvm），可能需要相应调整PATH设置
- 某些企业环境中可能需要管理员权限才能修改系统环境变量