import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class TypeaheadInput extends CSSComponent {

    static propTypes = {
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        style: PropTypes.object,
    }

    handleInputBlur(event) {
        event.target.value = '';
    }

    render() {
        return (
            <input
                onBlur={::this.handleInputBlur}
                {...this.props}
            />
        );
    }
}

export default TypeaheadInput;
