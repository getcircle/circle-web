import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { backgroundColors, canvasColor, fontColors } from '../constants/styles';
import { getAuthenticatedProfile } from '../reducers/authentication';
import { resetScroll } from '../utils/window';
import { SEARCH_LOCATION } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import DetailContent from '../components/DetailContent';
import Header from '../components/Header';
import { default as SearchComponent } from '../components/Search';

const selector = createSelector(
    [
        selectors.authenticationSelector,
        selectors.cacheSelector,
        selectors.responsiveSelector,
        selectors.routerParametersSelector,
    ],
    (authenticationState, cacheState, responsiveState, routerParamsState) => {
        const profile = getAuthenticatedProfile(authenticationState, cacheState.toJS());
        return {
            authenticatedProfile: profile,
            flags: authenticationState.get('flags'),
            largerDevice: responsiveState.get('largerDevice'),
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            organization: authenticationState.get('organization'),
        }
    },
);

@connect(selector)
class Search extends CSSComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        dispatch: PropTypes.func.isRequired,
        flags: PropTypes.object,
        largerDevice: PropTypes.bool.isRequired,
        managesTeam: PropTypes.object,
        mobileOS: PropTypes.bool.isRequired,
        organization: PropTypes.object.isRequired,
        params: PropTypes.shape({
            query: PropTypes.string.isRequired,
        }).isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        mixins: PropTypes.object,
        muiTheme: PropTypes.object.isRequired,
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        flags: PropTypes.object,
        mobileOS: PropTypes.bool.isRequired,
    }

    state = {
        focused: false,
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
            flags: this.props.flags,
            mobileOS: this.props.mobileOS,
        };
    }

    // componentWillMount() {
    //     this.loadSearchResults(this.props);
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.params.query !== this.props.params.query) {
    //         this.loadSearchResults(nextProps);
    //     }
    // }

    // loadSearchResults(props) {
    //     resetScroll();
    // }

    classes() {
        return {
            default: {
                canvasContainer: {
                    backgroundColor: canvasColor,
                },
                pageHeaderText: {
                    ...fontColors.dark,
                    fontSize: 28,
                    fontWeight: 300,
                    padding: '20px 0 40px 0',
                },
                Search: {
                    inputContainerStyle: {
                        boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, .09)',
                    },
                    resultsListStyle: {
                        height: 'initial',
                        marginTop: 1,
                        maxWidth: '800px',
                        opacity: 1,
                        position: 'absolute',
                        top: '205px',
                        width: '100%',
                        ...backgroundColors.light,
                    },
                    style: {
                        alignSelf: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }
                },
                searchTerm: {
                    fontStyle: 'italic',
                },
            },
            focused: {
                Search: {
                    inputContainerStyle: {
                        borderRadius: '0px',
                    },
                    focused: true,
                    resultsListStyle: {
                        height: 'initial',
                        marginTop: 1,
                        maxWidth: '800px',
                        opacity: 1,
                        position: 'absolute',
                        top: '205px',
                        width: '100%',
                        ...backgroundColors.light,
                    },
                },
            },
        };
    }

    styles() {
        console.log('Focused CSS ' + this.state.focused);
        return this.css({
            focused: this.state.focused,
        });
    }

    handleFocusSearch() {
        console.log('set focus');
        this.setState({focused: true});
    }

    handleBlurSearch() {
        console.log('resetting');
        this.setState({focused: false});
    }

    renderHeaderActionsContainer() {
        console.log('Focused '  + this.state.focused);

        return (
            <SearchComponent
                canExplore={false}
                className="center-xs"
                is="Search"
                largerDevice={true}
                onBlur={::this.handleBlurSearch}
                onFocus={::this.handleFocusSearch}
                organization={this.props.organization}
                params={this.props.params}
                retainResultsOnBlur={true}
                searchLocation={SEARCH_LOCATION.PAGE_HEADER}
            />
        );
    }

    render() {
        const {
            authenticatedProfile,
            params,
        } = this.props;

        return (
            <Container>
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    profile={authenticatedProfile}
                    {...this.props}
                />
                <DetailContent>
                    <div>
                        <h3 is="pageHeaderText">
                            {t('Search Results')}
                            &nbsp;&ndash;&nbsp;<span is="searchTerm">&ldquo;{params.query}&rdquo;</span>
                        </h3>
                    </div>
                </DetailContent>
            </Container>
        );
    }
}

export default Search;
