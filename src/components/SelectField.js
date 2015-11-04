import React, { PropTypes } from 'react';
import mui from 'material-ui';
import Infinite from 'react-infinite';

import { tintColor, iconColors } from '../constants/styles';

import CSSComponent from './CSSComponent';
import DownArrowIcon from './DownArrowIcon';
import IconContainer from './IconContainer';
import SearchIcon from './SearchIcon';

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
        searchIconStyle: PropTypes.object,
        searchInputName: PropTypes.string,
        searchInputPlaceholder: PropTypes.string,
        searchInputStyle: PropTypes.object,
        value: PropTypes.string,
    }

    static defaultProps = {
        onBlur: () => {},
        onInputChange: () => {},
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

    ignoreBlur = false

    setIgnoreBlur(ignoreBlur) {
        this.ignoreBlur = ignoreBlur;
    }

    classes() {
        return {
            'default': {
                loadingIndicatorContainer: {
                    justifyContent: 'center',
                },
                SearchIcon: {
                    style: {
                        ...this.props.searchIconStyle
                    },
                    strokeWidth: '3px',
                    ...iconColors.medium,
                }
            }
        }
    }

    handleChange(event) {
        // Reset scroll position of the list when search query changes
        this.refs.list.getDOMNode().scrollTop = 0;
        this.props.onInputChange(event);
    }

    handleFocus() {
        this.setState({focused: true});
        this.setIgnoreBlur(true);
    }

    handleBlur(event) {
        if (this.ignoreBlur) {
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
                <div className="row center-xs">
                    <div className="col-xs">
                        <div
                            className="box"
                            is="loadingIndicatorContainer"
                            key="loading-indicator"
                        >
                            <CircularProgress mode="indeterminate" size={0.5} />
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderResult(item, index) {
        return (
            <ListItem
                {...item}
                innerDivStyle={{...this.props.listItemInnerDivStyle}}
                key={index}
                name="listItem"
                onMouseEnter={() => this.setIgnoreBlur(true)}
                onTouchTap={this.handleItemTapped.bind(this, item, index)}
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
                onBlur={::this.handleBlur}
                style={{...this.props.listStyle}}
            >
                <SearchIcon is="SearchIcon" />
                <input
                    name={this.props.searchInputName}
                    onChange={::this.handleChange}
                    placeholder={this.props.searchInputPlaceholder}
                    ref="searchInput"
                    style={this.props.searchInputStyle}
                />
                <Infinite
                    containerHeight={containerHeight}
                    elementHeight={elementHeights}
                    loadingSpinnerDelegate={::this.renderLoadingIndicator()}
                    ref="list"
                    {...this.props}
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
                onFocus={::this.handleFocus}
                onMouseEnter={() => this.setIgnoreBlur(true)}
                onMouseLeave={() => this.setIgnoreBlur(false)}
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
