import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import logger from '../utils/logger';
import { resetScroll } from '../utils/window';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { updateProfile } from '../actions/profiles';

import Container from '../components/Container';
import CSSComponent from '../components/CSSComponent';
import { default as EditorComponent } from '../components/Editor';
import Header from '../components/Header';

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
            managesTeam: authenticationState.get('managesTeam'),
            mobileOS: responsiveState.get('mobileOS'),
            organization: authenticationState.get('organization'),
        }
    }
);

@connect(selector)
class Editor extends CSSComponent {

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
                saving: false,
            });
        }
    }

    classes() {
        return {
            default: {
                headerActionButtonLabel: {
                    color: '#8598FF',
                    fontSize: 16,
                    textTransform: 'none',
                },
                headerActionButton: {
                    backgroundColor: 'transparent',
                    borderRadius: '20px',
                    border: '1px solid #8598FF',
                },
                headerActionContainer: {
                    width: '100%',
                },
                headerMessageText: {
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: 14,
                    marginRight: '20px',
                }
            },
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

        this.setState({
            saving: true,
        });

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

    onPublishButtonTapped() {

    }

    getProgressMessage() {
        if (this.state.saving) {
            return t('(Saving...)');
        } else if (this.state.statusId !== '') {
            return t('(Saved)');
        }
    }

    renderHeaderActionsContainer() {
        return (
            <div className="row middle-xs between-xs" is="headerActionContainer">
                <div is="headerMessageText">
                    <span>Draft {this.getProgressMessage()}</span>
                </div>
                <div>
                    <FlatButton
                        is="headerActionButton"
                        label={t('Publish')}
                        labelStyle={this.styles().headerActionButtonLabel}
                        onTouchTap={::this.onPublishButtonTapped}
                    />
                </div>
            </div>
        );
    }

    render() {
        const {
            authenticatedProfile,
            largerDevice,
        } = this.props;

        return (
            <Container>
                <Header
                    actionsContainer={this.renderHeaderActionsContainer()}
                    profile={authenticatedProfile}
                    {...this.props}
                />
                <EditorComponent
                    largerDevice={largerDevice}
                    onSaveCallback={::this.onSavePost}
                />
            </Container>
        );
    }
}

export default Editor;
