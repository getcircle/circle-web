import React, { PropTypes } from 'react';

const ShareIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="share" transform="translate(8.000000, 10.000000)" fill={stroke}>
                    <g id="Group">
                        <path d="M14,19 C13.9,19 13.7,19 13.6,18.9 C13.2,18.8 13,18.4 13,18 L13,13 C13,12.4 13.4,12 14,12 C14.6,12 15,12.4 15,13 L15,15.8 L21.5,10 L15,4.2 L15,7 C15,7.6 14.6,8 14,8 C13.4,8 13,7.6 13,7 L13,2 C13,1.6 13.2,1.2 13.6,1.1 C14,0.9 14.4,1 14.7,1.3 L23.7,9.3 C23.9,9.5 24,9.8 24,10 C24,10.2 23.9,10.6 23.7,10.7 L14.7,18.7 C14.5,18.9 14.2,19 14,19 L14,19 Z" id="Shape"></path>
                        <path d="M1,19 L0.8,19 C0.3,18.9 0,18.5 0,18 C0,6.1 13.9,6 14,6 C14.6,6 15,6.4 15,7 C15,7.6 14.6,8 14,8 C13.6,8 4.5,8.1 2.4,14.9 C4.4,13.5 7.9,12 14,12 C14.6,12 15,12.4 15,13 C15,13.6 14.6,14 14,14 C3.9,14 1.9,18.3 1.9,18.4 C1.8,18.8 1.4,19 1,19 L1,19 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

ShareIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
ShareIcon.defaultProps = {
    height: 30,
    stroke: '#000000',
    strokeWidth: 1,
    width: 30,
};

export default ShareIcon;
