// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const TRIGGER_CHARS = [
	" ",
	".",
	",",
	":",
	"!",
	"?",
	"(",
	")",
	"'",
	'"',
	"/",
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// ? provideCompletionItems can be async
	const provider = vscode.languages.registerCompletionItemProvider(
		{ pattern: "**" },
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				const linePrefix = document.lineAt(position).text.substring(0, position.character);
				const words = linePrefix.split(' ');
				const arbitraryIndex = Math.max(0, words.length - 4);
				const completionWords = words.slice(arbitraryIndex);
				const completionsItems = completionWords.map(word => new vscode.CompletionItem(word), vscode.CompletionItemKind.Text);

				return completionsItems;
			}
		},
		...TRIGGER_CHARS
		);

	context.subscriptions.push(provider);
}

// this method is called when your extension is deactivated
export function deactivate() {}
