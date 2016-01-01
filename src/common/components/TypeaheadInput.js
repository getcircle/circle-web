import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class TypeaheadInput extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func,
        style: PropTypes.object,
    }

    handleChange(event) {
        this.props.onChange(event);
    }

    render() {
        return (
            <input
                onChange={::this.handleChange}
                style={this.props.style}
            />
        );
    }
}

export default TypeaheadInput;
