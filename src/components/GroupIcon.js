import React, { Component } from 'react';

class GroupIcon extends Component {

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
                <title>Rectangle 430 Copy 2</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <g id="Group-Copy-17" transform="translate(8.000000, 11.000000)" stroke={stroke} strokeWidth="2">
                        <circle id="Oval-66-Copy-4" cx="8" cy="4" r="4"></circle>
                        <circle id="Oval-66-Copy-6" cx="18.5" cy="5.5" r="3.5"></circle>
                        <path d="M5.33333333,6 C2.15934735,7.36641593 0,10.8835072 0,17 C0,17 3.55555556,18 8,18 C12.4444444,18 16,17 16,17 C16,10.8927278 13.8502996,7.3821492 10.6666667,6" id="Oval-66-Copy-5" strokeLinejoin="round"></path>
                        <path d="M14,17 L18.5454545,17 C21.7356662,17 25,16 25,16 C25,10.9868383 22.9172123,8.64193915 21.3636364,8" id="Oval-66-Copy-7" strokeLinecap="round"></path>
                        <path d="M14,10 L16.4961509,8.33589941" id="Path-636"></path>
                    </g>
                    <g id="icon_slices" transform="translate(-1.000000, -302.000000)"></g>
                </g>
            </svg>
        );
    }
}

export default GroupIcon;
