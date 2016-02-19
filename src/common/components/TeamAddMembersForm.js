import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { ADD_MEMBERS } from '../constants/forms';
import { hideAddMembersModal, addMembers } from '../actions/teams';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';

import FormDialog from './FormDialog';
import CSSComponent from  './CSSComponent';
import FormLabel from './FormLabel';
import FormPeopleSelector from './FormPeopleSelector';

const selector = selectors.createImmutableSelector(
    [
        selectors.addMembersSelector,
    ],
    (
        addMembersState,
    ) => {
        return {
            formSubmitting: addMembersState.get('formSubmitting'),
            visible: addMembersState.get('modalVisible'),
        };
    }
);

const fieldNames = [
    'coordinators',
    'members',
];

export class TeamAddMembersForm extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        team: PropTypes.instanceOf(services.team.containers.TeamV1).isRequired,
        visible: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
        }
    }

    submit = ({ coordinators = [], members = [] }, dispatch) => {
        function makeMember(profile, role) {
            return new services.team.containers.TeamMemberV1({
                /*eslint-disable camelcase*/
                profile_id: profile.id,
                /*eslint-enable camelcase*/
                role: role,
            });
        }

        const { MEMBER, COORDINATOR } = services.team.containers.TeamMemberV1.RoleV1;

        const newMembers = [];
        for (let profile of coordinators) {
            const member = makeMember(profile, COORDINATOR);
            newMembers.push(member);
        }

        for (let profile of members) {
            const member = makeMember(profile, MEMBER);
            newMembers.push(member);
        }

        dispatch(addMembers(this.props.team.id, newMembers));
    }

    handleCancel() {
        this.props.dispatch(hideAddMembersModal());
    }

    render() {
        const {
            fields: { coordinators, members },
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;

        return (
            <FormDialog
                modal={true}
                onCancel={::this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.ADD_MEMBERS}
                submitLabel={t('Add People')}
                submitting={formSubmitting}
                title={t('Add People')}
                visible={visible}
            >
                <FormLabel text={t('Coordinators')} />
                { /* We need to boost the z-index for the first selector so the one below it doesn't interfere with the results list */ }
                <FormPeopleSelector listContainerStyle={{zIndex: 99999}} {...coordinators} />
                <FormLabel text={t('Members')} />
                <FormPeopleSelector {...members} />
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: ADD_MEMBERS,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
    },
    selector
)(TeamAddMembersForm);
