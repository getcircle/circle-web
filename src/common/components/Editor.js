import React, { PropTypes } from 'react';
import 'script!trix/dist/trix.js';

import keyCodes from '../utils/keycodes';
import logger from '../utils/logger';

import CSSComponent from './CSSComponent';

class Editor extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        value: PropTypes.string,
    }

    static defaultProps = {
        onChange: () => {},
        placeholder: '',
        value: '',
    }

    state = {
        value: null,
    }

    componentDidMount() {
        this.setup();
        this.attachEventListners();
        this.mergeStateAndProps(this.props);
    }

    classes() {
        return {
            default: {
            },
        };
    }

    mergeStateAndProps(props) {
        if (this.state.value === null && props.value) {
            this.setState({
                value: props.value,
            }, () => {
                const trixEditor = document.querySelector('trix-editor');
                trixEditor.editor.insertHTML(props.value);
            });
        }
    }

    focus() {
        document.querySelector('trix-editor').focus();
    }

    setup() {
        const codeButton = document.querySelector('.button_group.block_tools .code');
        if (codeButton) {
            codeButton.setAttribute('data-key', 'alt+6');
        }
    }

    attachEventListners() {
        document.addEventListener('trix-change', (event) => this.handleChange(event));
        document.addEventListener('trix-file-accept', (event) => event.preventDefault());
        // document.querySelector('trix-editor')
        //     .addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    handleChange(event) {
        const {
            onChange,
        } = this.props;

        this.setState({
            value: event.target.value,
        });

        if (onChange) {
            onChange(event);
        }
    }

    handleKeyDown(event) {
        if (keyCodes.SPACE === event.keyCode) {
            const trixEditor = document.querySelector('trix-editor');
            const range = trixEditor.editor.getSelectedRange();
            if (range[1] - 4 >= 0) {
                // logger.log(Trix.Text.getTextAtRange([range[1] - 4, range[1]]));
            }
            logger.log(range);
        }
    }

    render() {
        const {
            placeholder,
        } = this.props;

        return (
            <div>
                <input
                    name="content"
                    onChange={::this.handleChange}
                    type="hidden"
                    value={this.state.value}
                />
                <trix-editor
                    class="leditor"
                    placeholder={placeholder}
                />
            </div>
        );
    }
}

export default Editor;
