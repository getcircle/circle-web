// Based on https://github.com/gaearon/react-dnd/blob/f37dc947f085baa4a2eec0bd64d27b47eac4d126/examples/04%20Sortable/Simple/Container.js

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';

import Item from './Item';

class FormSortableList extends Component {

    moveItem = (dragIndex, hoverIndex) => {
        const { onChange, value } = this.props;
        const dragItem = value[dragIndex];
        const newValue = update(value, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragItem]
            ]
        });

        onChange(newValue);
    }

    render() {
        const { MenuComponent, onMenuChoice, value } = this.props;
        if (!value) {
            return <span />;
        }

        return (
            <div>
                {value.map((item, i) => {
                    return (
                        <Item
                            MenuComponent={MenuComponent}
                            id={item.id}
                            index={i}
                            item={item}
                            key={item.id}
                            moveItem={this.moveItem}
                            onMenuChoice={onMenuChoice}
                            text={item.text}
                        />
                    );
                })}
            </div>
        );
    }
};

FormSortableList.propTypes = {
    MenuComponent: PropTypes.func,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onMenuChoice: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.node,
        text: PropTypes.string,
    })),
};

FormSortableList.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DragDropContext(HTML5Backend)(FormSortableList)
