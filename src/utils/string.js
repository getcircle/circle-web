export function trimNewLinesAndWhitespace(stringValue) {
    if (stringValue !== undefined && stringValue !== null) {
        return stringValue.trim().replace(/^\s+|\s+$/g, '');
    }

    return stringValue;
}

export function trimNewLines(stringValue) {
    if (stringValue !== undefined && stringValue !== null) {
        return stringValue.replace(/\n|\r/g, '');
    }

    return stringValue;
}

/**
 * https://gist.github.com/dperini/729294
 */
export function detectURLsAndAddMarkup(stringValue) {
    const urlRegex = /((?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?)/gi;
    return stringValue.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}
