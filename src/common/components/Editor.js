import ReactDOM from 'react-dom';
import React from 'react';
import MediumEditor from 'medium-editor';

import { default as EditorModel } from '../models/EditorModel';
import logger from '../utils/logger';
import t from '../utils/gettext';


import CSSComponent from './CSSComponent';

class Editor extends CSSComponent {

    static propTypes = {
    }

    static defaultProps = {
    }

    state = {
        text: '',
    }

    editorModel = new EditorModel();
    medium = null
    rootElement = null
    numberOfChildNodes = 0
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
        if (nextProps.text !== this.state.text && !this._updated) {
            this.setState({
                text: nextProps.text
            });
        }

        if (this._updated) {
            this._updated = false;
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
        this.medium.subscribe('editableInput', (event, editable) => {
            if (this.numberOfChildNodes !== editable.childNodes.length) {
                this.assignIdentifiersToChildren(event.target);
            }

            this.numberOfChildNodes = editable.childNodes.length;
            this._updated = true;
            this.onChange(this.rootElement.innerHTML);
        });

        // editable* versions are custom events that handle browser inconsistencies
        // For mordern browsers they are just wrappers to native events.
        this.medium.subscribe('editableKeypress', (event) => this.onKeyPress(event));
        this.medium.subscribe('editableKeyup', (event) => this.onKeyUp(event));

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

    onChange(text) {
        if (this.props.onChange) {
            this.props.onChange(text, this.medium);
        }
    }

    onKeyPress(event) {
        // Find the paragraph where things have changed and request its contents to be updated
        const identifier = this.getCurrentElementIdentifier();
        if (identifier && this.editorMode.getElementById(identifier)) {
            this.editorModel.updateBlockElement(identifier);
        }
    }

    onKeyUp(event) {
        this.ensureCurrentElementHasAnIdentifier();
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

        const isActive = extension.isActive();
        logger.log((isActive ? 'added' : 'removed') + ' ' + actionName
            + ' to range (' + selection.start + ',' + selection.end + ')'
        );

        // Figure our which elements and what text inside of those was selected
        let childNode, previousLength = 0, range, contentLength;
        for (let i = 0; i < this.rootElement.childNodes.length; i++) {
            childNode = this.rootElement.childNodes[i];
            range = new Range(0, 0);
            range.selectNodeContents(childNode);
            contentLength = range.toString().length;
            if (contentLength === 0) {
                continue;
            }

            let start = previousLength, end = contentLength + previousLength;
            logger.log('childNode ID ' + childNode.id + ' Range (' + start + ',' + end + ')');
            let selectedText = null, matchedAlgo = 0;
            if (selection.start >= start && end >= selection.end) {
                // Entire selection is within range
                selectedText = range.toString().substr(selection.start - start, selection.end - selection.start);
                matchedAlgo = 1;
            }
            else if (start >= selection.start && end <= selection.end) {
                // Entire selection contains range
                selectedText = range.toString();
                matchedAlgo = 2;
            }
            else if (selection.end > start && selection.end < end && start > selection.start) {
                // Selection ends partially within this range
                selectedText = range.toString().substr(0, selection.end - start);
                matchedAlgo = 3;
            }
            else if (selection.start >= start && selection.start < end && end < selection.end) {
                // Selection starts partially within this range
                selectedText = range.toString().substr(selection.start - start);
                matchedAlgo = 4;
            }

            if (selectedText !== null) {
                logger.log('FOUND SELECTION - ' + selectedText + ' (' + matchedAlgo + ')');
                this.editorModel.updateBlockElement(childNode.id, true);
            }

            if (matchedAlgo === 1) {
                // If we have found the selection, stop traversing
                break;
            }
            previousLength = end;
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
            currentElement.tagName.toLowerCase !== 'p' ||
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

    ensureCurrentElementHasAnIdentifier() {
        let currentElement = MediumEditor.selection.getSelectionStart(this.medium.options.ownerDocument);
        if (!currentElement || currentElement === this.rootElement) {
            return null;
        } else if (!currentElement.id) {
            this.assignIdentifiersToChildren(event.target);
        }
        logger.log(currentElement.id + ' ' + currentElement.innerText);
        return currentElement.id;
    }

    assignIdentifiersToChildren(rootNode) {
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
            if (childNode.tagName.toLowerCase() === 'p') {
                if (childNode.id &&
                    this.editorModel.getElementById(childNode.id) &&
                    !processedElements.hasOwnProperty(childNode.id)) {
                    processedElements[childNode.id] = this.editorModel.getElementById(childNode.id);
                } else {
                    blockElement = this.editorMode.addBlockElement(childNode);
                    processedElements[blockElement.id] = blockElement;
                }
            }
        }

        // Cleanup other blockElements
        for (let id in this.editorModel.getAllElementsIds()) {
            if (!processedElements.hasOwnProperty(id)) {
                this.editorModel.removeBlockElement(id);
            }
        }
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
