import logger from '../utils/logger';
import Markup from '../models/Markup';

class BlockElement {

    element = null;
    id = null;
    markups = [];
    type = null;
    text = '';

    constructor(element) {
        this.element = element;
        this.type = this.getTypeByTagName(element.tagName);
        if (this.type === null) {
            logger.error('Invalid block element');
            return;
        }

        this.id = this.getRandomId();
        this.element.id = this.id;
    }

    getTypeByTagName(tagName) {
        switch (tagName) {
            case 'P':
               return 1;
        }

        return null;
    }

    getRandomId() {
        return Math.round(1E6 * Math.random()).toString(36);
    }

    getObject() {
        let markups = [];
        this.markups.forEach((markup) => {
            markups.push(markup.getObject());
        });
        return {
            id: this.id,
            type: this.type,
            text: this.text,
            markups: markups,
        };
    }

    update() {
        // TODO: Need to replace <BR> with \n when inside a paragraph
        this.text = this.element.innerText;
    }

    updateMarkups() {
        this.markups = [];
        let childNode, i, markup, markupText, startIndex;
        const ilen = this.element.childNodes.length;
        const rootElementText = this.element.innerText;
        for (i = 0; i < ilen; i++) {
            childNode = this.element.childNodes[i];
            if (childNode.nodeType !== 1) {
                continue;
            }

            markupText = childNode.innerText;
            startIndex = rootElementText.indexOf(markupText);
            if (startIndex === -1) {
                continue;
            }

            markup = new Markup(childNode, startIndex, startIndex + markupText.length);
            if (markup && markup.type !== null) {
                if (childNode.tagName === 'A') {
                    markup.addAnchorMetadata(childNode.getAttribute('href'));
                }
                this.markups.push(markup);
            }
        }
    }
}

export default BlockElement;
