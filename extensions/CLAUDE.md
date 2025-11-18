[根目录](../CLAUDE.md) > **extensions**

# Void 扩展模块

Void 项目的 VS Code 扩展系统，提供语言支持、主题和其他功能扩展。

## 模块职责

这个模块包含 Void 集成的所有 VS Code 扩展：
- **语言扩展**：为不同编程语言提供语法高亮、智能感知等功能
- **主题扩展**：提供 Void 定制化的编辑器主题
- **功能扩展**：增强 VS Code 原生功能
- **内置扩展**：VS Code 内置扩展的管理和配置

## 目录结构

```
extensions/
├── cgmanifest.json              # 组件清单文件
├── bat/                         # Windows Batch 语言支持
│   ├── language-configuration.json
│   ├── package.json
│   ├── package.nls.json
│   ├── snippets/
│   │   └── batchfile.code-snippets
│   └── syntaxes/
│       └── batchfile.tmLanguage.json
├── clojure/                     # Clojure 语言支持
│   ├── cgmanifest.json
│   ├── language-configuration.json
│   ├── package.json
│   ├── package.nls.json
│   └── syntaxes/
│       └── clojure.tmLanguage.json
├── coffeescript/                # CoffeeScript 语言支持
│   ├── cgmanifest.json
│   ├── language-configuration.json
│   ├── package.json
│   ├── package.nls.json
│   ├── snippets/
│   │   └── coffeescript.code-snippets
│   └── syntaxes/
│       └── coffeescript.tmLanguage.json
├── configuration-editing/       # 配置文件编辑支持
│   ├── src/
│   │   ├── browser/
│   │   │   └── net.ts
│   │   ├── node/
│   │   │   └── net.ts
│   │   ├── configurationEditingMain.ts
│   │   ├── extensionsProposals.ts
│   │   ├── importExportProfiles.ts
│   │   ├── settingsDocumentHelper.ts
│   │   └── test/
│   │       ├── completion.test.ts
│   │       └── index.ts
│   ├── images/
│   │   └── icon.png
│   ├── package.json
│   ├── package.nls.json
│   ├── schemas/
│   │   ├── attachContainer.schema.json
│   │   ├── devContainer.codespaces.schema.json
│   │   ├── devContainer.vscode.schema.json
│   │   └── package.schema.json
│   ├── extension-browser.webpack.config.js
│   ├── extension.webpack.config.js
│   └── tsconfig.json
├── cpp/                         # C/C++ 语言支持
│   ├── build/
│   │   └── update-grammars.js
│   ├── cgmanifest.json
│   ├── language-configuration.json
│   ├── package.json
│   ├── package.nls.json
│   ├── snippets/
│   │   ├── c.code-snippets
│   │   └── cpp.code-snippets
│   └── syntaxes/
│       ├── c.tmLanguage.json
│       ├── cpp.embedded.macro.tmLanguage.json
│       ├── cpp.tmLanguage.json
│       ├── cuda-cpp.tmLanguage.json
│       └── platform.tmLanguage.json
├── csharp/                      # C# 语言支持
│   ├── cgmanifest.json
│   ├── language-configuration.json
│   ├── package.json
│   ├── package.nls.json
│   ├── snippets/
│   │   └── csharp.code-snippets
│   └── syntaxes/
│       └── csharp.tmLanguage.json
├── css-language-features/       # CSS 语言功能扩展
│   ├── client/
│   │   ├── src/
│   │   │   ├── browser/
│   │   │   │   └── cssClientMain.ts
│   │   │   ├── node/
│   │   │   │   └── cssClientMain.ts
│   │   │   └── cssClient.ts
│   │   ├── tsconfig.json
│   │   ├── extension-browser.webpack.config.js
│   │   └── extension.webpack.config.js
│   ├── server/
│   │   ├── src/
│   │   │   ├── browser/
│   │   │   │   ├── cssServerMain.ts
│   │   │   │   └── cssServerWorkerMain.ts
│   │   │   ├── cssServer.ts
│   │   │   ├── test/
│   │   │   │   ├── completion.test.ts
│   │   │   │   └── links.test.ts
│   │   │   ├── utils/
│   │   │   │   ├── documentContext.ts
│   │   │   │   ├── runner.ts
│   │   │   │   ├── strings.ts
│   │   │   │   └── validation.ts
│   │   │   └── node/
│   │   │       └── cssServerNodeMain.ts
│   │   ├── package.json
│   │   ├── extension-browser.webpack.config.js
│   │   └── extension.webpack.config.js
│   ├── icons/
│   │   └── css.png
│   ├── package.json
│   ├── package.nls.json
│   └── schemas/
│       └── package.schema.json
├── [更多语言扩展...]             # 其他编程语言支持
└── CLAUDE.md                    # 本文档
```

## 核心扩展类型

### 1. 语言支持扩展

#### 扩展结构
每个语言扩展都遵循标准的 VS Code 扩展结构：

```json
{
  "name": "language-bat",
  "displayName": "Batch File Language Support",
  "description": "Provides language support for Windows Batch files",
  "version": "1.0.0",
  "engines": {
    "vscode": "*"
  },
  "contributes": {
    "languages": [{
      "id": "bat",
      "aliases": ["Batch", "batch"],
      "extensions": [".bat", ".cmd"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "bat",
      "scopeName": "source.batchfile",
      "path": "./syntaxes/batchfile.tmLanguage.json"
    }]
  }
}
```

#### 语言配置
```json
{
  "comments": {
    "lineComment": "REM",
    "blockComment": [ "<!--", "-->" ]
  },
  "brackets": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  "autoClosingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""]
  ],
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""]
  ]
}
```

### 2. 代码片段扩展

#### 代码片段示例
```json
{
  "For Loop": {
    "prefix": ["for", "forr"],
    "body": [
      "for (${1:i} = 0; ${1:i} < ${2:arr}.length; ${1:i}++) {",
      "\t${3:// code}",
      "}"
    ],
    "description": "For Loop with index"
  },
  "Function": {
    "prefix": "func",
    "body": [
      "function ${1:functionName}(${2:args}) {",
      "\t${3:// code}",
      "}"
    ],
    "description": "Function definition"
  }
}
```

### 3. 语法高亮扩展

#### TextMate 语法定义
```json
{
  "scopeName": "source.batchfile",
  "patterns": [
    {
      "include": "#comment"
    },
    {
      "include": "#keyword"
    },
    {
      "include": "#string"
    },
    {
      "include": "#variable"
    }
  ],
  "repository": {
    "comment": {
      "patterns": [{
        "name": "comment.line.rem",
        "match": "^\\s*\\b(REM|rem)\\b.*$"
      }]
    },
    "keyword": {
      "patterns": [{
        "name": "keyword.control.batch",
        "match": "\\b(IF|if|ELSE|else|FOR|for|DO|do|GOTO|goto|CALL|call)\\b"
      }]
    },
    "string": {
      "patterns": [{
        "name": "string.quoted.double.batch",
        "begin": "\"",
        "end": "\"",
        "patterns": [{
          "name": "constant.character.escape.batch",
          "match": "\\\\."
        }]
      }]
    }
  }
}
```

## 高级扩展功能

### 1. CSS 语言功能扩展

#### 语言服务器协议 (LSP) 实现
```typescript
// css-language-features/server/src/cssServer.ts
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

let connection = createConnection(ProposedFeatures.all);
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true
      },
      hoverProvider: true,
      documentSymbolProvider: true,
      definitionProvider: true,
      colorProvider: true
    }
  };
  return result;
});

// 文档符号提供
connection.onDocumentSymbol((textDocumentIdentifier) => {
  const document = documents.get(textDocumentIdentifier.uri);
  if (!document) {
    return null;
  }

  const symbols = parseDocumentSymbols(document.getText());
  return symbols;
});

// 颜色提供器
connection.onDocumentColor((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  const colors = extractColors(document.getText());
  return colors;
});

// 监听文档变更
documents.listen(connection);
connection.listen();
```

#### 客户端扩展
```typescript
// css-language-features/client/src/cssClient.ts
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'cssServerMain.js')
  );

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ['--nolazy', '--inspect=6009'] }
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'css' }],
    synchronize: {
      configurationSection: 'css',
      fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
    }
  };

  client = new LanguageClient(
    'cssLanguageServer',
    'CSS Language Server',
    serverOptions,
    clientOptions
  );

  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
```

### 2. 配置编辑扩展

#### JSON Schema 支持
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "VS Code package.json",
  "description": "The package.json file for VS Code extensions",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the extension.",
      "pattern": "^[a-z0-9-]+$"
    },
    "version": {
      "type": "string",
      "description": "The version of the extension.",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "contributes": {
      "type": "object",
      "description": "The contribution points of the extension.",
      "properties": {
        "languages": {
          "type": "array",
          "description": "Contributes language declarations.",
          "items": {
            "type": "object",
            "required": ["id"],
            "properties": {
              "id": {
                "type": "string",
                "description": "ID of the language."
              },
              "aliases": {
                "type": "array",
                "description": "Name aliases for the language.",
                "items": { "type": "string" }
              },
              "extensions": {
                "type": "array",
                "description": "File extensions associated to the language.",
                "items": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}
```

## 构建和打包

### 扩展构建配置

#### Webpack 配置
```javascript
// css-language-features/client/extension.webpack.config.js
const path = require('path');

module.exports = {
  target: 'node',
  mode: 'none',
  entry: './src/cssClient.ts',
  output: {
    path: path.join(__dirname, '../../dist/css-language-features/client'),
    filename: 'cssClientMain.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    mainFields: ['main', 'module'],
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  devtool: 'nosources-source-map'
};
```

### 扩展打包脚本

#### 构建脚本
```json
{
  "scripts": {
    "compile": "webpack --config extension.webpack.config.js",
    "compile:browser": "webpack --config extension-browser.webpack.config.js",
    "watch": "webpack --watch --config extension.webpack.config.js",
    "watch:browser": "webpack --watch --config extension-browser.webpack.config.js"
  }
}
```

## Void 定制化

### AI 增强的语言支持

#### Void 特定扩展
虽然 Void 基于 VS Code，但可以考虑添加特定的扩展增强：

```json
{
  "name": "void-ai-enhanced",
  "displayName": "Void AI Enhanced Language Support",
  "description": "AI-powered language features for Void",
  "version": "1.0.0",
  "contributes": {
    "languages": [
      {
        "id": "void-chat",
        "aliases": ["Void Chat", "Chat"],
        "extensions": [".void-chat"],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "void-chat",
        "scopeName": "source.void-chat",
        "path": "./syntaxes/void-chat.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "typescript",
        "path": "./snippets/typescript-ai.json"
      }
    ]
  }
}
```

#### AI 驱动的代码片段
```json
{
  "AI Function Generation": {
    "prefix": "ai-func",
    "body": [
      "/**",
      " * ${1:Function description - AI will help optimize}",
      " * @param {$2:paramType} $3:paramName - ${4:Parameter description}",
      " * @returns {$5:returnType} - ${6:Return description}",
      " */",
      "function $3($3: $2): $5 {",
      "\t// TODO: AI-assisted implementation",
      "\t${7:// implementation here}",
      "}"
    ],
    "description": "AI-enhanced function template"
  },
  "Void Chat Command": {
    "prefix": "void-chat",
    "body": [
      "// Void AI Chat Command",
      "/// ${1:Chat message for AI assistant}",
      "${2:// Additional context}",
      "// Expected: AI will analyze and suggest improvements"
    ],
    "description": "Insert Void AI chat command"
  }
}
```

## 扩展管理

### 扩展安装和配置

#### 内置扩展管理
```typescript
// build/lib/builtInExtensions.js
const builtInExtensions = [
  {
    name: 'vscode-css-language-features',
    version: '1.0.0',
    repo: 'microsoft/vscode-css',
    metadata: {
      id: 'vscode.css-language-features',
      publisher: {
        name: 'Microsoft',
        displayName: 'Microsoft'
      }
    }
  },
  {
    name: 'vscode-html-language-features',
    version: '1.0.0',
    repo: 'microsoft/vscode-html',
    metadata: {
      id: 'vscode.html-language-features',
      publisher: {
        name: 'Microsoft',
        displayName: 'Microsoft'
      }
    }
  }
];

module.exports = builtInExtensions;
```

#### 扩展下载和安装
```javascript
// build/lib/builtInExtensionsCG.js
const fs = require('fs');
const path = require('path');
const rp = require('request-promise');
const decompress = require('decompress');

async function downloadExtension(extension) {
  const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${extension.publisher.name}/vsextensions/${extension.name}/${extension.version}/vspackage`;
  const extensionPath = path.join(__dirname, '..', '..', 'extensions', extension.name);

  if (!fs.existsSync(extensionPath)) {
    console.log(`Downloading extension: ${extension.name}`);

    const packageBuffer = await rp({
      uri: downloadUrl,
      encoding: null,
      headers: {
        'User-Agent': 'VSCode/1.0.0'
      }
    });

    await decompress(packageBuffer, extensionPath);
    console.log(`Extracted extension: ${extension.name}`);
  }
}

async function downloadAllExtensions() {
  const builtInExtensions = require('./builtInExtensions');

  for (const extension of builtInExtensions) {
    await downloadExtension(extension);
  }
}

if (require.main === module) {
  downloadAllExtensions().catch(console.error);
}
```

## 开发指南

### 创建新语言扩展

#### 1. 扩展结构
```
my-language/
├── package.json
├── language-configuration.json
├── syntaxes/
│   └── my-language.tmLanguage.json
├── snippets/
│   └── my-language.code-snippets
└── README.md
```

#### 2. 基本配置
```json
{
  "name": "language-my-language",
  "displayName": "My Language Support",
  "description": "Language support for My Language",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [{
      "id": "mylang",
      "aliases": ["My Language", "mylang"],
      "extensions": [".mylang"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "mylang",
      "scopeName": "source.mylang",
      "path": "./syntaxes/mylang.tmLanguage.json"
    }]
  }
}
```

### 测试语言扩展

#### 单元测试
```typescript
// test/language/mylang.test.ts
import * as vscode from 'vscode';
import { activate } from '../../src/extension';

suite('My Language Extension Test', () => {
  test('Should register language features', async () => {
    const extension = vscode.extensions.getExtension('publisher.language-my-language');
    assert.ok(extension);

    await extension.activate();

    const languages = vscode.languages.getLanguages();
    assert.ok(languages.includes('mylang'));
  });

  test('Should provide completions', async () => {
    const document = await vscode.workspace.openTextDocument({
      content: '',
      language: 'mylang'
    });

    const position = new vscode.Position(0, 0);
    const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      document.uri,
      position
    );

    assert.ok(completions.items.length > 0);
  });
});
```

## 常见问题 (FAQ)

### Q: 如何添加新的语言支持？
A: 创建新的语言扩展，包含语言配置、语法定义和代码片段，然后在 extensions 目录中添加。

### Q: 如何自定义现有语言扩展？
A: 可以 fork 现有扩展，修改其配置和功能，确保遵循 VS Code 扩展规范。

### Q: Void 如何与 VS Code 扩展集成？
A: Void 完全兼容 VS Code 扩展生态系统，所有标准扩展都可以在 Void 中使用。

### Q: 如何优化语言扩展的性能？
A: 使用语言服务器协议 (LSP)，实现增量解析，缓存计算结果，减少不必要的重新计算。

## 相关文件清单

### 语言扩展
- `bat/` - Windows Batch 支持
- `clojure/` - Clojure 语言支持
- `coffeescript/` - CoffeeScript 支持
- `cpp/` - C/C++ 支持
- `csharp/` - C# 支持
- `css-language-features/` - CSS 语言功能

### 功能扩展
- `configuration-editing/` - 配置文件编辑
- `emmet/` - Emmet 支持
- `git/` - Git 集成
- `html-language-features/` - HTML 语言功能
- `javascript/` - JavaScript 支持

### 构建和配置
- `cgmanifest.json` - 组件清单
- `package.json` - 各扩展的配置文件
- `webpack.config.js` - 构建配置

## 变更记录 (Changelog)

### 2025-11-18 14:13:25
- 创建扩展模块文档
- 分析扩展结构和功能
- 整理开发指南和最佳实践
- 添加 Void 定制化说明

---
*本文档是 Void 项目架构文档的一部分，专注于 VS Code 扩展系统的管理和开发。*