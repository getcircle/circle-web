import React from 'react';

import PureComponent from './PureComponent';

class LogoutIcon extends PureComponent {

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
            <svg {...other} width="28px" height="28px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs></defs>
                <g id="Feedback-Incorporated---AW-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="icons" transform="translate(-446.000000, -994.000000)">
                        <rect id="Rectangle-1587-Copy-2" opacity="0" fill="#2A2A2A" x="-1" y="781" width="1123" height="766"></rect>
                        <g id="logout" transform="translate(452.000000, 999.000000)" fill={stroke}>
                            <g id="Group">
                                <path d="M11.25,18 L0.75,18 C0.3,18 0,17.7 0,17.25 L0,0.75 C0,0.3 0.3,0 0.75,0 L11.25,0 C11.7,0 12,0.3 12,0.75 L12,6 C12,6.45 11.7,6.75 11.25,6.75 C10.8,6.75 10.5,6.45 10.5,6 L10.5,1.5 L1.5,1.5 L1.5,16.5 L10.5,16.5 L10.5,12 C10.5,11.55 10.8,11.25 11.25,11.25 C11.7,11.25 12,11.55 12,12 L12,17.25 C12,17.7 11.7,18 11.25,18 L11.25,18 Z" id="Shape"></path>
                                <path d="M17.25,9.75 L6,9.75 C5.55,9.75 5.25,9.45 5.25,9 C5.25,8.55 5.55,8.25 6,8.25 L17.25,8.25 C17.7,8.25 18,8.55 18,9 C18,9.45 17.7,9.75 17.25,9.75 L17.25,9.75 Z" id="Shape"></path>
                                <path d="M17.25,9.75 C17.025,9.75 16.875,9.675 16.725,9.525 L13.725,6.525 C13.425,6.225 13.425,5.775 13.725,5.475 C14.025,5.175 14.475,5.175 14.775,5.475 L17.775,8.475 C18.075,8.775 18.075,9.225 17.775,9.525 C17.625,9.675 17.475,9.75 17.25,9.75 L17.25,9.75 Z" id="Shape"></path>
                                <path d="M14.25,12.75 C14.025,12.75 13.875,12.675 13.725,12.525 C13.425,12.225 13.425,11.775 13.725,11.475 L16.725,8.475 C17.025,8.175 17.475,8.175 17.775,8.475 C18.075,8.775 18.075,9.225 17.775,9.525 L14.775,12.525 C14.625,12.675 14.475,12.75 14.25,12.75 L14.25,12.75 Z" id="Shape"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export default LogoutIcon;
