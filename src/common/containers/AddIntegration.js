import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as selectors from '../selectors';
import connectData from '../utils/connectData';
import { getIntegrationAuthenticationInstructions } from '../actions/authentication';
import { getNextPathname, routeToURL } from '../utils/routes';
import { providerForIntegration } from '../utils/integrations';

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
