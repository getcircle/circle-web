import React from 'react';

import StyleableComponent from './StyleableComponent';

const styles = {
    root: {
        width: '100%',
    },
}

class CardRow extends StyleableComponent {

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <div
                {...other}
                className="row"
                style={this.mergeAndPrefix(styles.root, style)}
            >
                {this.props.children}
            </div>
        );
    }

}

export default CardRow;