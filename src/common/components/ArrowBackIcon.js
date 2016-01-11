import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class ArrowBackIcon extends PureComponent {

    static propTypes = {
        stroke: PropTypes.string,
    }

    static defaultProps = {
        stroke: '#000000',
    }

    render() {
        const {
            stroke,
            ...other,
        } = this.props;
        return (
            <svg {...other}
                height="18"
                viewBox="0 0 18 18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z" fill={stroke} />
            </svg>
        );
    }
}

export default ArrowBackIcon;
