import * as vscode from 'vscode';
import { getSuggestionProvider } from './suggestion';


export function activate(context: vscode.ExtensionContext) {
    const provider = getSuggestionProvider();
    context.subscriptions.push(provider);
}

export function deactivate() { }
