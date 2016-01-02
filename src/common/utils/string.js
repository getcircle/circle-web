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
    const urlRegex = /(^|\s+|\>)((?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#][A-Za-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\%]*)?)/gi;
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
    if (!__CLIENT__ || !html) {
        // SSR
        return html;
    }

    const plainText = html.replace(/<\/?[^>]+>/gi, ' ').replace(/\s+|&nbsp;/gi, ' ').trim();
    // null or undefined checks are needed for ensuring this does not
    // break with fake objects created when testing
    return plainText === null || plainText === undefined ? html : plainText;
}

export function detectCodeMarkdownAndAddMarkup(stringValue) {
    const backTicksRegex = new RegExp(/(```)([^`]*)(```)/gi);
    return stringValue.replace(backTicksRegex, '<pre>$2</pre>');
}

export function hasHTML(stringValue) {
    if (!__CLIENT__) {
        // SSR - Worst case assume HTML exists. Typically such functions
        // would return false but we use it to determine whether the
        // text should have enclosing tags or not, which is quite safe even
        // when this returns true.
        return true;
    }
    const tempElement = document.createElement('div');
    tempElement.innerHTML = stringValue;
    return tempElement.childNodes.length > 1;
}
