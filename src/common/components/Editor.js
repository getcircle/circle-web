import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import MediumEditor from 'medium-editor';

import { default as EditorModel } from '../models/Editor';
import logger from '../utils/logger';
import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

class Editor extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func,
    }

    static defaultProps = {
        onChange: () => {}
    }

    state = {
        text: '',
    }

    editorModel = new EditorModel();
    medium = null
    rootElement = null
    numberOfChildNodes = 0
    updateTimeout = null
    mediumEditorOptions = {
        anchor: {
            linkValidation: true,
        },
        autoLink: false,
        imageDragging: false,
        keyboardCommands: {
            commands: [
                {
                    command: 'bold',
                    key: 'B',
                    meta: true,
                    shift: false,
                    alt: false
                },
                {
                    command: 'italic',
                    key: 'I',
                    meta: true,
                    shift: false,
                    alt: false
                },
            ],
        },
        paste: {
            forcePlainText: true,
        },
        placeholder: {
            text: t('Contribute Knowledge'),
        },
        targetBlank: true,
        toolbar: {
            buttons: ['bold', 'italic', 'anchor'],
        },
    }

    componentDidMount() {
        this.rootElement = ReactDOM.findDOMNode(this);
        this.medium = new MediumEditor(this.rootElement, this.mediumEditorOptions);
        this.attachEventHandlers();
    }

    componentWillUnmount() {
        this.medium.destroy();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.text !== this.state.text && !this.updated) {
            this.setState({
                text: nextProps.text
            });
        }

        if (this.updated) {
            this.updated = false;
        }
    }

    classes() {
        return {
            default: {
                root: {
                    position: 'relative',
                },
                textareaStyle: {
                    cursor: 'text',
                    outline: 0,
                    padding: 0,
                    resize: 'none',
                    width: '100%',
                },
                shadowStyle: {
                    opacity: 0,
                    outline: 0,
                    overflow: 'hidden',
                    padding: 0,
                    position: 'absolute',
                    resize: 'none',
                    width: '100%',
                }
            },
        };
    }

    // Medium editor specific events
    attachEventHandlers() {
        // editable* versions are custom events that handle browser inconsistencies
        // For mordern browsers they are just wrappers to native events.
        // this.medium.subscribe('editableInput', (event, editable) => this.onChange(event, editable));
        this.medium.subscribe('editableKeypress', (event) => this.onKeyPress(event));
        this.medium.subscribe('editableKeyup', (event) => this.onKeyUp(event));
        this.medium.subscribe('editableKeydownEnter', event => this.onEnter(event));
        this.medium.subscribe('editableKeydownDelete', event => this.onDelete(event));
        this.medium.subscribe('editablePaste', event => this.onPaste(event));

        // Attach listener for buttons in the toolbar
        this.mediumEditorOptions.toolbar.buttons.forEach((buttonName) => {
            let extension = this.medium.getExtensionByName(buttonName);
            if (extension) {
                let buttonDOMElement = extension.button;
                this.medium.on(buttonDOMElement, 'click', (event) => {
                    this.onToolbarButtonClicked(event, extension, buttonName);
                });

                if (buttonName === 'anchor') {
                    let anchorFormSaveButton = extension.getForm().querySelector('.medium-editor-toolbar-save');
                    this.medium.on(anchorFormSaveButton, 'click', (event) => {
                        this.onToolbarButtonClicked(event, extension, buttonName);
                    });
                }
            }
        });
    }

    onChange(event, editable) {
        if (editable) {
            if (this.numberOfChildNodes !== editable.childNodes.length) {
                this.assignIdentifiersToChildren(event.target);
            }

            this.numberOfChildNodes = editable.childNodes.length;
            this.updated = true;
        }

        // Check if we have an onChange callback and some text
        if (this.props.onChange && this.rootElement.innerText.length > 0) {
            logger.log(this.editorModel.printHTML());
            this.props.onChange(this.editorModel.getJSON(), this.medium);
        }
    }

    onKeyPress(event) {
        // Find the paragraph where things have changed and request its contents to be updated
        const identifier = this.getCurrentElementIdentifier();
        if (identifier && this.editorModel.getElementById(identifier)) {
            if (this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }

            this.updateTimeout = setTimeout(() => {
                this.editorModel.updateBlockElement(identifier);
                this.onChange();
            }, 100);
        }
    }

    /**
     * Get the ID of the current element in which selection happened
     *
     * This function finds the one level deep child of the main editor element
     * in which the selection happened. It also specifically looks for the element with "p"
     * tag because of our own internal restriction at this time.
     *
     * @return {String} ID of the current element.
     */
    getCurrentElementIdentifier() {
        let currentElement = MediumEditor.selection.getSelectionStart(this.medium.options.ownerDocument);
        if (!currentElement || currentElement === this.rootElement) {
            return null;
        }

        if (currentElement.nodeType !== 1 ||
            EditorModel.acceptableBlockTags().indexOf(currentElement.tagName) === -1 ||
            currentElement.parentNode !== this.rootElement
        ) {
            let parentNode = currentElement.parentNode;
            while (parentNode !== this.rootElement) {
                currentElement = parentNode;
                parentNode = parentNode.parentNode;
            };
        }

        if (!currentElement.id) {
            this.assignIdentifiersToChildren(event.target);
        }
        return currentElement.id;
    }

    onKeyUp(event) {
        // Key up is called on every keystroke. This is the best place to ensure we have an ID assigned
        // to the element
        this.ensureCurrentElementHasAnIdentifier();
    }

    onEnter(event) {
        this.assignIdentifiersToChildren(this.rootElement);
        this.onChange();
    }

    onDelete(event) {
        // Cancel any existing scheduled updates
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        // Full update
        this.assignIdentifiersToChildren(this.rootElement, true);
        this.onChange();
    }

    onPaste(event) {
        // Cancel any existing scheduled updates
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        // Full update
        this.assignIdentifiersToChildren(this.rootElement, true);
        this.onChange();
    }

    onToolbarButtonClicked(event, extension, actionName) {
        // Identify paragrah and update with markup.
        // AddMarkup of type to a particular paragraph and capture any meta data.

        // 1. Detect is it addition or removal
        // 2. If addition and check range and see if we have a type for that range already
        // 3. If this type is the same, update the range
        // 4. If not add a new entry
        // 5. When removing, see if its part (or middle of) of an existing range. If yes, remove entry and create two entries.
        // 6. If exact match with the range update it directly
        const selection = this.getSelection();
        if (!selection) {
            logger.log('Selection not found.');
            return;
        }

        // Figure our which elements and what text inside of those was selected
        let childNode,
            contentLength,
            entireSelectionIsWithinRange = false,
            previousLength = 0,
            range,
            updates = false;
        for (let i = 0; i < this.rootElement.childNodes.length; i++) {
            childNode = this.rootElement.childNodes[i];
            range = new Range(0, 0);
            range.selectNodeContents(childNode);
            contentLength = range.toString().length;
            if (contentLength === 0) {
                continue;
            }

            let start = previousLength, end = contentLength + previousLength;
            let selectedText = null;
            if (selection.start >= start && end >= selection.end) {
                // Entire selection is within range
                selectedText = range.toString().substr(selection.start - start, selection.end - selection.start);
                entireSelectionIsWithinRange = true;
            }
            else if (start >= selection.start && end <= selection.end) {
                // Entire selection contains range
                selectedText = range.toString();
            }
            else if (selection.end > start && selection.end < end && start > selection.start) {
                // Selection ends partially within this range
                selectedText = range.toString().substr(0, selection.end - start);
            }
            else if (selection.start >= start && selection.start < end && end < selection.end) {
                // Selection starts partially within this range
                selectedText = range.toString().substr(selection.start - start);
            }

            if (selectedText !== null) {
                logger.log('Updating markup - ' + selectedText);
                this.editorModel.updateBlockElement(childNode.id, true);
                updates = true;
            }

            if (entireSelectionIsWithinRange) {
                // If we have found the selection, stop traversing
                break;
            }
            previousLength = end;
        }

        if (updates) {
            this.onChange();
        }
    }

    ensureCurrentElementHasAnIdentifier() {
        let currentElement = MediumEditor.selection.getSelectionStart(this.medium.options.ownerDocument);
        if (!currentElement || currentElement === this.rootElement) {
            return null;
        } else if (!currentElement.id) {
            this.assignIdentifiersToChildren(event.target);
        }

        return currentElement.id;
    }

    assignIdentifiersToChildren(rootNode, updateTextAndMarkup) {
        const ilen = rootNode.childNodes.length;
        let i = 0;
        let blockElement;
        let childNode;
        let processedElements = {};

        for (i = 0; i < ilen; i++) {

            childNode = rootNode.childNodes[i];
            // Only process elements
            if (childNode.nodeType !== 1) {
                continue;
            }

            // Assign new ID to only paragraph nodes and
            // if the element either does not have an ID or
            // the ID has already been taken.
            if (EditorModel.acceptableBlockTags().indexOf(childNode.tagName) !== -1) {
                if (childNode.id &&
                    this.editorModel.getElementById(childNode.id) &&
                    !processedElements.hasOwnProperty(childNode.id)) {
                    processedElements[childNode.id] = this.editorModel.getElementById(childNode.id);
                } else {
                    blockElement = this.editorModel.addBlockElement(childNode);
                    processedElements[blockElement.id] = blockElement;
                }

                if (updateTextAndMarkup) {
                    this.editorModel.updateBlockElement(childNode.id, true);
                }
            }
        }

        // Cleanup other blockElements
        this.editorModel.getAllElementsIds().forEach(identifier => {
            if (!processedElements.hasOwnProperty(identifier)) {
                this.editorModel.removeBlockElement(identifier);
            }
        });
    }

    // Note: this returns start, end offsets relative to the root editor element.
    getSelection() {
        const selectionState = this.medium.exportSelection();
        if (!selectionState || (selectionState.end - selectionState.start) <= 0) {
            return null;
        }

        return selectionState;
    }

    render() {
        const {
            ...other,
        } = this.props;

        return (
            <div
                contentEditable={true}
                dangerouslySetInnerHTML={{__html: this.state.text}}
                {...other}
            />
        );
    }
}

export default Editor;
