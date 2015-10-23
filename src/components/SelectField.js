import React, { PropTypes } from 'react';
import mui from 'material-ui';
import Infinite from 'react-infinite';

import t from '../utils/gettext';
import { tintColor } from '../constants/styles';

import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';

const {
    CircularProgress,
    ListItem,
    ListDivider,
    Paper,
} = mui;

class SelectField extends CSSComponent {

    static propTypes = {
        arrowIconContainerStyle: PropTypes.object,
        arrowIconStyle: PropTypes.object,
        infiniteLoadBeginBottomOffset: PropTypes.number,
        inputName: PropTypes.string,
        inputStyle: PropTypes.object,
        isInfiniteLoading: PropTypes.bool,
        items: PropTypes.array,
        listDividerStyle: PropTypes.object,
        listItemHeight: PropTypes.number,
        listItemInnerDivStyle: PropTypes.object,
        listItemPrimaryTextStyle: PropTypes.object,
        listStyle: PropTypes.object,
        maxListHeight: PropTypes.number,
        onBlur: PropTypes.func,
        onInfiniteLoad: PropTypes.func,
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
                loadingIndicatorContainer: {
                    display: 'flex',
                    justifyContent: 'center',
                },
            }
        }
    }

    handleChange(event) {
        this.refs.list.getDOMNode().scrollTop = 0;

        this.props.onInputChange(event);
    }

    handleFocus() {
        this.setState({focused: true});
    }

    handleBlur(event) {
        let relatedTarget = event.relatedTarget;
        if (!!relatedTarget && relatedTarget.name === 'listItem') {
            event.preventDefault();
        } else {
            this.setState({focused: false});

            this.props.onBlur();
        }
    }

    handleItemTapped(item, index) {
        item.onTouchTap();

        this.setState({focused: false});

        this.props.onBlur();
    }

    renderLoadingIndicator() {
        if (this.props.isInfiniteLoading) {
            return (
                <div
                    is="loadingIndicatorContainer"
                    key="loading-indicator"
                >
                    <CircularProgress mode="indeterminate" size={0.5} />
                </div>
            );
        }
    }

    renderResult(item, index) {
        return (
            <ListItem
                innerDivStyle={{...this.props.listItemInnerDivStyle}}
                key={index}
                name="listItem"
                onTouchTap={this.handleItemTapped.bind(this, item, index)}
                primaryText={item.primaryText}
                primaryTextStyle={{...this.props.listItemPrimaryTextStyle}}
            />
        );
    }

    renderItemInMenu(item, index) {
        let element;
        if (index !== 0) {
            element = (
                <div>
                    <ListDivider
                        style={{...this.props.listDividerStyle}}
                    />
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
        let height = this.props.listItemHeight;
        const elementHeights = [];
        const elements = this.props.items.map((item, index) => {
            containerHeight += height;
            elementHeights.push(height);
            return this.renderItemInMenu(item, index);
        });

        containerHeight = Math.min(containerHeight, this.props.maxListHeight);

        return (
            <Paper
                style={{...this.props.listStyle}}
            >
                <input
                    name={this.props.inputName}
                    onChange={::this.handleChange}
                    placeholder={t('Search')}
                    ref="searchInput"
                    style={this.props.inputStyle}
                />
                <Infinite
                    containerHeight={containerHeight}
                    elementHeight={elementHeights}
                    infiniteLoadBeginBottomOffset={this.props.infiniteLoadBeginBottomOffset}
                    isInfiniteLoading={this.props.isInfiniteLoading}
                    loadingSpinnerDelegate={::this.renderLoadingIndicator()}
                    onInfiniteLoad={this.props.onInfiniteLoad}
                    ref="list"
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
            <div
                onBlur={::this.handleBlur}
                onFocus={::this.handleFocus}
            >
                <input
                    readOnly={true}
                    style={this.props.inputStyle}
                    value={this.props.value}
                />
                <IconContainer
                    IconClass={DownArrowIcon}
                    iconStyle={{...this.props.arrowIconStyle}}
                    stroke={tintColor}
                    style={{...this.props.arrowIconContainerStyle}}
                />
                {menu}
            </div>
        );
    }
}

export default SelectField;
