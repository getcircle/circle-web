import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import MediumEditor from 'medium-editor';

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

    paragraphs = {}
    medium = null
    rootElement = null
    numberOfChildNodes = 0
    mediumEditorOptions = {
        autoLink: true,
        imageDragging: false,
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
        // logger.log('onKeyPress - Pressed ' + String.fromCharCode(event.keyCode));
        this.ensureCurrentElementHasAnIdentifier();
    }

    onKeyUp(event) {
        // logger.log('onKeyUp - ' + event.keyCode + (this.hasSelection() ? ' - Has selection' : ''));
        this.ensureCurrentElementHasAnIdentifier();
    }

    onToolbarButtonClicked(event, extension, actionName) {
        logger.log('onToolbarButtonClicked' + (this.hasSelection() ? ' - Has selection' : '') + ' ' + actionName);
        logger.log(extension);
        logger.log(event.target);
        // Identify paragrah and update with markup.
        // AddMarkup of type to a particular paragraph and capture any meta data.

        // 1. Detect is it addition or removal
        // 2. If addition and check range and see if we have a type for that range already
        // 3. If this type is the same, update the range
        // 4. If not add a new entry
        // 5. When removing, see if its part (or middle of) of an existing range. If yes, remove entry and create two entries.
        // 6. If exact match with the range update it directly
    }

    getRandomId() {
        return Math.round(1E6 * Math.random()).toString(36);
    }

    ensureCurrentElementHasAnIdentifier() {
        let currentElement = MediumEditor.selection.getSelectionStart(this.medium.options.ownerDocument);
        if (!currentElement.id) {
            this.assignIdentifiersToChildren(event.target);
        }
        console.log(currentElement.id + ' ' + currentElement.innerText);
    }

    assignIdentifiersToChildren(rootNode) {
        const ilen = rootNode.childNodes.length;
        let i = 0;
        let childNode;
        let processedIDs = {};

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
                if (childNode.id && this.paragraphs.hasOwnProperty(childNode.id) && !processedIDs.hasOwnProperty(childNode.id)) {
                    processedIDs[childNode.id] = true;
                } else if (childNode.id && processedIDs.hasOwnProperty(childNode.id)) {
                    childNode.id = this.getRandomId();
                    this.paragraphs[childNode.id] = true;
                    processedIDs[childNode.id] = true;
                } else {
                    childNode.id = this.getRandomId();
                    this.paragraphs[childNode.id] = true;
                    processedIDs[childNode.id] = true;
                }
            }
        }
    }

    addParagraph(identifier, type) {

    }

    updateParagraph(identifier) {
        // Read the plain text version of the node
    }

    removeParagraph(identifier) {

    }

    hasSelection() {
        const selectionState = this.medium.exportSelection();
        if (!selectionState) {
            return false;
        }

        const hasSelection = (selectionState.end - selectionState.start) > 0;
        return hasSelection;
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
