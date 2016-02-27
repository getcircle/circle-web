import React, { PropTypes } from 'react';

const AddCollectionIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fill-rule="evenodd">
                <g id="add-collection" transform="translate(8.000000, 8.000000)" fill={stroke}>
                    <g id="Group">
                        <path d="M23,24 L14,24 C13.4,24 13,23.6 13,23 L13,14 C13,13.4 13.4,13 14,13 L23,13 C23.6,13 24,13.4 24,14 L24,23 C24,23.6 23.6,24 23,24 L23,24 Z M15,22 L22,22 L22,15 L15,15 L15,22 L15,22 Z" id="Shape"></path>
                        <path d="M10,24 L1,24 C0.4,24 0,23.6 0,23 L0,14 C0,13.4 0.4,13 1,13 L10,13 C10.6,13 11,13.4 11,14 L11,23 C11,23.6 10.6,24 10,24 L10,24 Z M2,22 L9,22 L9,15 L2,15 L2,22 L2,22 Z" id="Shape"></path>
                        <path d="M10,11 L1,11 C0.4,11 0,10.6 0,10 L0,1 C0,0.4 0.4,0 1,0 L10,0 C10.6,0 11,0.4 11,1 L11,10 C11,10.6 10.6,11 10,11 L10,11 Z M2,9 L9,9 L9,2 L2,2 L2,9 L2,9 Z" id="Shape"></path>
                        <path d="M22.75,6 L15.25,6 C14.5,6 14,5.6 14,5 C14,4.4 14.5,4 15.25,4 L22.75,4 C23.5,4 24,4.4 24,5 C24,5.6 23.5,6 22.75,6 L22.75,6 Z" id="Shape"></path>
                        <path d="M19,10 C18.4,10 18,9.5 18,8.75 L18,1.25 C18,0.5 18.4,0 19,0 C19.6,0 20,0.5 20,1.25 L20,8.75 C20,9.5 19.6,10 19,10 L19,10 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

AddCollectionIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
AddCollectionIcon.defaultProps = {
    height: 40,
    stroke: '#000000',
    strokeWidth: 1,
    width: 40,
};

export default AddCollectionIcon;
