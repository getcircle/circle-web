import logger from '../utils/logger';

import BlockElement from './BlockElement';

class Editor {

    blockElements = {};

    constructor(json) {
        this.setJSON(json);
    }

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

        const blockElement = new BlockElement(BlockElement.getTypeByTagName(node.tagName));
        node.id = blockElement.id;
        this.blockElements[blockElement.id] = blockElement;
        return blockElement;
    }

    updateBlockElement(identifier, updateMarkup) {
        const element = document.getElementById(identifier);
        if (this.blockElements.hasOwnProperty(identifier) && element) {
            this.blockElements[identifier].update(element.innerText);
            if (updateMarkup) {
                this.blockElements[identifier].updateMarkups(element);
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

    setJSON(json) {
        try {
            if (json) {
                this.blockElements = JSON.parse(json);
            }
        } catch (e) {
            logger.error('Error parsing editor model JSON');
        }
    }

    getJSON() {
        return JSON.stringify(this.blockElements);
    }

    getHTML() {
        let html = '';
        for (let identifier in this.blockElements) {
            html += this.blockElements[identifier].getHTML();
        }

        return html;
    }

    print() {
        for (let key in this.blockElements) {
            logger.log(this.blockElements[key].getObject());
        }
    }

    printHTML() {
        logger.log(this.getHTML());
    }
}

export default Editor;
