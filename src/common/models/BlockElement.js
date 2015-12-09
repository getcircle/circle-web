import logger from '../utils/logger';
import Markup from '../models/Markup';

const BlockElementType = {
    PARAGRAPH: 1
};

class BlockElement {

    id = null;
    markups = [];
    type = null;
    text = '';

    constructor(type) {
        if (type === null) {
            logger.error('Invalid block element');
            return;
        }

        this.type = type
        this.id = this.getRandomId();
    }

    static getTypeByTagName(tagName) {
        switch (tagName) {
            case 'P':
               return BlockElementType.PARAGRAPH;
        }

        return null;
    }

    getRandomId() {
        return Math.round(1E6 * Math.random()).toString(36);
    }

    update(text) {
        // TODO: Need to replace <BR> with \n when inside a paragraph
        this.text = text;
    }

    updateMarkups(element) {
        this.markups = [];
        let childNode, i, markup, markupText, startIndex;
        const ilen = element.childNodes.length;
        const rootElementText = element.innerText;
        for (i = 0; i < ilen; i++) {
            childNode = element.childNodes[i];
            if (childNode.nodeType !== 1) {
                continue;
            }

            markupText = childNode.innerText;
            startIndex = rootElementText.indexOf(markupText);
            if (startIndex === -1) {
                continue;
            }

            markup = new Markup(
                Markup.getTypeByTagName(childNode.tagName),
                startIndex,
                startIndex + markupText.length
            );

            if (markup && markup.type !== null) {
                if (childNode.tagName === 'A') {
                    markup.addAnchorMetadata(childNode.getAttribute('href'));
                }
                this.markups.push(markup);
            }
        }
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

    getHTML() {
        let html = '', i = 0, ilen = this.text.length;
        const markupsByStartIndex = [];
        const markupsByEndIndex = [];
        this.markups.forEach(markup => {
            if (!markupsByStartIndex[markup.start]) {
                markupsByStartIndex[markup.start] = [];
            }
            markupsByStartIndex[markup.start].push(markup);

            if (!markupsByEndIndex[markup.end]) {
                markupsByEndIndex[markup.end] = [];
            }
            markupsByEndIndex[markup.end].push(markup);
        });

        for (i = 0; i < ilen; i++) {

            if (markupsByStartIndex[i]) {
                markupsByStartIndex[i].forEach(markup => {
                    html += markup.getHTMLStartTag();
                });
            }

            if (markupsByEndIndex[i]) {
                markupsByEndIndex[i].forEach(markup => {
                    html += markup.getHTMLEndTag();
                });
            }

            html += this.text[i];

        }

        return this.getHTMLStartTag() + html + this.getHTMLEndTag();
    }

    getHTMLStartTag() {
        switch (this.type) {
            case BlockElementType.PARAGRAPH:
                return '<p id="' + this.id + '">';
        }
    }

    getHTMLEndTag() {
        switch (this.type) {
            case BlockElementType.PARAGRAPH:
                return '</p>';
        }
    }
}

export default BlockElement;
