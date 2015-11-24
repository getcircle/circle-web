import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class SearchIcon extends PureComponent {

    static propTypes = {
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
    }

    static defaultProps = {
        stroke: '#000000',
        strokeWidth: 2,
    }

    render() {
        const {
            stroke,
            strokeWidth,
            ...other,
        } = this.props;
        return (
            <svg {...other} width="40px" height="40px" viewBox="0 0 40 40">
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle-430-Copy-11" x="0" y="0" width="40" height="40"></rect>
                    <g id="Oval-154-+-Rectangle-417-Copy-3" transform="translate(21.617009, 22.031223) rotate(-45.000000) translate(-21.617009, -22.031223) translate(13.117009, 9.031223)">
                        <circle id="Oval-154" stroke={stroke} strokeWidth={strokeWidth} cx="8.5" cy="8.32842712" r="8"></circle>
                        <rect id="Rectangle-417" fill={stroke} x="7.79289322" y="15.6629509" width={strokeWidth} height="10" rx="1"></rect>
                    </g>
                </g>
            </svg>
        );
    }
}

export default SearchIcon;
