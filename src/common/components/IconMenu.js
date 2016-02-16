import { IconButton, IconMenu as MaterialIconMenu } from 'material-ui';
import merge from 'merge';
import React, { Component, PropTypes } from 'react';

export default class IconMenu extends Component {

    static propTypes = {
        children: PropTypes.node,
        hover: PropTypes.bool,
        iconElement: PropTypes.object.isRequired,
        style: PropTypes.object,
    }

    static defaultProps = {
        style: {},
    }

    state = {
        open: false,
    }

    handleRequestChange = (open) => {
        this.setState({open: open});
    }

    render() {
        const { children, hover, iconElement, style } = this.props;
        const { open } = this.state;
        const styles = {
            button: {
                left: 6,
                position: 'absolute',
                top: 6,
            },
            menu: {},
            root: {},
        };
        if (!hover && !open) {
            styles.root.display = 'none';
            styles.menu.display = 'none';
        }
        const button = <IconButton>{iconElement}</IconButton>;
        return (
            <MaterialIconMenu
                anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                iconButtonElement={button}
                menuStyle={styles.menu}
                onRequestChange={this.handleRequestChange}
                open={this.state.open}
                style={merge(styles.root, style)}
                targetOrigin={{horizontal: 'middle', vertical: 'top'}}
            >
                {children}
            </MaterialIconMenu>
        );
    }
}
