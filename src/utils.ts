import * as vscode from 'vscode';

export class PreditorError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "PreditorError";
    }
}

export function getConfig<T>(section: string): T {
    const main = vscode.workspace.getConfiguration("preditor");
    const config = main.get<T>(section);
    if (!config) {
        throw new PreditorError(`Configuration preditor.${section} not found.`);
    }
    return config;
}

export function readErrorResponse(response: any): string {
    let message = response.error;
    if (response.details) {
        message += ": " + JSON.stringify(response.details);
    }
    return message;
}

export function showErrorPopup(error: any) {
    if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message);
    } else {
        vscode.window.showErrorMessage(error);
    }
}
