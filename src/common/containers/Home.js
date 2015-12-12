import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';

import { fontColors, fontWeights, } from '../constants/styles';
import { resetScroll } from '../utils/window';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import CSSComponent from '../components/CSSComponent';
import InternalPropTypes from '../components/InternalPropTypes';
import HeaderMenu from '../components/HeaderMenu';
import { default as SearchComponent, SEARCH_CONTAINER_WIDTH } from '../components/Search';
import { SEARCH_LOCATION } from '../constants/trackerProperties';

const ORGANIZATION_LOGO_HEIGHT = 200;

@connect()
class Home extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    }

    static contextTypes = {
        auth: InternalPropTypes.AuthContext.isRequired,
        device: InternalPropTypes.DeviceContext.isRequired,
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
    }

    state = {
        focused: false,
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    styles() {
        const { largerDevice, mobileOS } = this.context.device;
        return this.css({
            focused: this.state.focused || largerDevice,
            smallerDeviceFocused: this.state.focused && !largerDevice && mobileOS,
            searchHeader: largerDevice || !mobileOS,
        });
    }

    classes() {
        return {
            'default': {
                header: {
                    display: 'none',
                },
                organizationLogo: {
                    alignSelf: 'center',
                    maxHeight: ORGANIZATION_LOGO_HEIGHT,
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                },
                organizationLogoSection: {
                    paddingTop: '20vh',
                    paddingBottom: '2vh',
                },
                organizationLogoPlaceholder: {
                    height: ORGANIZATION_LOGO_HEIGHT,
                },
                poweredBy: {
                    fontSize: '10px',
                    lineHeight: '14px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    ...fontColors.extraLight,
                    ...fontWeights.semiBold,
                },
                poweredBySection: {
                    paddingTop: 20,
                },
                root: {
                    height: '100%',
                    paddingBottom: 20,
                    width: '100%',
                },
                searchSection: {
                    paddingLeft: 20,
                    paddingRight: 20,
                },
                SearchComponent: {
                    inputContainerStyle: {
                        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, .09)',
                    },
                },
                wrap: {
                    position: 'relative',
                },
            },
            focused: {
                SearchComponent: {
                    inputContainerStyle: {
                        borderRadius: '0px',
                    },
                    focused: true,
                    resultsListStyle: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                },
            },
            'smallerDeviceFocused': {
                organizationLogoSection: {
                    display: 'none',
                },
                poweredBySection: {
                    display: 'none',
                },
                'root': {
                    paddingBottom: 0,
                },
                'searchSection': {
                    paddingTop: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                },
                SearchComponent: {
                    inputContainerStyle: {
                        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
                    },
                    showCancel: true,
                    style: {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                },
                wrap: {
                    marginBottom: 0,
                },
            },
            'searchHeader': {
                header: {
                    display: 'initial',
                    position: 'relative',
                },
                HeaderMenu: {
                    style: {
                        paddingTop: 22,
                        paddingRight: 22,
                    },
                },
                organizationLogoSection: {
                    paddingTop: '2vh',
                },
                SearchComponent: {
                    alwaysActive: true,
                },
            },
        };
    }

    getOrganizationImage() {
        const { organization } = this.context.auth;
        const imageUrl = organization.image_url;
        if (imageUrl) {
            return <img className="row" src={imageUrl} style={this.styles().organizationLogo} />;
        } else {
            return <div style={this.styles().organizationLogoPlaceholder} />;
        }
    }

    handleFocusSearch(event) {
        this.setState({focused: true});
        // Offset mobile browsers trying to scroll to focus the element.
        if (this.context.device.mobileOS) {
            resetScroll();
        }
    }

    handleCancelSearch() {
        this.setState({focused: false});
    }

    render() {
        return (
            <div style={this.styles().root}>
                <header style={this.styles().header}>
                    <div className="row end-xs">
                        <HeaderMenu
                            dispatch={this.props.dispatch}
                            {...this.styles().HeaderMenu}
                        />
                    </div>
                </header>
                <section className="wrap" style={this.styles().wrap}>
                    <section style={this.styles().organizationLogoSection}>
                        <div>
                            <div className="row center-xs">
                                {this.getOrganizationImage()}
                            </div>
                        </div>
                    </section>
                    <section style={this.styles().searchSection}>
                        <div>
                            <SearchComponent
                                className="row center-xs"
                                onCancel={::this.handleCancelSearch}
                                onFocus={::this.handleFocusSearch}
                                searchContainerWidth={660}
                                searchLocation={SEARCH_LOCATION.HOME}
                                {...this.styles().SearchComponent}
                            />
                        </div>
                    </section>
                    <section style={this.styles().poweredBySection}>
                        <div className="row center-xs">
                            <span style={this.styles().poweredBy}>{t('Built by Luno. Powered by you.')}</span>
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

export default Home;
