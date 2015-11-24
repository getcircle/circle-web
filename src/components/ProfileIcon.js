import React from 'react';

import PureComponent from './PureComponent';

class ProfileIcon extends PureComponent {

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
            <svg {...other} width="28px" height="28px" viewBox="0 0 28 28">
                <defs></defs>
                <g id="Feedback-Incorporated---AW-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="icons" transform="translate(-446.000000, -918.000000)">
                        <g id="Oval-66-Copy-2-+-Oval-66-Copy-3" transform="translate(452.000000, 924.000000)" stroke={stroke} strokeWidth="2">
                            <ellipse id="Oval-66-Copy-2" cx="8" cy="4.8" rx="4.8" ry="4.8"></ellipse>
                            <path d="M5.19300822,7.10882361 C2.15934735,8.20567163 0,11.0289075 0,14.3387325 C0,17.498854 16,17.498854 16,14.3387325 C16,11.0363092 13.8502996,8.21830102 10.8273308,7.116208" id="Oval-66-Copy-3"></path>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export default ProfileIcon;
