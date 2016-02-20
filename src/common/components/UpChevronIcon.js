import React, { PropTypes } from 'react';

const UpChevronIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="icon-slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="up-chevron" transform="translate(11.000000, 14.000000)" fill={stroke}>
                    <path d="M17.7878412,9.34736842 L15.9342432,11.1597254 C15.792804,11.2988558 15.6253102,11.3684211 15.4317618,11.3684211 C15.2382134,11.3684211 15.0707196,11.2988558 14.9292804,11.1597254 L9,5.32723112 L3.0707196,11.1597254 C2.92928039,11.2988558 2.7617866,11.3684211 2.56823821,11.3684211 C2.37468983,11.3684211 2.20719603,11.2988558 2.06575682,11.1597254 L0.212158809,9.34736842 C0.0707195993,9.20823798 0,9.0416476 0,8.84759725 C0,8.65354691 0.0707195993,8.48695653 0.212158809,8.34782609 L8.49751861,0.208695652 C8.63895782,0.0695652137 8.80645162,0 9,0 C9.19354838,0 9.36104218,0.0695652137 9.50248139,0.208695652 L17.7878412,8.34782609 C17.9292804,8.48695653 18,8.65354691 18,8.84759725 C18,9.0416476 17.9292804,9.20823798 17.7878412,9.34736842" id="Shape"></path>
                </g>
            </g>
        </svg>
    );
}

UpChevronIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
UpChevronIcon.defaultProps = {
    height: 24,
    stroke: '#000000',
    strokeWidth: 2,
    width: 24,
};

export default UpChevronIcon;
