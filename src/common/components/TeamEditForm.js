import React, { PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { EDIT_TEAM } from '../constants/forms';
import { updateTeam } from '../actions/teams';
import { hideFormDialog } from '../actions/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { teamValidator } from '../utils/validators';

import CSSComponent from  './CSSComponent';
import FormContactList from './FormContactList';
import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormTextArea from './FormTextArea';
import FormTextField from './FormTextField';

const { ContactMethodV1 } = services.team.containers;

const selector = selectors.createImmutableSelector(
    [selectors.formDialogsSelector],
    (formDialogsState) => {
        const formState = formDialogsState.get(EDIT_TEAM);
        return {
            formSubmitting: formState.get('submitting'),
            visible: formState.get('visible'),
        };
    }
);

const fieldNames = [
    'name',
    'contacts[].type',
    'contacts[].value',
    'description',
];

export class TeamEditForm extends CSSComponent {

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
            this.setInitialValues();
        }
    }

    setInitialValues() {
        const { dispatch, team } = this.props;

        const contacts = team.contact_methods.map(c => {
            return {type: c.type || ContactMethodV1.TypeV1.EMAIL, value: c.value};
        });

        const action = initialize(EDIT_TEAM, {
            contacts,
            name: team.name,
            description: team.description && team.description.value,
        }, fieldNames);

        dispatch(action);
    }

    submit = ({contacts, name, description}, dispatch) => {
        const team = {
            ...this.props.team,
            /*eslint-disable camelcase*/
            contact_methods: contacts.map(c => new ContactMethodV1({
                value: c.value,
                type: c.type,
            })),
            description: {value: description},
            /*eslint-enable camelcase*/
            name,
        };

        dispatch(updateTeam(team));
    }

    handleCancel() {
        this.props.dispatch(hideFormDialog(EDIT_TEAM));
    }

    render() {
        const {
            fields: { contacts, description, name },
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;

        return (
            <FormDialog
                modal={true}
                onCancel={::this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.EDIT_TEAM}
                submitLabel={t('Update')}
                submitting={formSubmitting}
                title={t('Edit Team')}
                visible={visible}
            >
                <FormLabel text={t('Team Name')} />
                <FormTextField
                    placeholder={t('Marketing, IT, etc.')}
                    {...name}
                 />
                <FormLabel optional={true} text={t('Description')} />
                <FormTextArea
                    placeholder={t('What are the responsibilities or the purpose of this team?')}
                    {...description}
                />
                <FormLabel text={t('Contact')} />
                <FormContactList
                    contacts={contacts}
                    defaultType={ContactMethodV1.TypeV1.EMAIL}
                    types={ContactMethodV1.TypeV1}
                />
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: EDIT_TEAM,
      fields: fieldNames,
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: teamValidator,
    },
    selector
)(TeamEditForm);
