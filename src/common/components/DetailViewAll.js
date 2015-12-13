import React, { PropTypes } from 'react';
import {services} from 'protobufs';

import Dialog from './Dialog';
import CSSComponent from './CSSComponent';
import InternalPropTypes from './InternalPropTypes';
import Search from './Search';

import { SEARCH_LOCATION } from '../constants/trackerProperties';

class DetailViewAll extends CSSComponent {

    static propTypes = {
        filterPlaceholder: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.oneOfType([
            services.profile.containers.ProfileV1,
            services.organization.containers.TeamV1,
        ])),
        itemsLoadMore: PropTypes.func,
        pageType: PropTypes.string.isRequired,
        searchAttribute: InternalPropTypes.SearchAttributeV1,
        searchAttributeValue: PropTypes.string,
        searchCategory: InternalPropTypes.SearchCategoryV1,
        title: PropTypes.string.isRequired,
    }

    static contextTypes = {
        device: InternalPropTypes.DeviceContext.isRequired,
    }

    shouldHideFilterInput() {
        return this.props.items ? this.props.items.length < 10 : false;
    }

    styles() {
        return this.css({
            hideFilterInput: this.shouldHideFilterInput(),
            smallDevice: !this.context.device.largerDevice,
        });
    }

    classes() {
        return {
            default: {
                Search: {
                    className: 'col-xs',
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                        width: 'initial',
                        marginRight: 10,
                        marginLeft: 10,
                        marginBottom: 10,
                    },
                    resultsListStyle: {
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                    },
                    style: {
                        paddingRight: 0,
                        paddingLeft: 0,
                    },
                },
                searchContainer: {
                    paddingTop: 10,
                },
            },
            hideFilterInput: {
                searchContainer: {
                    paddingTop: 0,
                },
                Search: {
                    inputContainerStyle: {
                        display: 'none',
                    },
                    resultsListStyle: {
                        marginTop: 0,
                    },
                },
            },
            'smallDevice': {
                Search: {
                    resultsListStyle: {
                        height: '100vh',
                        width: '100vw',
                        opacity: 1,
                        position: 'absolute',
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                        left: 0,
                    },
                }
            },
        };
    }

    // Public Methods

    show() {
        this.refs.modal.show();
    }

    dismiss() {
        this.refs.modal.dismiss();
    }

    render() {
        const {
            filterPlaceholder,
            items,
            itemsLoadMore,
            pageType,
            title,
            searchAttribute,
            searchAttributeValue,
            searchCategory,
            ...other,
        } = this.props;
        const searchProps = {...this.styles().Search, ...other};
        return (
            <div >
                <Dialog
                    pageType={pageType}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={title}
                    {...this.styles().Dialog}
                >
                    <div className="row center-xs" style={this.styles().searchContainer}>
                        <Search
                            alwaysActive={!this.shouldHideFilterInput()}
                            canExplore={false}
                            defaults={items}
                            defaultsLoadMore={itemsLoadMore}
                            focused={true}
                            onSelectItem={() => this.refs.modal.dismiss()}
                            placeholder={filterPlaceholder}
                            searchAttribute={searchAttribute}
                            searchAttributeValue={searchAttributeValue}
                            searchCategory={searchCategory}
                            searchLocation={SEARCH_LOCATION.MODAL}
                            {...searchProps}
                        />
                    </div>
                </Dialog>
            </div>
        );
    }

}

export default DetailViewAll;
