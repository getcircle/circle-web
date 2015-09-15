import React, { PropTypes } from 'react';

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
                    backgroundColor: 'rgb(51, 51, 51)',
                    height: 320,
                    position: 'relative',
                    zIndex: 1,
                },
            },
            withImageSet: {
                root: {
                    backgroundColor: 'rgba(51, 51, 51, 0.8)',
                },
            },
        };
    }

    styles() {
        return this.css({
          'withImageSet': this.props.img && this.props.img !== '',
        });
    }

    render() {
        const {
            img,
            style,
            ...other,
        } = this.props;

        let headerImage = img && img !== '' ? img : '';
        if (headerImage) {
            return (
                <Blur blurRadius={50} className="detail-blur-canvas" img={headerImage}>
                    <header {...other} style={{...this.styles().root, ...style}} />
                </Blur>
            );
        } else {
            return (
                <header {...other} style={{...this.styles().root, ...style}} />
            );
        }
    }

}

export default DetailHeader;
