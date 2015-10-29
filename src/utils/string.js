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
