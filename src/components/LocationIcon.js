import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class LocationIcon extends PureComponent {

    static propTypes = {
        stroke: PropTypes.string,
    }

    static defaultProps = {
        stroke: '#000000',
    }

    render() {
        const {
            stroke,
            ...other,
        } = this.props;
        return (
            <svg {...other} width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <title>Rectangle 430 Copy</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle-430-Copy" x="0" y="0" width="40" height="40"></rect>
                    <g id="Oval-64-+-Oval-65-+-Path-622" transform="translate(9.000000, 8.000000)" stroke={stroke} strokeWidth="2">
                        <path d="M11,20 C11.8,20 19,14.018278 19,8 C19,3.581722 15.418278,0 11,0 C6.581722,0 3,3.581722 3,8 C3,14.018278 10.2,20 11,20 Z" id="Oval-64" strokeLinecap="round" strokeLinejoin="round"></path>
                        <circle id="Oval-65" cx="11" cy="8" r="3"></circle>
                        <path d="M4,18 L0,23 L22,23 L18,18" id="Path-622" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                </g>
            </svg>
        );
    }
}

export default LocationIcon;
