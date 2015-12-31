import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class TypeaheadInput extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func,
        style: PropTypes.object,
    }

    updateQueryTimer = null;

    handleChange(event) {
        clearTimeout(this.updateQueryTimer);
        this.updateQueryTimer = setTimeout(() => { this.props.onChange(event) }, 100);
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
