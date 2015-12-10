import React, { PropTypes } from 'react';
import 'script!trix/dist/trix.js';

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
        document.addEventListener('trix-change', (event) => this.handleChange(event));
        document.addEventListener('trix-file-accept', (event) => {
            event.preventDefault();
        });
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
                if (document.querySelector) {
                    var trixEditor = document.querySelector('trix-editor');
                    trixEditor.editor.insertHTML(props.value);
                }
            });
        }
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
