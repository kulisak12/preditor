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

const CHARS_BEFORE = 100;
const CHARS_AFTER = 20;
const API = "http://127.0.0.1:3000";

class PredictionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        const rangeStart = advancePosition(document, position, -CHARS_BEFORE);
        const rangeEnd = advancePosition(document, position, CHARS_AFTER);

        const requestData = {
            text: document.getText(new vscode.Range(rangeStart, rangeEnd)),
            cursor: document.getText(new vscode.Range(rangeStart, position)).length,
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

/**
 * Advance position by a given number of characters.
 * Works across lines.
*/
function advancePosition(
    document: vscode.TextDocument,
    position: vscode.Position,
    by: number
): vscode.Position {
    const offset = document.offsetAt(position);
    const newOffset = offset + by;
    return document.positionAt(newOffset);
}
