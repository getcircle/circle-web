import React, { PropTypes } from 'react';
import mui from 'material-ui';

import { fontColors, fontWeights } from '../constants/styles';
import CSSComponent from './CSSComponent';

const {
    ListDivider,
    List,
    ListItem,
} = mui;

class QuickSearchList extends CSSComponent {

    static propTypes = {
        highlightedIndex: PropTypes.number,
        itemStyle: PropTypes.object,
        items: PropTypes.array,
        style: PropTypes.object,
        title: PropTypes.string,
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
                    {...item}
                    style={{...this.props.itemStyle, ...style}}
                />
                <ListDivider />
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
                <List
                    style={style}
                >
                    {renderedItems}
                </List>
            </div>
        );
    }
}

export default QuickSearchList;
