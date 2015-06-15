var _body = null;

export function getBody() {
    if (body === null) {
        _body = document.getElementsByClassName('js-content')[0];
    }
    return _body;
};
