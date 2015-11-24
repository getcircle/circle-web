import React from 'react';

import PureComponent from './PureComponent';

class EditProfileCameraIcon extends PureComponent {

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
            <svg {...other} width="50px" height="50px" viewBox="0 0 50 50">
                <g id="Feedback-Incorporated---AW-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="icons" transform="translate(-890.000000, -319.000000)">
                        <ellipse id="Oval-587-Copy-21" stroke={stroke} opacity="0" cx="915" cy="344" rx="25" ry="25"></ellipse>
                        <g id="Rectangle-1285-+-Rectangle-1284-+-Oval-481-Copy-2" transform="translate(905.000000, 336.000000)">
                            <rect id="Rectangle-1285" fill={stroke} x="1.61538462" y="0.619047619" width="3" height="1" rx="0.8"></rect>
                            <path d="M0,5.39955022 C0,4.07431523 1.06383079,3.04610641 2.38845354,3.08714518 C2.38845354,3.08714518 4.61725816,3.23809524 6,3 C6.28198903,3.23809524 7.17943738,0 8,0 L12,0 C12.8205315,0 13.7179581,3.23809524 14,3 C15.3827418,3.23809524 17.6115465,3.08714518 17.6115465,3.08714518 C18.9306529,3.03901623 20,4.0749046 20,5.39955022 L20,13.6004498 C20,14.9256848 18.9247131,16 17.6073982,16 L2.39260178,16 C1.0712043,16 0,14.9250954 0,13.6004498 L0,5.39955022 Z" id="Rectangle-1284" stroke={stroke}></path>
                            <ellipse id="Oval-481" stroke={stroke} cx="10" cy="9" rx="5" ry="5"></ellipse>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export default EditProfileCameraIcon;
