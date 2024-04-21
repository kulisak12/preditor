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
    text: string;
    start: number;
    length: number;
    replacement: string;
    config: vscode.WorkspaceConfiguration;

    constructor(text: string, start: number, length: number, replacement: string, config: vscode.WorkspaceConfiguration) {
        this.text = text;
        this.start = start;
        this.length = length;
        this.replacement = replacement;
        this.config = config;
    }
}
