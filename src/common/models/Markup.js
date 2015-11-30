import logger from '../utils/logger';

class Markup {

    element = null;
    end = 0;
    metaData = {};
    start = 0;

    constructor(element, startIndex, endIndex) {
        this.element = element;
        this.type = this.getTypeByTagName(element.tagName);
        if (this.type === null) {
            logger.error('Invalid markup element');
            return null;
        }

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

    getTypeByTagName(tagName) {
        switch (tagName) {
            case 'STRONG':
            case 'B':
               return 1;

            case 'EM':
            case 'I':
                return 2;

            case 'A':
                return 3;
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
}

export default Markup;
