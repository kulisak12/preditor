import * as vscode from 'vscode';
import { getSuggestionProvider } from './suggestion';
import { getSubstitutionProvider } from './substitution';


export function activate(context: vscode.ExtensionContext) {
    const suggestionProvider = getSuggestionProvider();
    context.subscriptions.push(suggestionProvider);
    const substitutionProvider = getSubstitutionProvider();
    context.subscriptions.push(substitutionProvider);
}

export function deactivate() { }
