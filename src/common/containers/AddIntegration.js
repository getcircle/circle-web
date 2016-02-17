import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { services } from 'protobufs';

import * as selectors from '../selectors';
import connectData from '../utils/connectData';
import { getIntegrationAuthenticationInstructions } from '../actions/authentication';
import { getNextPathname, routeToURL } from '../utils/routes';
import { IntegrationString } from '../utils/Integrations';

import CSSComponent from '../components/CSSComponent';
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

function fetchData(getState, dispatch, location, params, url) {
    const { integration } = params;
    return Promise.all([
        dispatch(getIntegrationAuthenticationInstructions(providerForIntegration(integration), url)),
    ]);
}

function providerForIntegration(integration) {
    switch (integration) {
        case IntegrationString.SLACK:
            return services.user.containers.IdentityV1.ProviderV1.SLACK;
            break;
    }
}

@connectData(fetchData)
@connect(selector)
class AddIntegration extends CSSComponent {

    static propTypes = {
        authorizationUrl: PropTypes.string,
        dispatch: PropTypes.func.isRequired,
        params: PropTypes.shape({
            integration: PropTypes.string.isRequired,
        }).isRequired,
    }

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        location: PropTypes.object,
    }

    componentDidUpdate(prevProps, prevState) {
        const { authorizationUrl } = this.props;
        const nextPathname = getNextPathname(this.context.location, '/');
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
