import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from  './CSSComponent';
import Dialog from './Dialog';
import Form from './Form';

export default class FormDialog extends CSSComponent {
    static propTypes = {
        children: PropTypes.node,
        error: PropTypes.string,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        pageType: PropTypes.string.isRequired,
        style: PropTypes.object,
        submitLabel: PropTypes.string.isRequired,
        submitting: PropTypes.bool,
        title: PropTypes.string,
        warning: PropTypes.string,
        visible: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.visible && nextProps.visible) {
            this.refs.modal.show();
        }

        if (this.props.visible && !nextProps.visible) {
            this.refs.modal.dismiss();
        }
    }

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
        );
    }

    render() {
        const {
            error,
            onCancel,
            onSubmit,
            pageType,
            submitLabel,
            title,
            warning,
        } = this.props;

        return (
            <div >
                <Dialog
                    dialogDismissLabel={t('Cancel')}
                    dialogSaveLabel={submitLabel}
                    error={error}
                    onRequestClose={onCancel}
                    onSave={onSubmit}
                    pageType={pageType}
                    ref="modal"
                    repositionOnUpdate={false}
                    title={title}
                    warning={warning}
                >
                    <div className="row center-xs">
                        {this.renderForm()}
                    </div>
                </Dialog>
            </div>
        );
    }
}
