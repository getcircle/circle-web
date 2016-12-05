import React, { PropTypes } from 'react';

const PersonIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg
            height={height}
            viewBox="0 0 40 40"
            width={width}
            {...other}
        >
            <g
                fill="none"
                fill-rule="evenodd"
                id="Icon-Slices"
                stroke="none"
                strokeWidth={strokeWidth}
            >
                <g fill={stroke} id="user" transform="translate(10.000000, 9.000000)">
                    <g id="Layer_1">
                        <g id="Group">
                            <path d="M10,12 C9.1,12 8.3,11.7 7.6,11.3 C5.9,10.2 5,7.9 5,5 C5,2.2 7.2,0 10,0 C12.8,0 15,2.2 15,5 C15,7.9 14.1,10.2 12.4,11.3 C11.7,11.7 10.9,12 10,12 L10,12 Z M10,2 C8.3,2 7,3.3 7,5 C7,7.2 7.6,8.9 8.7,9.6 C9.5,10.1 10.5,10.1 11.3,9.6 C12.4,8.9 13,7.2 13,5 C13,3.3 11.7,2 10,2 L10,2 Z" id="Shape"></path>
                            <path d="M10,22 C7.7,22 0,21.7 0,18 C0,14.3 2.7,13 5.7,12.1 C5.9,12 6.7,11.7 7,10.2 L9,10.6 C8.7,12.4 7.7,13.5 6.3,14 C3.3,15 2,15.8 2,18 C2,19.1 6.2,20 10,20 C13.8,20 18,19.1 18,18 C18,15.8 16.7,15 13.7,13.9 C12.3,13.4 11.4,12.3 11,10.5 L13,10.1 C13.3,11.6 14.1,11.9 14.4,12 C17.4,13 20.1,14.2 20.1,17.9 C20,18.9 19.3,22 10,22 L10,22 Z" id="Shape"></path>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

PersonIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
PersonIcon.defaultProps = {
    height: 40,
    stroke: '#000000',
    strokeWidth: 1,
    width: 40,
};

export default PersonIcon;
