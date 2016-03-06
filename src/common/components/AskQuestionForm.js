import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { services } from 'protobufs';

import { hideFormDialog } from '../actions/forms';
import { ASK_QUESTION } from '../constants/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { questionValidator } from '../utils/validators';

import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormTextArea from './FormTextArea';
import FormTextField from './FormTextField';

const selector = selectors.createImmutableSelector(
    [
        selectors.formDialogsSelector,
    ],
    (
        formDialogsState,
    ) => {
        const questionDialogState = formDialogsState.get(ASK_QUESTION);
        return {
            submitting: questionDialogState.get('submitting'),
            visible: questionDialogState.get('visible'),
        };
    }
);

export class AskQuestionForm extends Component {

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
        }
    }

    submit = (values, dispatch) => {
        // TODO: dispatch action
    }

    handleCancel = () => {
        this.context.store.dispatch(hideFormDialog(ASK_QUESTION));
    }

    render() {
        const {
            fields: { subject, message },
            submitting,
            handleSubmit,
            profile,
            visible,
        } = this.props;

        const title = [t('Ask'), profile.first_name, t('a Question')].join(' ');
        const messagePlaceholder = [
            t('Give'),
            profile.first_name,
            t('a little more detail on how they can help you')
        ].join(' ')

        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.ASK_QUESTION}
                submitLabel={t('Send')}
                submitting={submitting}
                title={title}
                visible={visible}
            >
                <FormLabel text={t('Subject')} />
                <FormTextField
                    placeholder={t('What\'s your question?')}
                    {...subject}
                />
                <FormLabel text={t('Message')} />
                <FormTextArea
                    placeholder={messagePlaceholder}
                    {...message}
                />
            </FormDialog>
        );
    }
}

AskQuestionForm.propTypes = {
    fields: PropTypes.object.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    profile: PropTypes.instanceOf(services.profile.containers.ProfileV1).isRequired,
    resetForm: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
};

AskQuestionForm.contextTypes = {
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

export default reduxForm(
    {
      form: ASK_QUESTION,
      fields: ['subject', 'message'],
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: questionValidator,
    },
    selector
)(AskQuestionForm);
