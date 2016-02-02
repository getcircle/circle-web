import React, { PropTypes } from 'react';

import { Divider, List as MaterialList, ListItem as MaterialListItem } from 'material-ui';

import { fontColors, fontWeights } from '../../constants/styles';
import CSSComponent from '../CSSComponent';

/**
 * Handles item selection logic.
 *
 * When an item is selected, we want to call the item's onTouchTap as well as
 * whatever onSelectItem handler was passed to the `List` component. `ListItem`
 * avoids creating new functions for each render per:
 *
 *   https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
 *
 * for each item.
 */
class ListItem extends CSSComponent {

    static propTypes = {
        onSelectItem: PropTypes.func,
        onTouchTap: PropTypes.func,
    }

    handleOnTouchTap = () => {
        const {
            onTouchTap,
            onSelectItem,
        } = this.props;
        if (typeof onTouchTap === 'function') {
            onTouchTap();
        }
        if (typeof onSelectItem === 'function') {
            onSelectItem();
        }
    }

    render() {
        const {
            onTouchTap,
            onSelectItem,
            ...other,
        } = this.props;
        return <MaterialListItem onTouchTap={this.handleOnTouchTap} {...other} />;
    }
}

class List extends CSSComponent {

    static propTypes = {
        highlightedIndex: PropTypes.number,
        itemStyle: PropTypes.object,
        items: PropTypes.array,
        onSelectItem: PropTypes.func,
        style: PropTypes.object,
        title: PropTypes.string,
    }

    static defaultProps = {
        onSelectItem: () => {},
    }

    shouldComponentUpdate(nextProps, nextState) {
        const differentSection = nextProps.title !== this.props.title;
        const thereAreItems = (nextProps.items !== undefined && nextProps.items !== null);
        const itemsChanged = (nextProps.items !== this.props.items);
        const highlightedItemChanged = (nextProps.highlightedIndex !== this.props.highlightedIndex);
        return (differentSection || thereAreItems) && (itemsChanged || highlightedItemChanged);
    }

    classes() {
        return {
            'default': {
                header: {
                    fontSize: '11px',
                    lineHeight: '20px',
                    paddingTop: 14,
                    paddingLeft: 20,
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    ...fontColors.extraLight,
                    ...fontWeights.semiBold,
                },
            },
        };
    };

    renderItem(item, index, highlighted) {
        let style = {};
        if (highlighted) {
            style = {
                backgroundColor: '#e6e6e6',
            };
        }
        return (
            <div
                key={`item-${index}`}
            >
                <ListItem
                    onSelectItem={this.props.onSelectItem}
                    {...item}
                    style={{...this.props.itemStyle, ...style}}
                />
                <Divider />
            </div>
        );
    }

    renderHeader() {
        if (this.props.title) {
            return (
                <div style={this.styles().header}>
                    <span>{this.props.title}</span>
                </div>
            );
        }
    }

    render() {
        const {
            highlightedIndex,
            items,
            style,
        } = this.props;

        let renderedItems = []
        if (items) {
            items.forEach((item, index) => {
                renderedItems.push(this.renderItem(item, index, index === highlightedIndex));
            });
        }

        return (
            <div>
                {this.renderHeader()}
                <MaterialList
                    style={style}
                >
                    {renderedItems}
                </MaterialList>
            </div>
        );
    }
}

export default List;
