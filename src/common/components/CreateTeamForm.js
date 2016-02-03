import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { createTeam, hideModal } from '../actions/teams';
import { fontColors, fontWeights } from '../constants/styles';
import * as messageTypes from '../constants/messageTypes';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { teamValidator } from '../utils/validators';

import CSSComponent from  './CSSComponent';
import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import TextArea from './TextArea';
import TextField from './TextField';

const teamSelector = selectors.createImmutableSelector(
    [
        selectors.teamSelector,
    ],
    (
        teamState,
    ) => {
        return {
            formSubmitting: teamState.get('formSubmitting'),
            visible: teamState.get('modalVisible'),
        };
    }
);

class CreateTeamForm extends CSSComponent {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.refs.modal.show();
        }

        if (this.props.visible && !nextProps.visible) {
            this.refs.modal.dismiss();
            this.props.resetForm();
        }
    }

    classes() {
        return {
            default: {
            },
        };
    }

    buildCreateHandler() {
        return this.props.handleSubmit(({name, description}, dispatch) => {
            dispatch(createTeam(name, description));
        })
    }

    handleCancel() {
        this.props.dispatch(hideModal());
    }

    render() {
        const { fields: { name, description }, formSubmitting } = this.props;

        return (
            <FormDialog
                onCancel={this.handleCancel.bind(this)}
                onSubmit={this.buildCreateHandler()}
                pageType={PAGE_TYPE.CREATE_TEAM}
                ref="modal"
                submitLabel={t('Save')}
                submitting={formSubmitting}
                title={t('Create Team')}
            >
                <FormLabel text={t('Team Name')} />
                <TextField
                    placeholder={t('Marketing, IT, etc.')}
                    {...name}
                 />
                <FormLabel text={t('Description')} />
                <TextArea
                    placeholder={t('What are the responsibilities or the purpose of this team?')}
                    {...description}
                />
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: 'createTeam',
      fields: ['name', 'description'],
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: teamValidator,
    },
    teamSelector
)(CreateTeamForm);
