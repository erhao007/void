#!/usr/bin/env python3
import os
import re

def fix_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace Buffer.from('string') with new Uint8Array('string')
        content = re.sub(r"Buffer\.from\('([^']*)'\)", r"new Uint8Array('\1')", content)
        content = re.sub(r'Buffer\.from\("([^"]*)"\)', r'new Uint8Array("\1")', content)
        
        # For Buffer.from(contents).toString(), replace with TextDecoder().decode(contents)
        content = re.sub(r"Buffer\.from\(contents\)\.toString\(\)", "new TextDecoder().decode(contents)", content)
        
        # For other Buffer.from() calls that might have variables, replace with Uint8Array
        content = re.sub(r"Buffer\.from\(([^)]*)\)", r"new Uint8Array(\1)", content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {file_path}")
            return True
        else:
            print(f"No changes: {file_path}")
            return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    extensions_dir = "/Users/zhangerhao/Documents/2025works/void/extensions"
    
    # Files to fix based on the grep output
    files_to_fix = [
        "/Users/zhangerhao/Documents/2025works/void/extensions/vscode-api-tests/src/singlefolder-tests/workspace.fs.test.ts",
        "/Users/zhangerhao/Documents/2025works/void/extensions/vscode-api-tests/src/singlefolder-tests/workspace.test.ts",
        "/Users/zhangerhao/Documents/2025works/void/extensions/vscode-api-tests/src/singlefolder-tests/proxy.test.ts"
    ]
    
    fixed_count = 0
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            if fix_file(file_path):
                fixed_count += 1
        else:
            print(f"File not found: {file_path}")
    
    print(f"\nFixed {fixed_count} files")

if __name__ == "__main__":
    main()