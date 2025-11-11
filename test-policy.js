// 测试策略服务初始化逻辑
import path from 'path';
import fs from 'fs';

// 模拟 environmentMainService.policyFile (undefined)
const environmentMainService = {
    policyFile: undefined
};

// 模拟 process.cwd()
const cwd = '/Users/zhangerhao/Documents/2025works/void';

console.log('=== 测试策略服务初始化逻辑 ===');
console.log('当前工作目录:', cwd);
console.log('environmentMainService.policyFile:', environmentMainService.policyFile);

// 模拟我们修改后的逻辑
const policyFile = environmentMainService.policyFile || `file://${path.join(cwd, 'policies.json')}`;
console.log('计算后的 policyFile:', policyFile);

console.log('策略初始化信息:', {
    hasPolicyFile: !!environmentMainService.policyFile,
    isDev: !!process.env.VSCODE_DEV,
    policyFile: policyFile
});

console.log('=== 结果验证 ===');
console.log('1. policyFile 存在:', !!policyFile);
console.log('2. 预期使用 FilePolicyService:', policyFile ? '是' : '否');
console.log('3. 预期不进入 NativePolicyService 分支:', !policyFile ? '否' : '是');

// 验证路径存在
const fsPath = policyFile.replace('file://', '');
console.log('4. 策略文件路径存在:', fs.existsSync(fsPath));
if (fs.existsSync(fsPath)) {
    console.log('5. 策略文件内容:', fs.readFileSync(fsPath, 'utf8'));
}