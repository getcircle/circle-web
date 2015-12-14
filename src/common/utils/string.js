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
    const urlRegex = /(^|\s+|\>)((?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?)/gi;
    return stringValue.replace(urlRegex, '$1<a href="$2" target="_blank">$2</a>');
}

/**
 * http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
 */
 export function detectEmailsAndAddMarkup(stringValue) {
    const emailRegex = /(^|\s+|\>)((([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,}))/gi;
    return stringValue.replace(emailRegex, '$1<a href="mailto:$2">$2</a>');
 }

/**
 * NOTE:
 * Replaces hash tags with search URLs.
 * Because these are supposed to be internal URLs and this markup is directly injected
 * as innerHTML there is no way to use the router, so the components are expected to add
 * click event listeners.
 */
export function detectHashtagsAndAddMarkup(stringValue) {
    const urlRegex = /(\s)(#\w+)/gi;
    return stringValue.replace(urlRegex, '$1<a class="hashtag">$2</a>');
}

export function stripTags(html) {
    const tempElement = document.createElement('dev');
    tempElement.innerHTML = html;
    return tempElement.innerText;
}

export function detectCodeMarkdownAndAddMarkup(stringValue) {
    const backTicksRegex = new RegExp(/(```)([^`]*)(```)/gi);
    return stringValue.replace(backTicksRegex, '<pre>$2</pre>');
}

export function hasHTML(stringValue) {
    const tempElement = document.createElement('dev');
    tempElement.innerHTML = stringValue;
    return tempElement.childNodes.length > 1;
}
