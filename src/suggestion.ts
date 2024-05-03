import * as vscode from 'vscode';
import { getConfig, getRangeAroundPosition, showErrorPopup, processingIcon } from './utils';
import { apiPostRequest } from './api';
import { SuggestionRequest } from './models';


/** Characters that trigger the suggestion. */
const TRIGGER_CHARS = [
    " ",
    "(",
    "'",
    '"',
    "\n",
];

/** Provide completion suggestions for the user. */
class PredictionProvider implements vscode.CompletionItemProvider {
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        try {
            processingIcon.show();
            const requestData = buildSuggestionRequest(document, position);
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
        finally {
            processingIcon.hide();
        }
    }
}

/** Register the suggestion provider that handles prediction and infilling. */
export function getSuggestionProvider(): vscode.Disposable {
    const provider = vscode.languages.registerCompletionItemProvider(
        [{ language: 'plaintext' }, { language: 'markdown' }],
        new PredictionProvider(),
        ...TRIGGER_CHARS
    );
    return provider;
}

/** Create a request with the text from the editor and configuration from settings.json. */
function buildSuggestionRequest(
    document: vscode.TextDocument,
    position: vscode.Position,
): SuggestionRequest {
    const contextRange = getRangeAroundPosition(document, position);
    const beforeCursor = document.getText(new vscode.Range(contextRange.start, position));
    const afterCursor = document.getText(new vscode.Range(position, contextRange.end));
    const request = new SuggestionRequest(
        beforeCursor, afterCursor, getConfig("prediction"), getConfig("infilling")
    );
    return request;
}



