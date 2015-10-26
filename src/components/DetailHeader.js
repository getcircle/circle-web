import React, { PropTypes } from 'react';

import Blur from './Blur';
import CSSComponent from './CSSComponent';

class DetailHeader extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        img: PropTypes.string,
        largerDevice: PropTypes.bool.isRequired,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: 'rgb(51, 51, 51)',
                    height: 320,
                    position: 'relative',
                    zIndex: 1,
                },
                nonBlurHeader: {
                    backgroundColor: 'rgb(51, 51, 51)',
                    height: 320,
                    position: 'relative',
                },
            },
        };
    }

    render() {
        const {
            img,
            largerDevice,
            style,
            ...other,
        } = this.props;

        let headerImage = img && img !== '' ? img : '';
        if (headerImage) {
            return (
                <Blur
                    blurRadius={50}
                    className={largerDevice ? 'detail-blur-canvas' : 'detail-blur-canvas-notop'}
                    img={headerImage}
                >
                    <header {...other} style={{...this.styles().root, ...style}} />
                </Blur>
            );
        } else {
            return (
                <header {...other} style={{...this.styles().nonBlurHeader, ...style}} />
            );
        }
    }

}

export default DetailHeader;
