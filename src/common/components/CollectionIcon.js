import React, { PropTypes } from 'react';

const CollectionIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="grid" transform="translate(8.000000, 8.000000)" fill={stroke}>
                    <g id="Group">
                        <path d="M10,11 L1,11 C0.4,11 0,10.6 0,10 L0,1 C0,0.4 0.4,0 1,0 L10,0 C10.6,0 11,0.4 11,1 L11,10 C11,10.6 10.6,11 10,11 L10,11 Z M2,9 L9,9 L9,2 L2,2 L2,9 L2,9 Z" id="Shape"></path>
                        <path d="M23,11 L14,11 C13.4,11 13,10.6 13,10 L13,1 C13,0.4 13.4,0 14,0 L23,0 C23.6,0 24,0.4 24,1 L24,10 C24,10.6 23.6,11 23,11 L23,11 Z M15,9 L22,9 L22,2 L15,2 L15,9 L15,9 Z" id="Shape"></path>
                        <path d="M10,24 L1,24 C0.4,24 0,23.6 0,23 L0,14 C0,13.4 0.4,13 1,13 L10,13 C10.6,13 11,13.4 11,14 L11,23 C11,23.6 10.6,24 10,24 L10,24 Z M2,22 L9,22 L9,15 L2,15 L2,22 L2,22 Z" id="Shape"></path>
                        <path d="M23,24 L14,24 C13.4,24 13,23.6 13,23 L13,14 C13,13.4 13.4,13 14,13 L23,13 C23.6,13 24,13.4 24,14 L24,23 C24,23.6 23.6,24 23,24 L23,24 Z M15,22 L22,22 L22,15 L15,15 L15,22 L15,22 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

CollectionIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
CollectionIcon.defaultProps = {
    height: 40,
    stroke: '#000000',
    strokeWidth: 1,
    width: 40,
};

export default CollectionIcon;
