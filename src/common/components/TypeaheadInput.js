import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class TypeaheadInput extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        style: PropTypes.object,
    }

    handleChange(event) {
        this.props.onChange(event);
    }

    render() {
        return (
            <input
                {...this.props}
            />
        );
    }
}

export default TypeaheadInput;
