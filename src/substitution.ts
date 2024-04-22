import * as vscode from 'vscode';
import { getConfig, getRangeAroundPosition } from './utils';
import { SubstitutionRequest } from './models';
import { apiPostRequest } from './api';


/** Provide word substitution. */
class SubstitutionProvider implements vscode.RenameProvider {
    async provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        token: vscode.CancellationToken
    ): Promise<vscode.WorkspaceEdit> {
        const replaced = document.getWordRangeAtPosition(position);
        if (!replaced) {
            return new vscode.WorkspaceEdit();;
        }
        const contextRange = getRangeAroundPosition(document, position);
        const requestData = buildSuggestionRequest(document, position, replaced, contextRange, newName);
        const apiBase = getConfig<string>("url");
        const responseData = await apiPostRequest(apiBase + "/substitute/", requestData);
        const substitution: string = responseData.output;
        return buildEdit(document, contextRange, substitution);
    }
}

/** Register the provider that handles substitution. */
export function getSubstitutionProvider(): vscode.Disposable {
    const provider = vscode.languages.registerRenameProvider(
        { pattern: "**" },
        new SubstitutionProvider()
    );
    return provider;
}

/** Create a request with the text from the editor and configuration from settings.json. */
function buildSuggestionRequest(
    document: vscode.TextDocument,
    position: vscode.Position,
    replaced: vscode.Range,
    contextRange: vscode.Range,
    newName: string
): SubstitutionRequest {
    const beforeOld = document.getText(new vscode.Range(contextRange.start, replaced.start));
    const old = document.getText(replaced);
    const afterOld = document.getText(new vscode.Range(replaced.end, contextRange.end));
    const request = new SubstitutionRequest(
        beforeOld, old, afterOld, newName,
        getConfig("substitution")
    );
    return request;
}

/** Create an edit that changes the old sentence to the new sentence. */
function buildEdit(
    document: vscode.TextDocument,
    contextRange: vscode.Range,
    substitution: string
): vscode.WorkspaceEdit {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, contextRange, substitution);
    return edit;
}
