import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class DetailHeader extends CSSComponent {

    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element),
        img: PropTypes.string,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: '#333',
                    height: 320,
                },
            },
        };
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return <header {...other} style={{...this.styles().root, ...style}} />;
    }

}

export default DetailHeader;
