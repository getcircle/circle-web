'use strict';

var _body = null;

export function getBody() {
    if (_body === null) {
        _body = document.getElementsByClassName('js-content')[0];
    }
    return _body;
}
