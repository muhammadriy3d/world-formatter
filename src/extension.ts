import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.languages.registerDocumentFormattingEditProvider(
    "world",
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        const indentationSize = vscode.workspace
          .getConfiguration("worldFormatter")
          .get("indentationSize", 2);
        const edits: vscode.TextEdit[] = [];
        let indentLevel = 0;

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          const trimmedLine = line.text.trim();

          if (trimmedLine.length > 0) {
            if (isEndBlock(trimmedLine)) {
              indentLevel = Math.max(indentLevel - 1, 0);
            }

            const newText =
              " ".repeat(indentationSize * indentLevel) + trimmedLine;
            const range = new vscode.Range(line.range.start, line.range.end);
            edits.push(vscode.TextEdit.replace(range, newText));

            if (isStartBlock(trimmedLine)) {
              indentLevel++;
            }
          }
        }

        return edits;
      },
    }
  );

  context.subscriptions.push(disposable);
}

function isStartBlock(line: string): boolean {
  const startKeywords = ["بينما", "اذا", "أما_اذا", "نفذ"];
  return startKeywords.some((keyword) => line.includes(keyword));
}

function isEndBlock(line: string): boolean {
  const endKeywords = ["نهاية", "والا"];
  return endKeywords.some((keyword) => line.includes(keyword));
}

export function deactivate() {}
