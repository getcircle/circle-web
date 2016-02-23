// Base on https://github.com/gaearon/react-dnd/blob/306ae30789dc7774dfc3b58436d4e8b87d77f629/examples/04%20Sortable/Simple/Card.js

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import Colors from '../../styles/Colors';

const ITEM_TYPE = 'ITEM'

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const itemTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    }
};

@DropTarget(ITEM_TYPE, itemTarget, connect => ({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(ITEM_TYPE, itemSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))
export default class Item extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        id: PropTypes.any.isRequired,
        index: PropTypes.number.isRequired,
        isDragging: PropTypes.bool.isRequired,
        moveItem: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
    };

    render() {
        const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        const opacity = isDragging ? 0 : 1;
        const styles = {
            root: {
                backgroundColor: Colors.offWhite,
                borderBottom: `1px solid ${Colors.minBlack}`,
                cursor: 'move',
                fontSize: '1.4rem',
                padding: '13px 15px',
                textAlign: 'left',
            },
        };

        return connectDragSource(connectDropTarget(
            <div style={{ ...styles.root, opacity }}>
                {text}
            </div>
        ));
    }
}
