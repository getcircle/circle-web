import React from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    root: {
        paddingTop: 40,
        boxSizing: 'border-box',
        maxWidth: 800,
        margin: '0px auto',
        backgroundColor: 'rgba(247, 249, 250)',
    },
};

class DetailContent extends StyleableComponent {

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <section {...other} className="wrap" style={this.mergeAndPrefix(styles.root, style)} >
                {this.props.children}
            </section>
        );
    }

}

export default DetailContent;
