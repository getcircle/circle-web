import merge from 'merge';
import React, { Component, PropTypes } from 'react';

import IconMenu from './IconMenu';

export default class HoverIconMenu extends Component {

    static propTypes = {
        children: PropTypes.node,
        hover: PropTypes.bool,
        iconElement: PropTypes.object.isRequired,
        menuStyle: PropTypes.object,
        style: PropTypes.object,
    }

    state = {
        open: false,
    }

    handleRequestChange = (open) => {
        this.setState({open: open});
    }

    render() {
        const { children, hover, iconElement, menuStyle, style } = this.props;
        const { open } = this.state;
        const styles = {
            menu: {},
            root: {},
        };
        if (!hover && !open) {
            styles.root.display = 'none';
            styles.menu.display = 'none';
        }
        return (
            <IconMenu
                iconElement={iconElement}
                menuStyle={merge(styles.menu, menuStyle)}
                onRequestChange={this.handleRequestChange}
                open={open}
                style={merge(styles.root, style)}
            >
                {children}
            </IconMenu>
        );
    }
}
