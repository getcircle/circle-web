import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

export default class MoreMenu extends Component {

    static propTypes = {
        children: PropTypes.node,
        hover: PropTypes.bool,
    }

    state = {
        open: false,
    }

    handleRequestChange = (open) => {
        this.setState({open: open});
    }

    render() {
        const { children, hover } = this.props;
        const { open } = this.state;
        const styles = {
            root: {
                position: 'absolute',
                right: 5,
                top: 16,
            },
            menu: {},
        };
        if (!hover && !open) {
            styles.root.display = 'none';
            styles.menu.display = 'none';
        }
        return (
            <IconMenu
                anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                menuStyle={styles.menu}
                onRequestChange={this.handleRequestChange}
                open={this.state.open}
                style={styles.root}
                targetOrigin={{horizontal: 'middle', vertical: 'top'}}
            >
                {children}
            </IconMenu>
        );
    }
}
