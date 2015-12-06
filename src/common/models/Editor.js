import logger from '../utils/logger';

class Editor {

    blockElements = {};

    acceptableBlockTags() {
        return ['P'];
    }

    addBlockElement(Node node) {
        if (node.nodeType !== 1) {
            logger.error('Error adding node. Only block elements are accepted.');
            return null;
        }

        if (this.acceptableBlockTags().indexOf(node.tagName) === -1) {
            logger.error('Error adding node. Only ' + this.acceptableBlockTags().toString() + ' are accepted.');
            return null;
        }

        const blockElement = new BlockElement(node);
        this.blockElements[blockElement.identifier] = blockElement;
        return blockElement;
    }

    updateBlockElement(identifier, updateMarkup) {
        this.blockElements[identifier].update();
        if (updateMarkup) {
            this.blockElements[identifier].updateMarkups();
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
        return keys(this.blockElements);
    }
}

export default Editor;
