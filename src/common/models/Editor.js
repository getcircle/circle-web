import logger from '../utils/logger';

import BlockElement from './BlockElement';

class Editor {

    blockElements = {};

    acceptableBlockTags() {
        return ['P'];
    }

    addBlockElement(node) {
        if (node.nodeType !== 1) {
            logger.error('Error adding node. Only block elements are accepted.');
            return null;
        }

        if (this.acceptableBlockTags().indexOf(node.tagName) === -1) {
            logger.error('Error adding node. Only ' + this.acceptableBlockTags().toString() + ' are accepted.');
            return null;
        }

        const blockElement = new BlockElement(node);
        this.blockElements[blockElement.id] = blockElement;
        return blockElement;
    }

    updateBlockElement(identifier, updateMarkup) {
        if (this.blockElements.hasOwnProperty(identifier)) {
            this.blockElements[identifier].update();
            if (updateMarkup) {
                this.blockElements[identifier].updateMarkups();
            }
        }
    }

    removeBlockElement(identifier) {
        delete this.blockElements[identifier];
    }

    getElementById(identifier) {
        if (this.blockElements.hasOwnProperty(identifier)) {
            return this.blockElements[identifier];
        }

        return null;
    }

    getAllElementsIds() {
        return Object.keys(this.blockElements);
    }

    print() {
        for (let key in this.blockElements) {
            logger.log(this.blockElements[key].getObject());
        }
    }
}

export default Editor;
