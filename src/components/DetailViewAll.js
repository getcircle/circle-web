import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import Dialog from './Dialog';
import CSSComponent from './CSSComponent';
import Search from './SearchV2';

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
        )),
        largerDevice: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
    }

    styles() {
        return this.css({
            hideFilterInput: this.props.items ? this.props.items.length < 10 : false,
        });
    }

    classes() {
        return {
            default: {
                Search: {
                    className: 'col-xs',
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
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
                        marginTop: 10,
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
            title,
        } = this.props;
        return (
            <div >
                <Dialog
                    is="Dialog"
                    ref="modal"
                    repositionOnUpdate={false}
                    title={title}
                >
                    <div className="row center-xs" is="searchContainer">
                        <Search
                            canExplore={false}
                            defaults={items}
                            focused={true}
                            is="Search"
                            placeholder={filterPlaceholder}
                        />
                    </div>
                </Dialog>
            </div>
        );
    }

}

export default DetailViewAll;
