import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Dialog from './Dialog';
import CSSComponent from './CSSComponent';
import Search from './Search';

import { SEARCH_LOCATION } from '../constants/trackerProperties';

// Spec:

// [x] taking an array of objects and displays them in a modal
// [x] has a filter box at the top for filtering the content
    // [ ] needs to take CategoryV1, AttributeV1 and the attribute value so we can filter the searchk
// [x] exposes a "show" and "dismiss" dialog

class DetailViewAll extends CSSComponent {

    static propTypes = {
        filterPlaceholder: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.oneOf(
            services.profile.containers.ProfileV1,
            services.organization.containers.TeamV1,
        )),
        itemsLoadMore: PropTypes.func,
        largerDevice: PropTypes.object.isRequired,
        pageType: PropTypes.string.isRequired,
        searchAttribute: PropTypes.instanceOf(services.search.containers.search.AttributeV1),
        searchAttributeValue: PropTypes.string,
        searchCategory: PropTypes.instanceOf(services.search.containers.search.CategoryV1),
        title: PropTypes.string.isRequired,
    }

    shouldHideFilterInput() {
        return this.props.items ? this.props.items.length < 10 : false;
    }

    styles() {
        return this.css({
            hideFilterInput: this.shouldHideFilterInput(),
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
            'largerDevice-false': {
                Search: {
                    resultsHeight: document.body.offsetHeight - 137,
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
            largerDevice,
            pageType,
            title,
            searchAttribute,
            searchAttributeValue,
            searchCategory,
        } = this.props;
        return (
            <div >
                <Dialog
                    is="Dialog"
                    largerDevice={largerDevice}
                    pageType={pageType}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={title}
                >
                    <div className="row center-xs" is="searchContainer">
                        <Search
                            alwaysActive={!this.shouldHideFilterInput()}
                            canExplore={false}
                            defaults={items}
                            defaultsLoadMore={itemsLoadMore}
                            focused={true}
                            is="Search"
                            onSelectItem={() => this.refs.modal.dismiss()}
                            placeholder={filterPlaceholder}
                            searchAttribute={searchAttribute}
                            searchAttributeValue={searchAttributeValue}
                            searchCategory={searchCategory}
                            searchLocation={SEARCH_LOCATION.MODAL}
                        />
                    </div>
                </Dialog>
            </div>
        );
    }

}

export default DetailViewAll;
