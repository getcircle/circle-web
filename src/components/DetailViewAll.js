import mui from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { getCustomThemeManager } from '../utils/ThemeManager';
import { fontColors, fontWeights } from '../constants/styles';

import CSSComponent from './CSSComponent';
import Search from './SearchV2';

const {
    Dialog,
    FlatButton,
} = mui;

// Spec:

// [x] taking an array of objects and displays them in a modal
// [x] has a filter box at the top for filtering the content
    // [ ] needs to take CategoryV1, AttributeV1 and the attribute value so we can filter the searchk
// [x] exposes a "show" and "dismiss" dialog

const ThemeManager = getCustomThemeManager();
const common = {
    background: {
        backgroundColor: 'rgb(249, 245, 244)',
    },
};

class DetailViewAll extends CSSComponent {

    static propTypes = {
        filterPlaceholder: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.oneOf(
            services.profile.containers.ProfileV1,
        )),
        largerDevice: PropTypes.object.isRequired,
        title: PropTypes.string.isRequired,
    }

    static childContextTypes = {
        muiTheme: PropTypes.object,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.customizeTheme(nextProps);
    }

    originalDesktopKeylineIncrement = ThemeManager.getCurrentTheme().spacing.desktopKeylineIncrement

    customizeTheme(props) {
        ThemeManager.setPalette({
            canvasColor: common.background.backgroundColor,
        });
        if (!props.largerDevice) {
            ThemeManager.setSpacing({desktopKeylineIncrement: 0});
        } else {
            ThemeManager.setSpacing({desktopKeylineIncrement: this.originalDesktopKeylineIncrement});
        }
    }

    styles() {
        return this.css({
            hideFilterInput: this.props.items ? this.props.items.length < 10 : false,
        });
    }

    classes() {
        return {
            default: {
                Dialog: {
                    contentStyle: {
                        maxWidth: 480,
                    },
                    bodyStyle: {
                        padding: 10,
                    },
                },
                DialogClose: {
                    className: 'col-xs-1',
                },
                DialogCloseButton: {
                    style: {
                        minWidth: 15,
                    },
                    labelStyle: {
                        fontSize: '12px',
                        ...fontColors.light,
                        ...fontWeights.semiBold,
                    },
                },
                DialogHeader: {
                    className: 'row',
                    style: {
                        display: 'flex',
                    },
                },
                DialogTitle: {
                    className: 'col-xs-10 center-xs',
                    style: {
                        alignSelf: 'center',
                        display: 'flex',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        ...fontColors.light,
                        ...fontWeights.semiBold,
                    },
                },
                Search: {
                    className: 'col-xs',
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                    },
                    style: {
                        maxWidth: 460,
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
                Dialog: {
                    contentStyle: {
                        maxWidth: '100vw',
                        width: '100%',
                    },
                    style: {
                        paddingTop: 0,
                    },
                },
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
                >
                    <header is="DialogHeader">
                        <div is="DialogClose">
                            <FlatButton
                                is="DialogCloseButton"
                                label="x"
                                onTouchTap={() => {
                                    this.dismiss();
                                }}
                            />
                        </div>
                        <span is="DialogTitle">
                            {title}
                        </span>
                    </header>
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
