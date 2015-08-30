import _ from 'lodash';
import React, { PropTypes } from 'react';

import resizable from '../decorators/resizable';

import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import CSSComponent from './CSSComponent';

@resizable
class CardColumns extends CSSComponent {

    static propTypes = {
        items: PropTypes.array.isRequired,
        itemsPerCollapsedColumn: PropTypes.number,
        itemsPerColumn: PropTypes.number,
        largerDevice: PropTypes.bool.isRequired,
        numberOfColumns: PropTypes.number,
        renderColumn: PropTypes.func.isRequired,
    }

    static defaultProps = {
        itemsPerCollapsedColumn: 3,
        itemsPerColumn: 2,
        numberOfColumns: 2,
    }

    classes() {
        return {
            default: {

            },
        };
    }

    render() {
        const {
            items,
            itemsPerCollapsedColumn,
            itemsPerColumn,
            numberOfColumns,
            renderColumn,
            ...other,
        } = this.props;

        let resolvedNumberOfColumns = this.props.largerDevice ? numberOfColumns : 1;
        let resolvedItemsPerColumn = this.props.largerDevice ? itemsPerColumn : itemsPerCollapsedColumn;
        const columns = _.range(resolvedNumberOfColumns).map((value) => {
            return items.slice(value * resolvedItemsPerColumn, (value + 1) * resolvedItemsPerColumn);
        });
        const elements = columns.map((column, index) => {
            if (column.length) {
                let rendered = [];
                if (index !== 0 ) {
                    rendered.push(<CardVerticalDivider key={`divider-${index}`}/>);
                }
                const element = this.props.renderColumn(column, index);
                rendered.push(React.cloneElement(element, {key: `column-${index}`}));
                return rendered;
            }
        });
        return (
            <CardRow>
                {elements}
            </CardRow>
        );
    }

}

export default CardColumns;
