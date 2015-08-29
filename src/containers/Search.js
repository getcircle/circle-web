import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';

import { fontColors, fontWeights, } from '../constants/styles';
import resizable from '../decorators/resizable';
import * as selectors from '../selectors';
import t from '../utils/getText';

import Blur from '../components/Blur';
import HeaderMenu from '../components/HeaderMenu';
import CSSComponent from '../components/CSSComponent';
import { default as SearchComponent, SEARCH_CONTAINER_WIDTH } from '../components/SearchV2';
import TabBar from '../components/TabBar';

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            profile: authenticationState.get('profile'),
            organization: authenticationState.get('organization'),
            authenticated: authenticationState.get('authenticated'),
        }
    },
);

@connect(selector)
@resizable
class Search extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        organization: PropTypes.object.isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    state = {
        focused: false,
    }

    styles() {
        return this.css({
            focused: this.state.focused,
        });
    }

    classes() {
        return {
            'default': {
                header: {
                    display: 'none',
                },
                organizationLogo: {
                    maxHeight: 200,
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                    width: '100%',
                },
                organizationLogoSection: {
                    paddingTop: '20vh',
                },
                poweredBy: {
                    fontSize: '10px',
                    lineHeight: '14px',
                    textTransform: 'uppercase',
                    ...fontColors.extraLight,
                    ...fontWeights.semiBold,
                },
                poweredBySection: {
                    paddingTop: 20,
                },
                root: {
                    backgroundColor: '#333',
                    height: '100%',
                    width: '100%',
                    paddingBottom: 20,
                },
                searchSection: {
                    paddingTop: 85,
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
            'focused': {
                organizationLogoSection: {
                    display: 'none',
                },
                poweredBySection: {
                    display: 'none',
                },
                'searchSection': {
                    paddingTop: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    transition: 'all 0.3s ease',
                },
                SearchComponent: {
                    inputContainerStyle: {
                        borderRadius: '0px',
                        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
                    },
                    focused: true,
                    resultsListStyle: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 0,
                        boxShadow: 'none',
                    },
                    style: {
                        paddingLeft: 0,
                        paddingRight: 0,
                    },
                },
                TabBar: {
                    style: {
                        display: 'none',
                    },
                },
            },
            'largerDevice': {
                header: {
                    display: 'initial',
                },
                organizationLogoSection: {
                    marginTop: 15,
                },
                TabBar: {
                    style: {
                        display: 'none',
                    },
                },
            },
        };
    }

    handleFocusSearch() {
        this.setState({focused: true});
    }

    handleBlurSearch() {
        // this.setState({focused: false});
    }

    render() {
        return (
            <Blur blurRadius={30} is="root">
                <header is="header">
                    <div className="row end-xs">
                        <HeaderMenu dispatch={this.props.dispatch} profile={this.props.profile}/>
                    </div>
                </header>
                <section className="wrap" is="wrap">
                    <section is="organizationLogoSection">
                        <div className="row">
                            <div className="col-xs center-xs">
                                <img is="organizationLogo" src={this.props.organization.image_url} />
                            </div>
                        </div>
                    </section>
                    <section is="searchSection">
                        <div className="row">
                            <SearchComponent
                                className="col-xs center-xs"
                                is="SearchComponent"
                                largerDevice={this.props.largerDevice}
                                onBlur={::this.handleBlurSearch}
                                onFocus={::this.handleFocusSearch}
                                organization={this.props.organization}
                            />
                        </div>
                    </section>
                    <section is="poweredBySection">
                        <div className="row center-xs">
                            <span is="poweredBy">{t('Powered by Circle')}</span>
                        </div>
                    </section>
                </section>
                <TabBar is="TabBar" />
            </Blur>
        );
    }
}

export default Search;
