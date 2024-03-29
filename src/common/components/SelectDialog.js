import React, { PropTypes } from 'react';
import mui from 'material-ui';
import Infinite from 'react-infinite';

import { iconColors } from '../constants/styles';

import CSSComponent from './CSSComponent';
import Dialog from './Dialog';
import InternalPropTypes from './InternalPropTypes';
import SearchIcon from './SearchIcon';

const {
    CircularProgress,
    ListItem,
    ListDivider,
    Paper,
} = mui;

class SelectDialog extends CSSComponent {

    static propTypes = {
        infiniteLoadBeginEdgeOffset: PropTypes.number,
        isInfiniteLoading: PropTypes.bool,
        items: PropTypes.object,
        listDividerStyle: PropTypes.object,
        listItemHeight: PropTypes.number,
        listItemInnerDivStyle: PropTypes.object,
        listStyle: PropTypes.object,
        maxListHeight: PropTypes.number,
        onInfiniteLoad: PropTypes.func,
        onInputChange: PropTypes.func,
        onRequestClose: PropTypes.func,
        pageType: PropTypes.string.isRequired,
        searchIconStyle: PropTypes.object,
        searchInputContainerStyle: PropTypes.object,
        searchInputPlaceholder: PropTypes.string,
        searchInputStyle: PropTypes.object,
        title: PropTypes.string.isRequired,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    static defaultProps = {
        maxListHeight: 200,
        onRequestClose: () => {},
        onInputChange: () => {},
    }

    styles() {
        return this.css({
            largerDevice: this.context.device.largerDevice,
        });
    }

    classes() {
        return {
            default: {
                root: {
                    padding: 0,
                    width: '100%',
                },
                loadingIndicatorContainer: {
                    justifyContent: 'center',
                },
                SearchIcon: {
                    strokeWidth: 3,
                    style: {
                        ...this.props.searchIconStyle
                    },
                    ...iconColors.medium,
                },
                listHeight: this.props.maxListHeight,
            },
            'largerDevice': {
                listHeight: document.body.offsetHeight - 137,
            }
        };
    }

    show() {
        this.refs.modal.show();
    }

    dismiss() {
        this.refs.modal.dismiss();
    }

    handleChange(event) {
        // Reset scroll position of the list when search query changes
        this.refs.list.getDOMNode().scrollTop = 0;
        this.props.onInputChange(event);
    }

    handleItemTapped(item, index) {
        item.onTouchTap();
        this.dismiss();
        this.props.onRequestClose();
    }

    renderResult(item, index) {
        const {
            listItemInnerDivStyle,
        } = this.props;

        return (
            <ListItem
                {...item}
                innerDivStyle={listItemInnerDivStyle}
                key={index}
                name="listItem"
                onTouchTap={this.handleItemTapped.bind(this, item, index)}
            />
        );
    }

    renderItemInMenu(item, index) {
        const {
            listDividerStyle,
        } = this.props;

        let element;
        if (index !== 0) {
            element = (
                <div>
                    <ListDivider
                        style={listDividerStyle}
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
        const {
            items,
            listItemHeight,
            listStyle,
        } = this.props;

        let height = listItemHeight;
        const elementHeights = [];
        const elements = items.map((item, index) => {
            elementHeights.push(height);
            return this.renderItemInMenu(item, index);
        });

        return (
            <Paper
                style={{...listStyle}}
            >
                <Infinite
                    containerHeight={this.styles().listHeight}
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

    renderLoadingIndicator() {
        if (this.props.isInfiniteLoading) {
            return (
                <div className="row center-xs">
                    <div className="col-xs">
                        <div
                            className="box"
                            style={this.styles().loadingIndicatorContainer}
                            key="loading-indicator"
                        >
                            <CircularProgress mode="indeterminate" size={0.5} />
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        const {
            searchInputPlaceholder,
            searchInputContainerStyle,
            searchInputStyle,
            ...other,
        } = this.props;
        const dialogProps = {...this.styles().Dialog, ...other};
        return (
            <div >
                <Dialog
                    ref="modal"
                    repositionOnUpdate={false}
                    {...dialogProps}
                >
                    <div
                        className="col-xs"
                        style={{...this.styles().root}}
                    >
                        <div
                            className="row middle-xs"
                            style={searchInputContainerStyle}
                        >
                            <SearchIcon {...this.styles().SearchIcon} />
                            <input
                                onChange={::this.handleChange}
                                placeholder={searchInputPlaceholder}
                                ref="input"
                                style={searchInputStyle}
                                type="text"
                            />
                        </div>
                    </div>
                    <div>
                        {this.renderMenu()}
                    </div>
                </Dialog>
            </div>
        );
    }

}

export default SelectDialog;
