import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class TrashIcon extends PureComponent {

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
            <svg
                {...other}
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill={stroke} />
            </svg>
        );
    }
}

export default TrashIcon;
