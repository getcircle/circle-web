import React, { Component, PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { CREATE_COLLECTION } from '../../constants/forms';
import t from '../../utils/gettext';
import { collectionValidator } from '../../utils/validators';

import ClickAwayListener from '../ClickAwayListener';
import FormLabel from '../FormLabel';
import FormSelectField from '../FormSelectField';
import FormTextField from '../FormTextField';
import InternalPropTypes from '../InternalPropTypes';
import PrimaryRoundedButton from '../PrimaryRoundedButton';

const { OwnerTypeV1 } = services.post.containers.CollectionV1;
const { COORDINATOR } = services.team.containers.TeamMemberV1.RoleV1;

const FIELD_NAMES = ['name', 'owner'];

const styles = {
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        marginBottom: 25, marginTop: 35}
}

class NewCollectionForm extends Component {

    componentWillMount() {
        this.setInitialValues(this.props);
    }

    setInitialValues(props) {
        const { dispatch, initialName } = props;
        const { auth: { profile: owner } } = this.context;
        const action = initialize(CREATE_COLLECTION, {
            name: initialName,
            owner
        }, FIELD_NAMES);
        dispatch(action);
    }

    submit = ({ name, owner }) => {
        const { onCreate } = this.props;
        const { auth: { profile } } = this.context;
        let displayName, ownerType;
        if (owner.id === profile.id) {
            displayName = name;
            ownerType = OwnerTypeV1.PROFILE;
        } else {
            displayName = `[${ owner.name }] ${ name }`;
            ownerType = OwnerTypeV1.TEAM;
        }
        const collection = new services.post.containers.CollectionV1({
            /*eslint-disable camelcase*/
            display_name: displayName,
            name,
            owner_type: ownerType,
            owner_id: owner.id,
            /*eslint-enable camelcase*/
        });
        onCreate(collection);
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.handleSubmit(this.submit)(event);
        }
    }

    handleSubmit = (event) => {
        event.stopPropagation();
        this.props.handleSubmit(this.submit)(event);
    }

    render() {
        const {
            buttonText,
            fields: { name, owner },
            handleSubmit,
            memberships,
            onClickAway,
            ...other,
        } = this.props;
        const { auth: { profile } } = this.context;
        const choices = [
            {label: t('My Collections'), value: profile},
        ];
        memberships.forEach(({ role, team }) => {
            if (role === COORDINATOR) {
                choices.push({label: team.name, value: team});
            }
        });
        return (
            <ClickAwayListener
                ignoredClassNames={['form-select-menu-item']}
                onClickAway={onClickAway}
                {...other}
            >
                <FormLabel text={t('New Collection')} />
                <FormTextField
                    autoFocus={true}
                    onKeyPress={this.handleKeyPress}
                    placeholder={t('Collection Name')}
                    {...name}
                />

                <FormLabel text={t('In')} />
                <FormSelectField
                    choices={choices}
                    width={320}
                    {...owner}
                />

                <div style={styles.buttonContainer}>
                    <PrimaryRoundedButton
                        label={buttonText}
                        onTouchTap={this.handleSubmit}
                        style={styles.button}
                    />
                </div>
            </ClickAwayListener>
        );
    }
}

NewCollectionForm.propTypes = {
    buttonText: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    initialName: PropTypes.string,
    memberships: PropTypes.array.isRequired,
    onClickAway: PropTypes.func,
    onCreate: PropTypes.func,
};

NewCollectionForm.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
};

export default reduxForm(
    {
        form: CREATE_COLLECTION,
        fields: FIELD_NAMES,
        getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
        validate: collectionValidator,
    },
)(NewCollectionForm);
