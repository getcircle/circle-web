import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';

class Container extends CSSComponent {

    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.element),
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
            <section {...other} is="root">
                {this.props.children}
            </section>
        );
    }

}

export default Container;
