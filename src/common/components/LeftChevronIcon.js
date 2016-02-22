import React, { PropTypes } from 'react';

const LeftChevronIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="left-chevron" transform="translate(14.000000, 12.000000)" fill={stroke}>
                    <path d="M10.4710425,2.72952854 L5.003861,8 L10.4710425,13.2704715 C10.6014586,13.3961952 10.6666667,13.5450786 10.6666667,13.7171216 C10.6666667,13.8891646 10.6014586,14.038048 10.4710425,14.1637717 L8.76190476,15.8114144 C8.63148863,15.9371381 8.47704847,16 8.2985843,16 C8.12012012,16 7.96567997,15.9371381 7.83526384,15.8114144 L0.195624196,8.44665012 C0.0652080618,8.32092638 0,8.17204301 0,8 C0,7.82795699 0.0652080618,7.67907362 0.195624196,7.55334988 L7.83526384,0.188585608 C7.96567997,0.062861866 8.12012012,0 8.2985843,0 C8.47704847,0 8.63148863,0.062861866 8.76190476,0.188585608 L10.4710425,1.83622829 C10.6014586,1.96195203 10.6666667,2.1108354 10.6666667,2.28287841 C10.6666667,2.45492142 10.6014586,2.60380479 10.4710425,2.72952854" id="Shape"></path>
                </g>
            </g>
        </svg>
    );
};

LeftChevronIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
LeftChevronIcon.defaultProps = {
    height: 30,
    stroke: '#000000',
    strokeWidth: 1,
    width: 30,
};

export default LeftChevronIcon;
