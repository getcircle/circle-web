import React, { PropTypes } from 'react';

const PlusIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="plus" transform="translate(12.000000, 12.000000)" fill={stroke}>
                    <g id="Layer_1">
                        <g id="Group">
                            <path d="M7.99469401,16 C7.35469401,16 6.92802734,15.4666667 6.92802734,14.6666667 L6.92802734,1.33333333 C6.92802734,0.533333333 7.35469401,0 7.99469401,0 C8.63469401,0 9.06136068,0.533333333 9.06136068,1.33333333 L9.06136068,14.6666667 C9.06136068,15.4666667 8.63469401,16 7.99469401,16 L7.99469401,16 Z" id="Shape"></path>
                            <path d="M14.6666667,9.06666667 L1.33333333,9.06666667 C0.533333333,9.06666667 0,8.64 0,8 C0,7.36 0.533333333,6.93333333 1.33333333,6.93333333 L14.6666667,6.93333333 C15.4666667,6.93333333 16,7.36 16,8 C16,8.64 15.4666667,9.06666667 14.6666667,9.06666667 L14.6666667,9.06666667 Z" id="Shape"></path>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}

PlusIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
PlusIcon.defaultProps = {
    height: 24,
    stroke: '#000000',
    strokeWidth: 2,
    width: 24,
};

export default PlusIcon;
