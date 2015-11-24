import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class Container extends CSSComponent {

    static propTypes = {
        children: PropTypes.node,
        style: PropTypes.object,
    }

    classes() {
        return {
            default: {
                root: {
                    backgroundColor: '#F7F9FA',
                    minHeight: '100vh',
                    paddingBottom: 100,
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
            <section {...other} style={{...this.styles().root, ...style}}>
                {this.props.children}
            </section>
        );
    }

}

export default Container;
