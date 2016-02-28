import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import { requestMissingInfo, hideRequestMissingInfoModal } from '../actions/search';
import { REQUEST_MISSING_INFO } from '../constants/forms';
import { PAGE_TYPE } from '../constants/trackerProperties';
import * as selectors from '../selectors';
import t from '../utils/gettext';
import { requestMissingInfoValidator } from '../utils/validators';

import FormDialog from './FormDialog';
import FormLabel from './FormLabel';
import FormTextArea from './FormTextArea';

const selector = selectors.createImmutableSelector(
    [
        selectors.requestMissingInfoSelector,
    ],
    (
        requestMissingInfoState,
    ) => {
        return {
            formSubmitting: requestMissingInfoState.get('formSubmitting'),
            visible: requestMissingInfoState.get('modalVisible'),
        };
    }
);

export class RequestMissingInfoForm extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        formSubmitting: PropTypes.bool,
        handleSubmit: PropTypes.func.isRequired,
        query: PropTypes.string,
        resetForm: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
    };

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
        this.props.dispatch(hideRequestMissingInfoModal());
    }

    render() {
        const {
            fields: {infoRequest},
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
