"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
var vscode = require("vscode");
function activate(context) {
    var disposable = vscode.languages.registerDocumentFormattingEditProvider("world", {
        provideDocumentFormattingEdits: function (document) {
            var indentationSize = vscode.workspace
                .getConfiguration("worldFormatter")
                .get("indentationSize", 2);
            var edits = [];
            var indentLevel = 0;
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                var trimmedLine = line.text.trim();
                if (trimmedLine.length > 0) {
                    if (isEndBlock(trimmedLine)) {
                        indentLevel = Math.max(indentLevel - 1, 0);
                    }
                    var newText = " ".repeat(indentationSize * indentLevel) + trimmedLine;
                    var range = new vscode.Range(line.range.start, line.range.end);
                    edits.push(vscode.TextEdit.replace(range, newText));
                    if (isStartBlock(trimmedLine)) {
                        indentLevel++;
                    }
                }
            }
            return edits;
        },
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function isStartBlock(line) {
    var startKeywords = ["بينما", "اذا", "أما_اذا", "نفذ"];
    return startKeywords.some(function (keyword) { return line.includes(keyword); });
}
function isEndBlock(line) {
    var endKeywords = ["نهاية", "والا"];
    return endKeywords.some(function (keyword) { return line.includes(keyword); });
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map