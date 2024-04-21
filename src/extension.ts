import * as vscode from 'vscode';
const fetch = require('node-fetch');

import * as tasks from './tasks';
import { PreditorError, getConfig, readErrorResponse, showErrorPopup } from './utils';

class PredictionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        try {
            const requestData = tasks.buildSuggestionRequest(document, position);
            const apiBase = getConfig<string>("url");
            const responseData = await apiPostRequest(apiBase + "/suggest/", requestData);
            const suggestion: string = responseData.output;

            const completionItem = new vscode.CompletionItem(suggestion, vscode.CompletionItemKind.Text);
            completionItem.insertText = suggestion;
            completionItem.range = new vscode.Range(position, position);
            return [completionItem];

        }
        catch (error) {
            showErrorPopup(error);
            return [];
        }
    }
}

async function apiPostRequest(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data, snakeCaseReplacer),
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new PreditorError(response.url + ": " + response.statusText);
    }
    const responseData = await response.json();
    if (!response.ok) {
        throw new PreditorError(readErrorResponse(responseData));
    }
    return responseData;
}

/** JSON replacer that converts the keys from camel case to snake case. */
function snakeCaseReplacer(key: string, value: any): any {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const output: { [key: string]: any } = {};
        for (const i in value) {
            if (Object.prototype.hasOwnProperty.call(value, i)) {
                output[i.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`)] = value[i];
            }
        }
        return output;
    }
    return value;
}

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.languages.registerCompletionItemProvider(
        { pattern: "**" },
        new PredictionProvider(),
        ...tasks.TRIGGER_CHARS
    );
    context.subscriptions.push(provider);
}

export function deactivate() { }
