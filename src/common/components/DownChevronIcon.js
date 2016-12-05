import React, { PropTypes } from 'react';

const DownChevronIcon = ({height, stroke, strokeWidth, width, ...other}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" {...other}>
            <g id="icon-slices" stroke="none" strokeWidth={strokeWidth} fill="none" fillRule="evenodd">
                <g id="down-chevron" transform="translate(11.000000, 15.000000)" fill={stroke}>
                    <path d="M17.7878412,3.02059497 L9.50248139,11.1597254 C9.36104218,11.2988558 9.19354838,11.3684211 9,11.3684211 C8.80645162,11.3684211 8.63895782,11.2988558 8.49751861,11.1597254 L0.212158809,3.02059497 C0.0707195993,2.88146453 0,2.71487415 0,2.5208238 C0,2.32677345 0.0707195993,2.16018307 0.212158809,2.02105263 L2.06575682,0.208695652 C2.20719603,0.0695652137 2.37468983,0 2.56823821,0 C2.7617866,0 2.92928039,0.0695652137 3.0707196,0.208695652 L9,6.04118993 L14.9292804,0.208695652 C15.0707196,0.0695652137 15.2382134,0 15.4317618,0 C15.6253102,0 15.792804,0.0695652137 15.9342432,0.208695652 L17.7878412,2.02105263 C17.9292804,2.16018307 18,2.32677345 18,2.5208238 C18,2.71487415 17.9292804,2.88146453 17.7878412,3.02059497" id="Shape"></path>
                </g>
            </g>
        </svg>
    );
}

DownChevronIcon.propTypes = {
    height: PropTypes.number,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    width: PropTypes.number,
};
DownChevronIcon.defaultProps = {
    height: 24,
    stroke: '#000000',
    strokeWidth: 2,
    width: 24,
};

export default DownChevronIcon;
