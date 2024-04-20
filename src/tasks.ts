import * as vscode from 'vscode';
import * as models from './models';
import { getConfig } from './utils';

export const TRIGGER_CHARS = [
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

const CHARS_BEFORE = 200;
const CHARS_AFTER = 100;


export function buildSuggestionRequest(
    document: vscode.TextDocument,
    position: vscode.Position,
): models.SuggestionRequest {
    const rangeStart = advancePosition(document, position, -CHARS_BEFORE);
    const rangeEnd = advancePosition(document, position, CHARS_AFTER);
    const beforeCursor = document.getText(new vscode.Range(rangeStart, position));
    const afterCursor = document.getText(new vscode.Range(position, rangeEnd));
    const request = new models.SuggestionRequest(
        beforeCursor, afterCursor, getConfig("prediction"), getConfig("infilling")
    );
    return request;
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
