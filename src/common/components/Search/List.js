import { merge } from 'lodash';
import React, { PropTypes } from 'react';

import { Divider, List as MaterialList, ListItem as MaterialListItem } from 'material-ui';

import { fontColors, fontWeights } from '../../constants/styles';
import CSSComponent from '../CSSComponent';

/**
 * Handles item selection logic.
 *
 * `ListItem` allows us to call a handler with whatever item was selected while
 * avoiding creating new functions for each render per:
 *
 *   https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
 *
 * for each item.
 */
class ListItem extends CSSComponent {

    static propTypes = {
        index: PropTypes.number,
        item: PropTypes.shape({
            item: PropTypes.object,
            type: PropTypes.string.isRequired,
            payload: PropTypes.any,
        }).isRequired,
        onSelectItem: PropTypes.func,
    }

    handleTouchTap = (event) => {
        const { index, item, onSelectItem } = this.props;
        if (typeof onSelectItem === 'function') {
            onSelectItem(item, event, index);
        }
    }

    render() {
        const { item: { item }, onSelectItem, ...other } = this.props;
        const props = merge({}, item, other);
        return <MaterialListItem onTouchTap={this.handleTouchTap} {...props} />;
    }
}

class List extends CSSComponent {

    static propTypes = {
        hasItemDivider: PropTypes.bool,
        highlightedIndex: PropTypes.number,
        itemStyle: PropTypes.object,
        items: PropTypes.array,
        onSelectItem: PropTypes.func,
        style: PropTypes.object,
        title: PropTypes.string,
    }

    static defaultProps = {
        hasItemDivider: true,
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
        const divider = this.props.hasItemDivider ? <Divider /> : null;
        return (
            <div
                key={`item-${index}`}
            >
                <ListItem
                    index={index}
                    item={item}
                    onSelectItem={this.props.onSelectItem}
                    style={{...this.props.itemStyle, ...style}}
                />
                {divider}
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
