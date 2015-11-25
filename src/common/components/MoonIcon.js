import React from 'react';

import PureComponent from './PureComponent';

class MoonIcon extends PureComponent {

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
            <svg width="28px" height="28px" viewBox="0 0 28 28">
                <defs></defs>
                <g id="Feedback-Incorporated---AW-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="icons" transform="translate(-481.000000, -870.000000)">
                        <rect id="Rectangle-1587-Copy-2" opacity="0" fill="#2A2A2A" x="-1" y="781" width="1123" height="766"></rect>
                        <path d="M500.562347,887.800963 C500.131149,888.305223 499.60832,888.745998 499.001002,889.096634 C496.131246,890.753488 492.461704,889.770237 490.804849,886.900481 C489.147995,884.030726 490.131246,880.361183 493.001002,878.704329 C493.60832,878.353694 494.251458,878.121298 494.903758,878 C493.297422,879.878514 492.962732,882.638044 494.268951,884.900481 C495.57517,887.162919 498.132338,888.252834 500.562347,887.800963 Z" id="moon" opacity="0.8" fill={stroke}></path>
                    </g>
                </g>
            </svg>
        );
    }
}

export default MoonIcon;
