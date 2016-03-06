import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { provideHooks } from 'redial';

import * as selectors from '../selectors';
import { getIntegrationAuthenticationInstructions } from '../actions/authentication';
import { getNextPathname, routeToURL } from '../utils/routes';
import { providerForIntegration } from '../utils/integrations';

import Container from '../components/Container';
import CenterLoadingIndicator from '../components/CenterLoadingIndicator';

const selector = createSelector(
    [selectors.authenticationSelector],
    (authenticationState) => {
        return {
            authorizationUrl: authenticationState.get('authorizationUrl'),
        }
    },
)

const hooks = {
    fetch: ({ dispatch, params: { integration }, url }) => {
        const provider = providerForIntegration(integration);
        return dispatch(getIntegrationAuthenticationInstructions(provider, url));
    },
};

@provideHooks(hooks)
@connect(selector)
class AddIntegration extends Component {

    static propTypes = {
        authorizationUrl: PropTypes.string,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        params: PropTypes.shape({
            integration: PropTypes.string.isRequired,
        }).isRequired,
    }

    static contextTypes = {
        location: PropTypes.object,
    }

    componentDidUpdate(prevProps, prevState) {
        const { authorizationUrl } = this.props;
        const nextPathname = getNextPathname(this.props.location, '/');
        if (authorizationUrl) {
            routeToURL(authorizationUrl, nextPathname);
        }
    }

    render() {
        return (
            <Container>
                <CenterLoadingIndicator />
            </Container>
        );
    }
}

export default AddIntegration;
