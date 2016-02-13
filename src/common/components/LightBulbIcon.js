import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class LightBulbIcon extends PureComponent {

    static propTypes = {
        height: PropTypes.number,
        stroke: PropTypes.string,
        width: PropTypes.number,
    }

    static defaultProps = {
        height: 40,
        stroke: '#000000',
        width: 40,
    }

    render() {
        const {
            height,
            stroke,
            width,
            ...other,
        } = this.props;
        return (
            <svg {...other}
                height={height}
                viewBox="0 0 40 40"
                width={width}
                xmlns="http://www.w3.org/2000/svg"
            >
                <g
                    fill="none"
                    fill-rule="evenodd"
                    id="Icon-Slices"
                    stroke="none"
                    strokeWidth="1">
                    <g fill={stroke} id="light" transform="translate(11.000000, 8.000000)">
                        <g id="Group">
                            <path d="M12,19 L6,19 C5.4,19 5,18.6 5,18 L5,17.5 C5,16.1 4.4,14.7 3.3,13.6 C1.7,12 0.9,9.9 1,7.7 C1.2,3.5 4.7,0.1 8.9,0 L9,0 C13.4,0 17,3.6 17,8 C17,10.1 16.2,12.2 14.6,13.7 C13.5,14.7 13,16.1 13,17.5 L13,18 C13,18.6 12.6,19 12,19 L12,19 Z M7,17 L11,17 C11.1,15.2 11.9,13.6 13.2,12.2 C14.4,11.1 15,9.6 15,8 C15,4.7 12.3,2 9,2 L8.9,2 C5.8,2.1 3.1,4.6 3,7.8 C2.9,9.4 3.6,11 4.7,12.2 C6.1,13.6 6.9,15.3 7,17 L7,17 Z" id="Shape"></path>
                            <path d="M9,24 L9,24 C6.8,24 5,22.2 5,20 L5,18 C5,17.4 5.4,17 6,17 L12,17 C12.6,17 13,17.4 13,18 L13,20 C13,22.2 11.2,24 9,24 L9,24 Z M7,19 L7,20 C7,21.1 7.9,22 9,22 L9,22 C10.1,22 11,21.1 11,20 L11,19 L7,19 L7,19 Z" id="Shape"></path>
                            <path d="M6,9 C5.4,9 5,8.6 5,8 C5,5.8 6.8,4 9,4 C9.6,4 10,4.4 10,5 C10,5.6 9.6,6 9,6 C7.9,6 7,6.9 7,8 C7,8.6 6.6,9 6,9 L6,9 Z" id="Shape"></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export default LightBulbIcon;
