import React, { PropTypes } from 'react';

import StyleableComponent from './StyleableComponent';

class TimeIcon extends StyleableComponent {

    static propTypes = {
        stroke: PropTypes.string,
    }

    static defaultProps = {
        stroke: '#000000',
    }

    render() {
        const {
            stroke,
            ...other
        } = this.props;
        return (
            <svg {...other} width="40px" height="40px" viewBox="0 0 40 40">
                <title>Rectangle 430 Copy 6</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle-430-Copy-6" x="0" y="0" width="40" height="40"></rect>
                    <g id="Path-624-Copy-3-+-Path-624-Copy-4-+-Oval-68" transform="translate(9.000000, 9.000000)" stroke={stroke} strokeWidth="2">
                        <path d="M11,11 L15,15" id="Path-624-Copy-3" strokeLinecap="round" ></path>
                        <path d="M11,5 L11,11" id="Path-624-Copy-4" strokeLinecap="round"></path>
                        <circle id="Oval-68" cx="11" cy="11" r="11"></circle>
                    </g>
                </g>
            </svg>
        )
    }
}

export default TimeIcon;
