import _ from 'lodash';
import React, { PropTypes } from 'react';

import CardRow from './CardRow';
import CardVerticalDivider from './CardVerticalDivider';
import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';

class CardColumns extends CSSComponent {

    static propTypes = {
        items: PropTypes.array.isRequired,
        itemsPerCollapsedColumn: PropTypes.number,
        itemsPerColumn: PropTypes.number,
        numberOfColumns: PropTypes.number,
        renderColumn: PropTypes.func.isRequired,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    static defaultProps = {
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

        let perCollapsedColumn = itemsPerCollapsedColumn;
        if (perCollapsedColumn === undefined || perCollapsedColumn === null) {
            perCollapsedColumn = itemsPerColumn + 1;
        }

        const largerDevice = this.context.device;
        const resolvedNumberOfColumns = largerDevice ? numberOfColumns : 1;
        const resolvedItemsPerColumn = largerDevice ? itemsPerColumn : perCollapsedColumn;
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
