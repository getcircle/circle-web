import React, { PropTypes } from 'react';

import PureComponent from './PureComponent';

class OfficeIcon extends PureComponent {

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
            <svg {...other} width="40px" height="40px" viewBox="0 0 40 40">
                <title>Rectangle 430 Copy 8</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <g id="Group" transform="translate(11.000000, 9.000000)">
                        <rect id="Rectangle-621-Copy" stroke={stroke} strokeWidth="2" x="11" y="6" width="7" height="16" rx="1"></rect>
                        <rect id="Rectangle-26-Copy-33" fill={stroke} x="5" y="3" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-31" fill={stroke} x="3" y="3" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-34" fill={stroke} x="5" y="5" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-32" fill={stroke} x="3" y="5" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-37" fill={stroke} x="5" y="7" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-36" fill={stroke} x="3" y="7" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-40" fill={stroke} x="5" y="9" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-39" fill={stroke} x="3" y="9" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-43" fill={stroke} x="5" y="11" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-42" fill={stroke} x="3" y="11" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-45" fill={stroke} x="5" y="13" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-44" fill={stroke} x="3" y="13" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-47" fill={stroke} x="5" y="15" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-54" fill={stroke} x="7" y="3" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-48" fill={stroke} x="7" y="5" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-49" fill={stroke} x="7" y="7" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-50" fill={stroke} x="7" y="9" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-51" fill={stroke} x="7" y="11" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-52" fill={stroke} x="7" y="13" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-53" fill={stroke} x="7" y="15" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-46" fill={stroke} x="3" y="15" width="1" height="1"></rect>
                        <rect id="Rectangle-621-Copy-2" stroke={stroke} strokeWidth="2" x="0" y="0" width="11" height="22" rx="1"></rect>
                        <rect id="Rectangle-26-Copy-41" fill={stroke} x="13" y="9" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-58" fill={stroke} x="13" y="11" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-59" fill={stroke} x="13" y="13" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-60" fill={stroke} x="13" y="15" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-66" fill={stroke} x="15" y="9" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-62" fill={stroke} x="15" y="11" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-63" fill={stroke} x="15" y="13" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-64" fill={stroke} x="15" y="15" width="1" height="1"></rect>
                        <rect id="Rectangle-26-Copy-6" stroke={stroke} x="4" y="18" width="3" height="4"></rect>
                    </g>
                </g>
            </svg>
        );
    }
}

export default OfficeIcon;
