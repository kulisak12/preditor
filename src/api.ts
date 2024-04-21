import { PreditorError } from "./utils";
// const fetch = require('node-fetch');


/** Read the error message from the server and formats it as string. */
export function readErrorResponse(response: any): string {
    let message = response.error;
    if (response.details) {
        message += ": " + JSON.stringify(response.details);
    }
    return message;
}

/**
 * Send a POST request to the Preditor server with the provided data.
 * @throws {PreditorError} If the response is not successful.
 */
export async function apiPostRequest(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data, snakeCaseReplacer),
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new PreditorError(response.url + ": " + response.statusText);
    }
    const responseData = await response.json();
    if (!response.ok) {
        throw new PreditorError(readErrorResponse(responseData));
    }
    return responseData;
}

/** JSON replacer that converts the keys from camel case to snake case. */
function snakeCaseReplacer(key: string, value: any): any {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        const output: { [key: string]: any } = {};
        for (const i in value) {
            if (Object.prototype.hasOwnProperty.call(value, i)) {
                output[i.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`)] = value[i];
            }
        }
        return output;
    }
    return value;
}
