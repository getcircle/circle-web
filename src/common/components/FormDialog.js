import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';
import Form from './Form';

export default class FormDialog extends CSSComponent {
    static propTypes = {
        children: PropTypes.node,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        pageType: PropTypes.string.isRequired,
        style: PropTypes.object,
        submitLabel: PropTypes.string.isRequired,
        submitting: PropTypes.bool,
        title: PropTypes.string,
    };

    classes() {
        return {
            default: {
                formContainer: {
                    backgroundColor: 'rgb(255, 255, 255)',
                    padding: 0,
                    width: '100%',
                },
            },
        };
    }

    show() {
        this.refs.modal.show();
    }

    dismiss() {
        this.refs.modal.dismiss();
    }

    renderForm() {
        const { children, onSubmit, submitting } = this.props;

        return (
            <div className="col-xs center-xs" style={this.styles().formContainer}>
                <Form
                    onSubmit={onSubmit}
                    submitting={submitting}
                >
                    {children}
                </Form>
            </div>
        )
    }

    render() {
        const { onCancel, onSubmit, pageType, submitLabel, title } = this.props;

        return (
            <div >
                <Dialog
                    dialogDismissLabel={t('Cancel')}
                    dialogSaveLabel={submitLabel}
                    onSave={onSubmit}
                    onRequestClose={onCancel}
                    pageType={pageType}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={title}
                >
                    <div className="row center-xs">
                        {this.renderForm()}
                    </div>
                </Dialog>
            </div>
        );
    }
}
