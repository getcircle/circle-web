import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { createTeam } from '../actions/teams';
import { CREATE_TEAM } from '../constants/forms';
import { hideFormDialog } from '../actions/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import { routeToTeam } from '../utils/routes';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { teamValidator } from '../utils/validators';

import InternalPropTypes from './InternalPropTypes';
import FormDialog from './FormDialog';
import FormPeopleSelector from './FormPeopleSelector';
import FormLabel from './FormLabel';
import FormTextArea from './FormTextArea';
import FormTextField from './FormTextField';

const selector = selectors.createImmutableSelector(
    [selectors.formDialogsSelector],
    (formDialogsState) => {
        const formState = formDialogsState.get(CREATE_TEAM);
        return {
            formSubmitting: formState.get('formSubmitting'),
            id: formState.getIn(['payload', 'result']),
            visible: formState.get('visible'),
        };
    }
);

class CreateTeamForm extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        id: PropTypes.string,
        resetForm: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
        }

        if (!this.props.id && nextProps.id) {
            routeToTeam({id: nextProps.id});
        }
    }

    submit = (form, dispatch) => {
        let members;
        const { name, description, people } = form;
        if (people) {
            /*eslint-disable camelcase*/
            members = people.map(profile => new services.team.containers.TeamMemberV1({profile_id: profile.id}));
            /*eslint-enable camelcase*/
        }
        dispatch(createTeam(name, description, members));
    }

    handleCancel = () => {
        this.props.dispatch(hideFormDialog(CREATE_TEAM));
    }

    render() {
        const {
            fields: { name, description, people},
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;
        const { auth: { profile } } = this.context;

        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.CREATE_TEAM}
                submitLabel={t('Create')}
                submitting={formSubmitting}
                title={t('Create Team')}
                visible={visible}
            >
                <FormLabel text={t('Team Name')} />
                <FormTextField
                    placeholder={t('Marketing, IT, etc.')}
                    {...name}
                />
                <FormLabel text={t('Invite Others To Join')} />
                <FormPeopleSelector
                    ignoreProfileIds={[profile.id]}
                    {...people}
                />
                <FormLabel text={t('Description')} />
                <FormTextArea
                    placeholder={t('What are the responsibilities or the purpose of this team?')}
                    {...description}
                />
            </FormDialog>
        );
    }
}

CreateTeamForm.contextTypes = {
    auth: InternalPropTypes.AuthContext.isRequired,
};

export { CreateTeamForm };
export default reduxForm(
    {
      form: CREATE_TEAM,
      fields: ['name', 'description', 'people'],
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: teamValidator,
    },
    selector
)(CreateTeamForm);
