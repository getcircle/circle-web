import React from 'react';

import PureComponent from './PureComponent';

class DownArrowIcon extends PureComponent {

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
            <svg {...other} width="14px" height="8px" viewBox="0 0 14 8" version="1.1">
                <title>Rectangle 121 Copy</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="v1-Final" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="search-began" transform="translate(-1244.000000, -36.000000)" stroke={stroke} stroke-width="2">
                        <g id="Paula-+-PAULA-MARKEY-LG-A-Copy-2-+-Rectangle-121-Copy" transform="translate(1145.000000, 22.000000)">
                            <path d="M110,19 L102,19 L102,11" id="Rectangle-121-Copy" transform="translate(106.000000, 15.000000) rotate(-45.000000) translate(-106.000000, -15.000000) "></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export default DownArrowIcon;
