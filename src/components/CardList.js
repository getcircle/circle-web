import mui from 'material-ui';
import React from 'react';

import StyleableComponent from './StyleableComponent';

const { List } = mui;

const styles = {
    root: {
        paddingTop: 0,
        paddingBottom: 0,
    },
}

class CardList extends StyleableComponent {

    render() {
        const {
            style,
            ...other,
        } = this.props;
        return (
            <List
                {...other}
                className="col-xs"
                style={this.mergeAndPrefix(styles.root, style)}
            >
                {this.props.children}
            </List>
        );
    }

}

export default CardList;
