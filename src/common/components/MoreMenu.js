import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import MoreIcon from './MoreIcon';

export default class MoreMenu extends Component {

    static propTypes = {
        children: PropTypes.node,
        hover: PropTypes.bool,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    }

    state = {
        open: false,
    }

    handleRequestChange = (open) => {
        this.setState({open: open});
    }

    render() {
        const { children, hover } = this.props;
        const { tintColor } = this.context.muiTheme.luno;
        const { open } = this.state;
        const styles = {
            button: {
                left: 6,
                position: 'absolute',
                top: 6,
            },
            circle: {
                border: `2px solid ${tintColor}`,
                borderRadius: '50%',
                left: 12,
                height: 24,
                position: 'absolute',
                top: 12,
                width: 24,
            },
            menu: {},
            root: {
                position: 'absolute',
                right: 18,
                top: 15,
            },
        };
        if (!hover && !open) {
            styles.root.display = 'none';
            styles.menu.display = 'none';
        }
        const button = (
            <IconButton>
                <MoreIcon
                    height={36}
                    stroke={tintColor}
                    style={styles.button}
                    width={36}
                />
                <div style={styles.circle} />
            </IconButton>
        );
        return (
            <IconMenu
                anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                iconButtonElement={button}
                iconStyle={styles.icon}
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
