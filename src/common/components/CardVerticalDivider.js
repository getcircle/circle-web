import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class CardVerticalDivider extends CSSComponent {

    static propTypes = {
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    width: 1,
                    backgroundColor: 'rgba(0, 0, 0, .1)',
                    marginTop: 20,
                    marginBottom: 20,
                },
            },
        };
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return <div {...other} style={{...this.styles().root, ...style}} />
    }

}

export default CardVerticalDivider;
