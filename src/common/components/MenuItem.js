import React, { Component, PropTypes } from 'react';
import { MenuItem as MaterialMenuItem } from 'material-ui';

class MenuItem extends Component {

    render() {
        const { onTouchTap, text } = this.props;
        const styles = {
            innerDiv: {
                fontSize: '1.4rem',
                paddingLeft: 20,
                paddingRight: 20,
            },
            root: {
                lineHeight: '30px',
            },
        };
        return (
            <MaterialMenuItem
                innerDivStyle={styles.innerDiv}
                onTouchTap={onTouchTap}
                primaryText={text}
                style={styles.root}
            />
        );
    }

};

MenuItem.propTypes = {
    onTouchTap: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
}

export default MenuItem;

