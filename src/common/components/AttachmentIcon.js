import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class AttachmentIcon extends PureComponent {

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
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M7.5 18C4.46 18 2 15.54 2 12.5S4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v1.5H9.5c-.55 0-1 .45-1 1s.45 1 1 1H18c1.38 0 2.5-1.12 2.5-2.5S19.38 8.5 18 8.5H7.5c-2.21 0-4 1.79-4 4s1.79 4 4 4H17V18H7.5z" fill={stroke} />
            </svg>
        );
    }
}

export default AttachmentIcon;
