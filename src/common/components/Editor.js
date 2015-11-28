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

    paragraphs: {}
    medium = null
    rootElement = null
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
            logger.log('onChange');
            this._updated = true;
            this.onChange(this.rootElement.innerHTML);
        });

        // editable* versions are custom events that handle browser inconsistencies
        // For mordern browsers they are just wrappers to native events.
        this.medium.subscribe('editableKeypress', (event) => this.onKeyPress(event));
        this.medium.subscribe('editableKeyup', (event) => this.onKeyUp(event));
        this.medium.subscribe('editableKeydownEnter', (event) => this.onEnter(event));
        this.medium.subscribe('editableKeydownDelete', (event) => this.onDelete(event));
        this.medium.on(this.rootElement, 'mousedown', (event) => this.onMouseDown(event));

        // Attach listener for buttons in the toolbar
        this.mediumEditorOptions.toolbar.buttons.forEach((buttonName) => {
            let extension = this.medium.getExtensionByName(buttonName);
            if (extension) {
                logger.log(extension);
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
        logger.log('onKeyPress - Pressed ' + String.fromCharCode(event.keyCode));
        logger.log(MediumEditor.selection.getSelectionStart(this.medium.options.ownerDocument));
    }

    onKeyUp(event) {
        logger.log('onKeyUp - ' + event.keyCode + (this.hasSelection() ? ' - Has selection' : ''));
    }

    onMouseDown(event) {
        logger.log('onMouseDown' + (this.hasSelection() ? ' - Has selection' : ''));
    }

    onEnter(event) {
        // Add new paragraph on enter and assign it a name/id
        logger.log('Add paragraph');
        logger.log(MediumEditor.selection.getSelectionStart(this.medium.options.ownerDocument));
    }

    onDelete(event) {
        // Check if number of child nodes have changed. If so, compare and remove based on ID
        // If not, find the paragraph that has changed and trigger update paragraph
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
