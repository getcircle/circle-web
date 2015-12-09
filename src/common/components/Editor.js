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
    }

    getValue(value) {
    }

    render() {
        const {
            placeholder,
        } = this.props;

        // const finalValue = this.getValue(value);

        return (
            <div>
                <input id="x" name="content" type="hidden" />
                <trix-editor class="leditor" placeholder={placeholder} />
            </div>
        );
    }
}

export default Editor;
