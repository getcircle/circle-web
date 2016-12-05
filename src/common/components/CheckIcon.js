import React, { PropTypes } from 'react';

const CheckIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="Icon-Slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="check" transform="translate(9.000000, 13.000000)" fill={stroke}>
                    <g id="Layer_1">
                        <path d="M7.7,15.4 C7.408225,15.4 7.12855,15.284225 6.9223,15.077975 L0.3223,8.4777 C-0.10725,8.04815 -0.10725,7.35185 0.3223,6.9223 C0.75185,6.49275 1.448425,6.49275 1.8777,6.9223 L7.7,12.7446 L20.1223,0.3223 C20.55185,-0.10725 21.248425,-0.10725 21.6777,0.3223 C22.10725,0.75185 22.10725,1.448425 21.6777,1.877975 L8.4777,15.077975 C8.27145,15.284225 7.991775,15.4 7.7,15.4 L7.7,15.4 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

CheckIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
CheckIcon.defaultProps = {
    height: 40,
    stroke: '#000000',
    strokeWidth: 1,
    width: 40,
};

export default CheckIcon;
