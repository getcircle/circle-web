import React from 'react';

import PureComponent from './PureComponent';

class PhoneIcon extends PureComponent {

    static propTypes = {
        stroke: React.PropTypes.string,
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
                <title>Rectangle 430 Copy 10</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle-430-Copy-10" x="0" y="0" width="40" height="40"></rect>
                    <path d="M5.73894497,23.2266512 C5.73894497,25.727922 7.47085246,25.727922 7.47085246,25.727922 L11.8006212,25.727922 C11.8006212,25.727922 13.5325283,25.727922 13.5325287,23.2266512 L13.5325287,21.5591374 L13.5325287,20.7253805 L14.3984824,20.7253805 L23.0580198,20.7253805 L23.9239736,20.7253805 L23.9239736,21.5591374 L23.9239736,23.2266512 C23.9239741,25.7330053 25.6558811,25.727922 25.6558811,25.727922 L29.9856498,25.727922 C29.9856498,25.727922 31.7175578,25.727922 31.7175573,23.2266512 C31.7175573,23.2266512 32.5739147,15.7279221 18.7186561,15.7279221 C4.86339747,15.7279221 5.73894497,23.2266512 5.73894497,23.2266512 Z" id="Path-630-Copy-4" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(18.727922, 20.727922) rotate(-135.000000) translate(-18.727922, -20.727922) "></path>
                </g>
            </svg>
        );
    }
}

export default PhoneIcon;
