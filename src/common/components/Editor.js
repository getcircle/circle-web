import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import MediumEditor from 'medium-editor';

import logger from '../utils/logger';

import CSSComponent from './CSSComponent';

class Editor extends CSSComponent {

    static propTypes = {
    }

    static defaultProps = {
    }

    state = {
        text: '',
    }

    componentDidMount() {
        const mediumEditorOptions = {
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
        };


        const dom = ReactDOM.findDOMNode(this);
        this.medium = new MediumEditor(dom, mediumEditorOptions);
        this.medium.subscribe('editableInput', (event, editable) => {
            logger.log('onChange');
            this._updated = true;
            this.onChange(dom.innerHTML);
        });
        this.medium.subscribe('editableKeypress', (event) => this.onKeyPress(event));
        this.medium.subscribe('editableKeyup', (event) => this.onKeyUp(event));
        this.medium.on(dom, 'mousedown', (event) => this.onMouseDown(event));
        logger.log(this.medium.getExtensionByName('bold'));
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


    onChange(text) {
        if (this.props.onChange) {
            this.props.onChange(text, this.medium);
        }
    }

    onKeyPress(event) {
        logger.log('onKeyPress - Pressed ' + String.fromCharCode(event.keyCode));
    }

    onKeyUp(event) {
        logger.log('onKeyUp' + (this.hasSelection() ? ' - Has selection' : ''));
        logger.log(event.keyCode);
    }

    onMouseDown(event) {
        logger.log('onMouseDown' + (this.hasSelection() ? ' - Has selection' : ''));
        logger.log('onMouseDown');
        logger.log(event);
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
