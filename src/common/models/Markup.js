import logger from '../utils/logger';

const MarkupType = {
    BOLD: 1,
    ITALIC: 2,
    ANCHOR: 3,
};

class Markup {

    end = 0;
    metaData = {};
    start = 0;
    type = null;

    constructor(type, startIndex, endIndex) {
        if (type === null) {
            logger.error('Invalid markup element');
            return null;
        }

        this.type = type;
        if (startIndex === endIndex) {
            logger.error('Start and end index cannot be the same for markup elements');
            return null;
        }

        this.start = startIndex;
        this.end = endIndex;
    }

    addAnchorMetadata(href) {
        this.metaData.href = href;
    }

    static getTypeByTagName(tagName) {
        switch (tagName) {
            case 'STRONG':
            case 'B':
               return MarkupType.BOLD;

            case 'EM':
            case 'I':
                return MarkupType.ITALIC;

            case 'A':
                return MarkupType.ANCHOR;
        }

        return null;
    }

    getObject() {
        return {
            start: this.start,
            end: this.end,
            ...this.metaData,
        };
    }

    getHTMLStartTag() {
        switch (this.type) {
            case MarkupType.BOLD:
                return '<b>';

            case MarkupType.ITALIC:
                return '<i>';

            case MarkupType.ANCHOR:
                return '<a href="' + this.metaData.href + '">';
        }
    }

    getHTMLEndTag() {
        switch (this.type) {
            case MarkupType.BOLD:
                return '</b>';

            case MarkupType.ITALIC:
                return '</i>';

            case MarkupType.ANCHOR:
                return '</a>';
        }
    }
}

export default Markup;
