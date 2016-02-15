import React, { PropTypes } from 'react';

const MoreIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="icon-slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="menu-circle-dots" transform="translate(12.000000, 18.000000)" fill={stroke}>
                    <g id="Layer_1">
                        <g id="Group">
                            <circle id="Oval" cx="2" cy="2" r="2"></circle>
                            <circle id="Oval" cx="8" cy="2" r="2"></circle>
                            <circle id="Oval" cx="14" cy="2" r="2"></circle>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

MoreIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
MoreIcon.defaultProps = {
    height: 26,
    stroke: '#000000',
    strokeWidth: 2,
    width: 26,
};

export default MoreIcon;
