import * as vscode from 'vscode';


export class PreditorError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "PreditorError";
    }
}

/** Read the configuration from the settings.json file. */
export function getConfig<T>(section: string): T {
    const main = vscode.workspace.getConfiguration("preditor");
    const config = main.get<T>(section);
    if (!config) {
        throw new PreditorError(`Configuration preditor.${section} not found.`);
    }
    return config;
}



/** Show an error notification inside VS Code with the error message. */
export function showErrorPopup(error: any) {
    if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message);
    } else {
        vscode.window.showErrorMessage(error);
    }
}

/**
 * Get the text around the cursor.
 * The size of the context is defined in settings.json.
*/
export function getRangeAroundPosition(
    document: vscode.TextDocument, position: vscode.Position
): vscode.Range {
    const start = advancePosition(document, position, -getConfig<number>("charsBefore"));
    const end = advancePosition(document, position, getConfig<number>("charsAfter"));
    return new vscode.Range(start, end);
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
