import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class MoreHorizontalIcon extends PureComponent {

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
                <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill={stroke} />
            </svg>
        );
    }
}

export default MoreHorizontalIcon;
