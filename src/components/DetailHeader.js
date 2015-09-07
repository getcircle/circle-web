import React, { PropTypes } from 'react';

import {
    backgroundImage,
} from '../constants/styles';

import Blur from './Blur';
import CSSComponent from './CSSComponent';


class DetailHeader extends CSSComponent {

    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element),
        img: PropTypes.string,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: 'rgba(51, 51, 51, 0.8)',
                    height: 320,
                    position: 'relative',
                    zIndex: 1,
                },
            },
        };
    }

    render() {
        const {
            img,
            style,
            ...other,
        } = this.props;

        // TODO: Enable after fixing cross origin issues
        let headerImage = /*img && img !== '' ? img : */ backgroundImage;
        return (
            <Blur className="detail-blur-canvas" blurRadius={50} img={headerImage}>
                <header {...other} style={{...this.styles().root, ...style}} />
            </Blur>
        );
    }

}

export default DetailHeader;
