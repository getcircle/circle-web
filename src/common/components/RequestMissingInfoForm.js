import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { requestMissingInfo } from '../actions/search';
import { hideFormDialog } from '../actions/forms';
import { REQUEST_MISSING_INFO } from '../constants/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { requestMissingInfoValidator } from '../utils/validators';

import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormTextArea from './FormTextArea';

const selector = selectors.createImmutableSelector(
    [selectors.formDialogsSelector],
    (formDialogsState) => {
        const formState = formDialogsState.get(REQUEST_MISSING_INFO);
        return {
            formSubmitting: formState.get('submitting'),
            visible: formState.get('visible'),
        };
    }
);

export class RequestMissingInfoForm extends Component {

    static propTypes = {
        fields: PropTypes.object.isRequired,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        query: PropTypes.string,
        resetForm: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    static contextTypes = {
        store: PropTypes.shape({
             dispatch: PropTypes.func.isRequired,
        }).isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.props.resetForm();
        }
    }

    submit = (form, dispatch) => {
        const { infoRequest } = form;
        const { query } = this.props;
        dispatch(requestMissingInfo(query, infoRequest));
    }

    handleCancel = () => {
        this.context.store.dispatch(hideFormDialog(REQUEST_MISSING_INFO));
    }

    render() {
        const {
            fields: { infoRequest },
            formSubmitting,
            handleSubmit,
            visible,
        } = this.props;

        return (
            <FormDialog
                modal={true}
                onCancel={this.handleCancel}
                onSubmit={handleSubmit(this.submit)}
                pageType={PAGE_TYPE.REQUEST_MISSING_INFO}
                submitLabel={t('Request')}
                submitting={formSubmitting}
                title={t('Request Missing Info')}
                visible={visible}
            >
                <FormLabel text={t('What were you trying to find?')} />
                <FormTextArea
                    placeholder={t('E.g.: I\'m looking for product spec, benefits info, roadmap, etc.')}
                    {...infoRequest}
                />
            </FormDialog>
        );
    }
}

export default reduxForm(
    {
      form: REQUEST_MISSING_INFO,
      fields: ['infoRequest'],
      getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint),
      validate: requestMissingInfoValidator,
    },
    selector
)(RequestMissingInfoForm);
