// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Congratulations, your extension "vscext" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand('vscext.LaoTie', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('請先打開一個文件！');
                return;
            }

            const document = editor.document;
            const languageId = document.languageId;

            // 根據不同語言執行相應的語法檢查
            switch (languageId) {
                case 'javascript':
                case 'typescript':
                    checkJavaScript(document);
                    break;
                case 'python':
                    checkPython(document);
                    break;
                case 'java':
                    checkJava(document);
                    break;
                case 'cpp':
                    checkCPP(document);
                    break;
                case 'csharp':
                    checkCSharp(document);
                    break;
                default:
                    vscode.window.showInformationMessage(`暫不支持 ${languageId} 語言的語法檢查`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`執行時發生錯誤: ${error.message}`);
            console.error(error);
        }
    }));
}

// 添加裝飾器類型定義
let decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none'
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
});

// 顯示浮動文字的函數
function show666Effect(editor) {
    // 獲取當前可見範圍
    const visibleRanges = editor.visibleRanges;
    if (visibleRanges.length === 0) return;
    
    const startLine = visibleRanges[0].start.line;
    const endLine = visibleRanges[0].end.line;
    
    // 顯示 3-6 個彈幕
    const count = Math.floor(Math.random() * 4) + 3;
    const decorations = [];
    
    for (let i = 0; i < count; i++) {
        // 在可見範圍內隨機選擇一行
        const line = Math.floor(Math.random() * (endLine - startLine)) + startLine;
        const fontSize = Math.floor(Math.random() * 20) + 14;
        const offset = Math.floor(Math.random() * 50);
        
        const range = new vscode.Range(
            new vscode.Position(line, 0),
            new vscode.Position(line, 0)
        );

        decorations.push({
            range,
            renderOptions: {
                after: {
                    contentText: '666',
                    color: getRandomColor(),
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: `${fontSize}px`,
                    margin: `0 0 0 ${offset + 3}em`
                }
            }
        });
    }

    editor.setDecorations(decorationType, decorations);

    setTimeout(() => {
        editor.setDecorations(decorationType, []);
    }, 3000);
}

// 生成隨機顏色
function getRandomColor() {
    const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 各語言的檢查函數
function checkJavaScript(document) {
    const editor = vscode.window.activeTextEditor;
    try {
        Function(document.getText());
        vscode.window.showInformationMessage('沒毛病阿老鐵！');
        show666Effect(editor);
    } catch (error) {
        vscode.window.showErrorMessage('老鐵錯啦！');
    }
}

function checkPython(document) {
    const editor = vscode.window.activeTextEditor;
    const filePath = document.uri.fsPath;
    exec(`python -m py_compile "${filePath}"`, (error) => {
        if (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
        } else {
            vscode.window.showInformationMessage('沒毛病阿老鐵！');
            show666Effect(editor);
        }
    });
}

function checkJava(document) {
    const editor = vscode.window.activeTextEditor;
    const filePath = document.uri.fsPath;
    const tempDir = path.dirname(filePath);
    
    exec(`javac -Xlint:all "${filePath}" -d "${tempDir}"`, (error) => {
        if (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
        } else {
            vscode.window.showInformationMessage('沒毛病阿老鐵！');
            show666Effect(editor);
            const className = path.basename(filePath, '.java') + '.class';
            fs.unlink(path.join(tempDir, className), () => {});
        }
    });
}

function checkCPP(document) {
    const editor = vscode.window.activeTextEditor;
    const filePath = document.uri.fsPath;
    exec(`g++ -fsyntax-only "${filePath}"`, (error) => {
        if (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
        } else {
            vscode.window.showInformationMessage('沒毛病阿老鐵！');
            show666Effect(editor);
        }
    });
}

function checkCSharp(document) {
    const editor = vscode.window.activeTextEditor;
    const filePath = document.uri.fsPath;
    exec(`csc /nologo /t:module "${filePath}"`, (error) => {
        if (error) {
            vscode.window.showErrorMessage('老鐵錯啦！');
        } else {
            vscode.window.showInformationMessage('沒毛病阿老鐵！');
            show666Effect(editor);
            const moduleName = path.basename(filePath, '.cs') + '.netmodule';
            fs.unlink(path.join(path.dirname(filePath), moduleName), () => {});
        }
    });
}

// This method is called when your extension is deactivated
function deactivate() {
	try {
		// 清理代碼...
	} catch (error) {
		vscode.window.showErrorMessage(`插件停用時發生錯誤: ${error.message}`);
		console.error(error);
	}
}

module.exports = {
	activate,
	deactivate
}
