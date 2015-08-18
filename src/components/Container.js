import React from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    root: {
        backgroundColor: '#F7F9FA',
        minHeight: '100vh',
        paddingBottom: 100,
    },
};

class Container extends StyleableComponent {

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <section {...other} style={this.mergeAndPrefix(styles.root, style)}>
                {this.props.children}
            </section>
        );
    }

}

export default Container;
