import React from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    root: {
        backgroundColor: '#333',
        height: 320,
    },
};

class DetailHeader extends StyleableComponent {

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <header {...other} style={this.mergeAndPrefix(styles.root, style)} >
                {this.props.children}
            </header>
        );
    }

}

export default DetailHeader;
