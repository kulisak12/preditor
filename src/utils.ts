import * as vscode from 'vscode';

export function getConfig<T>(section: string): T {
    const main = vscode.workspace.getConfiguration("preditor");
    const config = main.get<T>(section);
    if (!config) {
        throw new Error(`Configuration preditor.${section} not found.`);
    }
    return config;
}
