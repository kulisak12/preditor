import * as vscode from 'vscode';
const fetch = require('node-fetch');

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

const API = "http://127.0.0.1:3000";

class PredictionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const line = document.lineAt(position);
        const requestData = {
            text: line.text,
        };

        const responseData = await apiPostRequest(API, requestData);
        const prediction: string = responseData.prediction;

        const completionItem = new vscode.CompletionItem(prediction, vscode.CompletionItemKind.Text);
        completionItem.insertText = prediction;
        completionItem.range = new vscode.Range(position, position);
        return [completionItem];
    }
}

export function activate(context: vscode.ExtensionContext) {

    const provider = vscode.languages.registerCompletionItemProvider(
        { pattern: "**" },
        new PredictionProvider(),
        ...TRIGGER_CHARS
    );

    context.subscriptions.push(provider);
}

export function deactivate() { }

async function apiPostRequest(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return responseData;
}
