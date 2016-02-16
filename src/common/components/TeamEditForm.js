import _ from 'lodash';
import React, { PropTypes } from 'react';
import { initialize, reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { EDIT_TEAM } from '../constants/forms';
import { hideTeamEditModal, updateTeam } from '../actions/teams';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { teamValidator } from '../utils/validators';

import FormDialog from './FormDialog';
import CSSComponent from  './CSSComponent';
import FormLabel from './FormLabel';
import FormRecordList from './FormRecordList';
import FormSelectField from './FormSelectField';
import FormTextArea from './FormTextArea';
import FormTextField from './FormTextField';

const { ContactMethodV1 } = services.team.containers;

const selector = selectors.createImmutableSelector(
    [
        selectors.updateTeamSelector,
    ],
    (
        updateTeamState,
    ) => {
        return {
            formSubmitting: updateTeamState.get('formSubmitting'),
            visible: updateTeamState.get('modalVisible'),
        };
    }
);

const fieldNames = [
    'name',
    'contacts[].type',
    'contacts[].value',
    'description',
];

const contactTypes = [];
_.forIn(ContactMethodV1.TypeV1, (value, type) => {
    const label = _.capitalize(type.toLowerCase());
    contactTypes.push({label: t(label), value: value});
});

const ContactRecord = ({record}) => {
    const styles = {
        type: {
            float: 'left',
            marginRight: 15,
            width: 128,
        },
        value: {
            float: 'left',
            width: 384,
        },
    };

    return (
        <div>
            <div style={styles.type}>
                <FormSelectField
                    choices={contactTypes}
                    {...record.type}
                />
            </div>
            <div style={styles.value}>
                <FormTextField
                    {...record.value}
                />
            </div>
        </div>
    );
};

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
        this.props.dispatch(hideTeamEditModal());
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
                <FormRecordList
                    component={ContactRecord}
                    defaultRecord={{type: ContactMethodV1.TypeV1.EMAIL, value: ''}}
                    records={contacts}
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
