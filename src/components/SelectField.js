import React, { PropTypes } from 'react';
import mui from 'material-ui';
import Infinite from 'react-infinite';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';

const {
    ListItem,
    ListDivider,
    Paper,
} = mui;

class SelectField extends CSSComponent {

    static propTypes = {
        inputName: PropTypes.string,
        inputStyle: PropTypes.object,
        items: PropTypes.array,
        onBlur: PropTypes.func,
        onInputChange: PropTypes.func,
        value: PropTypes.string,
    }

    state = {
        focused: false,
    }

    componentDidUpdate() {
        let searchInput = React.findDOMNode(this.refs.searchInput);
        if (!!searchInput) {
            searchInput.focus();
        }
    }

    classes() {
        return {
            'default': {
                container: {
                    width: '100%',
                },
                resultsList: {
                    borderRadius: '0px 0px 3px 3px',
                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.09)',
                    justifyContent: 'flex-start',
                    textAlign: 'start',
                    height: 'auto',
                    width: 'calc(100% - 32px)',
                    position: 'absolute',
                    'margin-top': '-1px',
                },
                ListItem: {
                    style: {
                        textAlign: 'left',
                    },
                },
                ListDivider: {
                    style: {
                        backgroundColor: 'rgba(0, 0, 0, .05)',
                    },
                }
            }
        }
    }

    handleFocus() {
        this.setState({focused: true});
    }

    handleBlur(event) {
        let relatedTarget = event.relatedTarget;
        if (!!relatedTarget && relatedTarget.name === 'ListItem') {
            event.preventDefault();
        }
        else {
            this.setState({focused: false});
            
            this.props.onBlur();
        }
    }

    handleItemTapped(item, index) {
        item.onTouchTap();

        this.setState({focused: false});

        this.props.onBlur();
    }

    renderResult(item, index) {
        return (
            <ListItem
                is="ListItem"
                key={index}
                name="ListItem"
                onTouchTap={this.handleItemTapped.bind(this, item, index)}
                primaryText={item.primaryText}
            />
        );
    }

    renderItemInMenu(item, index) {
        let element;
        if (index !== 0) {
            element = (
                <div>
                    <ListDivider is="ListDivider" />
                    {this.renderResult(item)}
                </div>
            );
        } else {
            element = this.renderResult(item);
        }

        return element;
    }

    renderMenu() {
        let containerHeight = 0;
        const elementHeights = [];
        const elements = this.props.items.map((item, index) => {
            let height = 50;
            containerHeight += height;
            elementHeights.push(height);
            return this.renderItemInMenu(item, index);
        });

        containerHeight = Math.min(containerHeight, 150);

        return (
            <Paper
                style={{
                    ...this.styles().resultsList
                }}
            >
                <input
                    name={this.props.inputName}
                    onChange={this.props.onInputChange}
                    placeholder={t('Search')}
                    ref="searchInput"
                    style={this.props.inputStyle}
                />
                <Infinite
                    containerHeight={containerHeight}
                    elementHeight={elementHeights}
                >
                    {elements}
                </Infinite>
            </Paper>
        );
    }

    render() {
        let menu;
        if (this.state.focused) {
            menu = this.renderMenu();
        }

        return (
            <div is="container"
                onBlur={::this.handleBlur}
                onFocus={::this.handleFocus}
            >
                <input
                    readOnly={true}
                    style={this.props.inputStyle}
                    value={this.props.value}
                />
                {menu}
            </div>
        );
    }
}

export default SelectField;
