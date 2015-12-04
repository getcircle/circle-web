import logger from './logger';

export function copyUrl() {
    const textToCopy = window.location.href;
    const tempNode = document.createElement('textarea');
    tempNode.appendChild(document.createTextNode(textToCopy));
    document.body.appendChild(tempNode);
    try {
        tempNode.select();
        document.execCommand('copy');
    } catch (e) {
        logger.warn('Something bad happened when we tried to copy: ' + e);
    }
    document.body.removeChild(tempNode)
}
