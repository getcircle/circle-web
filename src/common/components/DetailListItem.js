import React, { Component, PropTypes } from 'react';

class DetailListItem extends Component {

    state = {
        hover: false,
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.hover !== nextState.hover;
    }

    handleMouseEnter = () => {
        this.setState({hover: true});
    }

    handleMouseLeave = () => {
        this.setState({hover: false});
    }

    getItem() {}

    render() {
        const { MenuComponent, className, onMenuChoice, ...other } = this.props;
        const styles = {
            root: {
                position: 'relative',
            },
        };

        let menu;
        if (MenuComponent && !menuDisplayed) {
            menu = (
                <MenuComponent
                    hover={this.state.hover}
                    onMenuChoice={onMenuChoice}
                />
            );
        }

        const { item, menuDisplayed } = this.getItem(menu);

        let displayMenu;
        if (!menuDisplayed) {
            displayMenu = menu;
        }

        return (
            <div
                className={className}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={styles.root}
                {...other}
            >
                {item}
                {displayMenu}
            </div>
        );
    }
}

DetailListItem.propTypes = {
    MenuComponent: PropTypes.func,
    className: PropTypes.string,
    onMenuChoice: PropTypes.func,
};

export default DetailListItem;
