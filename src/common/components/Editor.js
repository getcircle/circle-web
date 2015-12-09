import React, { PropTypes } from 'react';
import 'script!trix/dist/trix.js';

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
        value: '',
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    classes() {
        return {
            default: {
            },
        };
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
                    id="x"
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
