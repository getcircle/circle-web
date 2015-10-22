import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import logger from '../utils/logger';
import { resetScroll } from '../utils/window';
import * as selectors from '../selectors';
import { updateProfile } from '../actions/profiles';

import Container from '../components/Container';
import { default as EditorComponent } from '../components/Editor';
import PureComponent from '../components/PureComponent';

const { ProfileStatusV1 } = services.profile.containers;

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

    state = {
        // TODO: Remove TEMP CODE
        statusId: '',
        saving: false,
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

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.authenticatedProfile &&
            nextProps.authenticatedProfile.status &&
            nextProps.authenticatedProfile.status.id) {
            this.setState({
                statusId: nextProps.authenticatedProfile.status.id,
            });
        }
    }

    onSavePost(title, body) {
        logger.log('Saving Post');
        logger.log(body);

        if (body === '') {
            return;
        }

        // TODO: Remove TEMP CODE
        const {
            authenticatedProfile,
        } = this.props;

        let profile = authenticatedProfile;
        let profileStatusV1;

        if (this.state.statusId === '') {
            logger.log('CREATING NEW STATUS');
            profileStatusV1 = new ProfileStatusV1({
                value: body,
            });
        }
        else {
            logger.log('SAVING EXISTING STATUS');
            profileStatusV1 = Object.assign({}, profile.status, {
                value: body,
                id: this.state.statusId
            });
        }

        let updatedProfile = Object.assign({}, profile, {
            status: profileStatusV1,
        });

        this.props.dispatch(updateProfile(updatedProfile));
    }

    render() {
        const {
            largerDevice,
        } = this.props;

        return (
            <Container>
                <EditorComponent
                    largerDevice={largerDevice}
                    onSaveCallback={::this.onSavePost}
                />
            </Container>
        );
    }
}

export default Editor;
