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

const createTeamSelector = selectors.createImmutableSelector(
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

let contactTypes = [];
_.forIn(ContactMethodV1.TypeV1, (value, type) => {
    const label = _.capitalize(type.toLowerCase());
    contactTypes.push({label: t(label), value: value});
});

const ContactRecord = ({record}) => {
    const styles = {
        type: {
            float: 'left',
            marginRight: 20,
            width: 150,
        },
        value: {
            float: 'left',
            width: 250,
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

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        const { contacts } = this.props.fields;
        if (contacts.length === 0) {
            contacts.addField();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
            this.setInitialValues();
        }
    }

    setInitialValues() {
        const { dispatch, team } = this.props;

        let contacts = team.contact_methods.map(c => {
            return {type: c.type, value: c.value};
        });
        if (contacts.length === 0) {
            contacts.push({type: ContactMethodV1.TypeV1.EMAIL, value: ''});
        }

        const action = initialize(EDIT_TEAM, {
            contacts: contacts,
            name: team.name,
            description: team.description.value,
        }, fieldNames);

        dispatch(action);
    }

    handleAddContact = () => {
        this.props.fields.contacts.addField();
    }

    buildUpdateHandler() {
        return this.props.handleSubmit(({contacts, name, description}, dispatch) => {
            let team = {
                ...this.props.team,
                /*eslint-disable camelcase*/
                contact_methods: contacts.map(c => new ContactMethodV1({
                    value: c.value,
                    type: c.type,
                })),
                /*eslint-enable camelcase*/
                name: name,
            };

            team.description.value = description;
            dispatch(updateTeam(team));
        });
    }

    handleCancel() {
        this.props.dispatch(hideTeamEditModal());
    }

    render() {
        const {
            fields: { contacts, description, name },
            formSubmitting,
            visible,
        } = this.props;

        return (
            <FormDialog
                onCancel={::this.handleCancel}
                onSubmit={this.buildUpdateHandler()}
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
                <FormLabel text={t('Description')} />
                <FormTextArea
                    placeholder={t('What are the responsibilities or the purpose of this team?')}
                    {...description}
                />
                <FormLabel text={t('Contact')} />
                <FormRecordList
                    component={ContactRecord}
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
    createTeamSelector
)(TeamEditForm);
