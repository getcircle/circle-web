import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { resetScroll } from '../utils/window';
import * as selectors from '../selectors';

import Container from '../components/Container';
import { default as EditorComponent } from '../components/Editor';
import PureComponent from '../components/PureComponent';

const selector = selectors.createImmutableSelector(
    [
        selectors.authenticationSelector,
        selectors.responsiveSelector
    ],
    (authenticationState, responsiveState) => {
        return {
            authenticatedProfile: authenticationState.get('profile'),
            largerDevice: responsiveState.get('largerDevice'),
            mobileOS: responsiveState.get('mobileOS'),
        }
    }
);

@connect(selector)
class Editor extends PureComponent {

    static propTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
        dispatch: PropTypes.func.isRequired,
        largerDevice: PropTypes.bool.isRequired,
        mobileOS: PropTypes.bool.isRequired,
    }

    static childContextTypes = {
        authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
        mobileOS: PropTypes.bool.isRequired,
    }

    getChildContext() {
        return {
            authenticatedProfile: this.props.authenticatedProfile,
            mobileOS: this.props.mobileOS,
        };
    }

    componentWillMount() {
        resetScroll();
    }

    render() {
        const {
            largerDevice,
        } = this.props;

        return (
            <Container>
                <EditorComponent
                    largerDevice={largerDevice}
                />
            </Container>
        );
    }
}

export default Editor;
