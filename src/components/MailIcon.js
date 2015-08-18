import React, { Component } from 'react';
import mui from 'material-ui';

class MailIcon extends Component {

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
                <title>Rectangle 430 Copy 9</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect id="Rectangle-430-Copy-9" x="0" y="0" width="40" height="40"></rect>
                    <g id="maili-copy-2" transform="translate(9.000000, 12.000000)" stroke={stroke} strokeWidth="2">
                        <rect id="Rectangle-429" x="0" y="0" width="22" height="16" rx="1.6"></rect>
                        <path d="M21,1 L11,9 L1,1" id="Rectangle-430" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                </g>
            </svg>
        );
    }
}

export default MailIcon;
