import React from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    root: {
        backgroundImage: 'linear-gradient(160deg,#4280c5 30%,#59f0ff 120%)',
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
