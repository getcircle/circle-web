import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes } from 'react';

import * as selectors from '../selectors';

import HeaderMenu from '../components/HeaderMenu';
import CSSComponent from '../components/CSSComponent';
import { default as SearchComponent, SEARCH_CONTAINER_WIDTH } from '../components/SearchV2';

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
class Search extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        organization: PropTypes.object.isRequired,
        profile: PropTypes.object.isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.authenticated) {
            return false;
        }
        return true;
    }

    classes() {
        return {
            'default': {
                organizationLogo: {
                    maxHeight: 200,
                    maxWidth: SEARCH_CONTAINER_WIDTH,
                    width: '100%',
                },
                organizationLogoSection: {
                    marginTop: 15,
                },
                root: {
                    minHeight: '100vh',
                    backgroundColor: '#222',
                    paddingBottom: 20,
                },
                searchSection: {
                    paddingTop: 52,
                },
            },
        };
    }

    render() {
        return (
            <div is="root">
                <header>
                    <div className="row end-xs">
                        <HeaderMenu dispatch={this.props.dispatch} profile={this.props.profile}/>
                    </div>
                </header>
                <section className="wrap">
                    <section is="organizationLogoSection">
                        <div className="row">
                            <div className="col-xs center-xs">
                                <img is="organizationLogo" src={this.props.organization.image_url} />
                            </div>
                        </div>
                    </section>
                    <section is="searchSection">
                        <div className="row">
                            <SearchComponent className="col-xs center-xs" dispatch={this.props.dispatch} organization={this.props.organization} />
                        </div>
                    </section>
                </section>
            </div>
        );
    }
}

export default Search;
