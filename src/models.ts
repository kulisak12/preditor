import * as vscode from 'vscode';


export class SuggestionRequest {
    beforeCursor: string;
    afterCursor: string;
    predictionConfig: vscode.WorkspaceConfiguration;
    infillingConfig: vscode.WorkspaceConfiguration;

    constructor(before: string, after: string, predictionConfig: vscode.WorkspaceConfiguration, infillingConfig: vscode.WorkspaceConfiguration) {
        this.beforeCursor = before;
        this.afterCursor = after;
        this.predictionConfig = predictionConfig;
        this.infillingConfig = infillingConfig;
    }
}

export class SubstitutionRequest {
    beforeOld: string;
    old: string;
    afterOld: string;
    replacement: string;
    config: vscode.WorkspaceConfiguration;

    constructor(beforeOld: string, old: string, afterOld: string, replacement: string, config: vscode.WorkspaceConfiguration) {
        this.beforeOld = beforeOld;
        this.old = old;
        this.afterOld = afterOld;
        this.replacement = replacement;
        this.config = config;
    }
}
