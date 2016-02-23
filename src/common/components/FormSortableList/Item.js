// Based on https://github.com/gaearon/react-dnd/blob/306ae30789dc7774dfc3b58436d4e8b87d77f629/examples/04%20Sortable/Simple/Card.js

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import Colors from '../../styles/Colors';
import UpDownIcon from '../UpDownIcon';

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

    state = {
        hover: false,
    }

    handleMouseEnter = () => {
        this.setState({hover: true});
    }

    handleMouseLeave = () => {
        this.setState({hover: false});
    }

    render() {
        const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
        const { hover } = this.state;
        const styles = {
            root: {
                backgroundColor: hover ? Colors.white : Colors.offWhite,
                border: `1px solid ${Colors.minBlack}`,
                cursor: 'move; cursor: grab; cursor: -moz-grab; cursor: -webkit-grab',
                fontSize: '1.4rem',
                fontWeight: hover ? 'bold' : 'normal',
                marginBottom: -1,
                opacity: isDragging ? 0 : 1,
                padding: '6px 10px 6px 3px',
                position: 'relative',
                textAlign: 'left',
            },
            icon: {
                display: 'inline-block',
                marginLeft: 1,
                marginTop: -10,
                position: 'absolute',
                top: '50%',
                width: 20,
            },
            text: {
                display: 'inline-block',
                marginBottom: 7,
                marginLeft: 25,
                marginTop: 7,
                maxWidth: 500,
                verticalAlign: 'top',
            },
        };

        return connectDragSource(connectDropTarget(
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={styles.root}
            >
                <UpDownIcon height={20} style={styles.icon} width={20} />
                <span style={styles.text}>
                    {text}
                </span>
            </div>
        ));
    }
}
