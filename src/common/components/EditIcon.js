import React, { PropTypes } from 'react';

const EditIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="icon-slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="edit" transform="translate(9.000000, 7.000000)" fill={stroke}>
                    <g id="Group">
                        <path d="M18.2,24 L3.8,24 C1.7,24 0,22.3 0,20.2 L0,5.8 C0,3.7 1.7,2 3.8,2 L11,2 C11.6,2 12,2.4 12,3 C12,3.6 11.6,4 11,4 L3.8,4 C2.8,4 2,4.8 2,5.8 L2,20.1 C2,21.1 2.8,21.9 3.8,21.9 L18.1,21.9 C19.1,21.9 19.9,21.1 19.9,20.1 L19.9,13 C19.9,12.4 20.3,12 20.9,12 C21.5,12 21.9,12.4 21.9,13 L21.9,20.2 C22,22.3 20.3,24 18.2,24 L18.2,24 Z" id="Shape"></path>
                        <path d="M6,19 C5.7,19 5.5,18.9 5.3,18.7 C5.1,18.5 5,18.1 5,17.8 L6,12.8 C6,12.6 6.1,12.4 6.3,12.3 L18.3,0.3 C18.7,-0.1 19.3,-0.1 19.7,0.3 L23.7,4.3 C24.1,4.7 24.1,5.3 23.7,5.7 L11.7,17.7 C11.6,17.8 11.4,17.9 11.2,18 L6.2,19 C6.1,19 6.1,19 6,19 L6,19 Z M7.9,13.5 L7.3,16.7 L10.5,16.1 L21.6,5 L19,2.4 L7.9,13.5 L7.9,13.5 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
}

EditIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
EditIcon.defaultProps = {
    height: 24,
    stroke: '#000000',
    strokeWidth: 2,
    width: 24,
};

export default EditIcon;
