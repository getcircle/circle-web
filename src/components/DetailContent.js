import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class DetailContent extends CSSComponent {

    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element),
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: 'rgb(247, 249, 250)',
                    boxSizing: 'border-box',
                    paddingTop: 40,
                    maxWidth: 800,
                    margin: '0px auto',
                    paddingRight: 10,
                    paddingLeft: 10,
                },
            },
        };
    }

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <section {...other} className="wrap" style={{...this.styles().root, ...style}}>
                {this.props.children}
            </section>
        );
    }

}

export default DetailContent;
